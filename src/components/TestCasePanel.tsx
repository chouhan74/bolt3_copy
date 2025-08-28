import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  weight: number;
}

interface TestResult {
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
  executionTime: number;
}

interface TestCasePanelProps {
  testCases: TestCase[];
  results?: TestResult[];
}

const TestCasePanel: React.FC<TestCasePanelProps> = ({ testCases, results }) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Test Cases</h3>
      <div className="space-y-4">
        {testCases.map((testCase, index) => {
          const result = results?.[index];
          
          return (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Test Case {index + 1}</span>
                {result && (
                  <div className="flex items-center space-x-2">
                    {result.passed ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm ${
                      result.passed ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {result.passed ? 'PASSED' : 'FAILED'}
                    </span>
                    <div className="flex items-center text-gray-500 text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {result.executionTime}ms
                    </div>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Input
                  </label>
                  <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                    {testCase.input}
                  </pre>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Output
                  </label>
                  <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                    {testCase.expectedOutput}
                  </pre>
                </div>
              </div>
              
              {result && !result.passed && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-red-700 mb-1">
                    Your Output
                  </label>
                  <pre className="bg-red-50 border border-red-200 p-2 rounded text-sm overflow-auto">
                    {result.actual}
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TestCasePanel;