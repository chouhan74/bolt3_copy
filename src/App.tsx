import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load heavy components to improve initial load time
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const CandidateAssessment = lazy(() => import('./components/CandidateAssessment'));
const QuestionPage = lazy(() => import('./components/QuestionPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ErrorBoundary>
          <div className="min-h-screen bg-gray-50">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/admin/*" element={<AdminDashboard />} />
                <Route path="/assessment/:token" element={<CandidateAssessment />} />
                <Route path="/question/:id" element={<QuestionPage />} />
                <Route path="/" element={<LandingPage />} />
              </Routes>
            </Suspense>
          </div>
        </ErrorBoundary>
      </Router>
    </QueryClientProvider>
  );
}

const LandingPage = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Mercer HR Coding Assessment Platform
      </h1>
      <p className="text-lg text-gray-600">
        Professional coding assessment platform for technical interviews
      </p>
    </div>
  </div>
);

export default App;