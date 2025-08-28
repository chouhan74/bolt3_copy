import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import MonacoEditor from './MonacoEditor';
import TestCasePanel from './TestCasePanel';
import ProctoringSecurity from './ProctoringSecurity';
import { Play, Clock, Save, AlertTriangle } from 'lucide-react';

interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeLimit: number;
  languages: string[];
  testCases: TestCase[];
  starterCode: { [language: string]: string };
}

interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  weight: number;
}

interface CodeSubmission {
  code: string;
  language: string;
  verdict: string;
  executionTime?: number;
  memoryUsed?: number;
  testResults: TestResult[];
}

interface TestResult {
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
  executionTime: number;
}

const QuestionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [violations, setViolations] = useState<string[]>([]);

  // Fetch question data with caching
  const { data: question, isLoading, error } = useQuery<Question>({
    queryKey: ['question', id],
    queryFn: async () => {
      const response = await fetch(`/api/questions/${id}`);
      if (!response.ok) throw new Error('Failed to fetch question');
      return response.json();
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });

  // Auto-save code mutation
  const autoSaveMutation = useMutation({
    mutationFn: async ({ code, language }: { code: string; language: string }) => {
      const response = await fetch(`/api/questions/${id}/autosave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });
      if (!response.ok) throw new Error('Failed to auto-save');
      return response.json();
    },
  });

  // Code execution mutation
  const executeMutation = useMutation<CodeSubmission, Error, { code: string; language: string }>({
    mutationFn: async ({ code, language }) => {
      const response = await fetch(`/api/questions/${id}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });
      if (!response.ok) throw new Error('Failed to execute code');
      return response.json();
    },
  });

  // Initialize code when question loads
  useEffect(() => {
    if (question && !code) {
      setCode(question.starterCode[selectedLanguage] || '');
      setTimeRemaining(question.timeLimit * 60); // Convert to seconds
    }
  }, [question, selectedLanguage, code]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Auto-submit when time runs out
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, handleSubmit]);

  // Auto-save code every 30 seconds
  useEffect(() => {
    if (!code) return;

    const autoSaveTimer = setTimeout(() => {
      autoSaveMutation.mutate({ code, language: selectedLanguage });
    }, 30000);

    return () => clearTimeout(autoSaveTimer);
  }, [code, selectedLanguage, autoSaveMutation]);

  // Memoized handlers to prevent unnecessary re-renders
  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
  }, []);

  const handleLanguageChange = useCallback((language: string) => {
    setSelectedLanguage(language);
    if (question?.starterCode[language]) {
      setCode(question.starterCode[language]);
    }
  }, [question]);

  const handleRunCode = useCallback(() => {
    if (!code.trim()) return;
    executeMutation.mutate({ code, language: selectedLanguage });
  }, [code, selectedLanguage, executeMutation]);

  const handleSubmit = useCallback(async () => {
    if (!code.trim()) return;

    try {
      const response = await fetch(`/api/questions/${id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code, 
          language: selectedLanguage,
          violations: violations.length 
        }),
      });
      
      if (response.ok) {
        alert('Code submitted successfully!');
      }
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Failed to submit code. Please try again.');
    }
  }, [code, selectedLanguage, violations, id]);

  const handleViolation = useCallback((violation: string) => {
    setViolations(prev => [...prev, violation]);
  }, []);

  // Format time display
  const formatTime = useMemo(() => {
    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [timeRemaining]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-lg text-gray-600">Loading question...</p>
        </div>
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Question Not Found</h1>
          <p className="text-gray-600">The requested question could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProctoringSecurity onViolation={handleViolation} />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">{question.title}</h1>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                question.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {question.difficulty}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-1" />
                <span className="font-mono">{formatTime}</span>
              </div>
              
              {violations.length > 0 && (
                <div className="flex items-center text-red-600">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  <span className="text-sm">{violations.length} violations</span>
                </div>
              )}
              
              <button
                onClick={handleRunCode}
                disabled={executeMutation.status === 'pending' || !code.trim()}
                className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Play className="h-4 w-4 mr-1" />
                {executeMutation.status === 'pending' ? 'Running...' : 'Run'}
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={!code.trim()}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="h-4 w-4 mr-1" />
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Question Panel */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: question.description }} />
            </div>
            
            <TestCasePanel 
              testCases={question.testCases.filter(tc => !tc.isHidden)}
              results={executeMutation.data?.testResults}
            />
          </div>

          {/* Code Editor Panel */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <select
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {question.languages.map(lang => (
                  <option key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </option>
                ))}
              </select>
              
              {autoSaveMutation.status === 'pending' && (
                <span className="text-sm text-gray-500">Saving...</span>
              )}
            </div>
            
            <div className="h-96">
              <MonacoEditor
                language={selectedLanguage}
                value={code}
                onChange={handleCodeChange}
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  wordWrap: 'on',
                  automaticLayout: true,
                  tabSize: 2,
                }}
              />
            </div>
          </div>
        </div>

        {/* Execution Results */}
        {executeMutation.data && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Execution Results</h3>
            <div className={`p-4 rounded-lg ${
              executeMutation.data.verdict === 'OK' ? 'bg-green-50 border-green-200' :
              'bg-red-50 border-red-200'
            } border`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Verdict: {executeMutation.data.verdict}</span>
                <div className="text-sm text-gray-600">
                  {executeMutation.data.executionTime && (
                    <span className="mr-4">Time: {executeMutation.data.executionTime}ms</span>
                  )}
                  {executeMutation.data.memoryUsed && (
                    <span>Memory: {executeMutation.data.memoryUsed}MB</span>
                  )}
                </div>
              </div>
              
              <div className="grid gap-2">
                {executeMutation.data.testResults.map((result, index) => (
                  <div key={index} className={`p-2 rounded ${
                    result.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    <div className="font-medium">
                      Test Case {index + 1}: {result.passed ? 'PASSED' : 'FAILED'}
                    </div>
                    {!result.passed && (
                      <div className="text-sm mt-1">
                        <div>Expected: {result.expected}</div>
                        <div>Actual: {result.actual}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionPage;