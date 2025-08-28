import React from 'react';
import { useParams } from 'react-router-dom';
import { Clock, User, BookOpen } from 'lucide-react';

const CandidateAssessment: React.FC = () => {
  const { token } = useParams<{ token: string }>();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Your Assessment
            </h1>
            <p className="text-lg text-gray-600">
              Please read the instructions carefully before starting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <Clock className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-blue-900 mb-2">Time Limit</h3>
              <p className="text-blue-700">90 minutes</p>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-green-900 mb-2">Questions</h3>
              <p className="text-green-700">3 coding problems</p>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <User className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-purple-900 mb-2">Languages</h3>
              <p className="text-purple-700">Python, Java, C++</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Instructions:</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>You have 90 minutes to complete all questions</li>
              <li>Your code will be auto-saved every 30 seconds</li>
              <li>You can test your code before submitting</li>
              <li>Switching tabs or leaving the window will be recorded</li>
              <li>Developer tools are disabled for security</li>
              <li>Make sure to submit your final answers before time expires</li>
            </ul>
          </div>

          <div className="text-center">
            <button className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors">
              Start Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateAssessment;