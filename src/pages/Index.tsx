
import React from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import LandingPage from '@/components/LandingPage';
import Dashboard from '@/components/Dashboard';
import ProtectedRoute from '@/components/ProtectedRoute';

const MainContent = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading JobConnect...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <LandingPage />;
  }

  return (
    <ProtectedRoute allowedUserTypes={['student', 'employer', 'administrator']}>
      <Dashboard />
    </ProtectedRoute>
  );
};

const Index = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <NotificationProvider>
          <MainContent />
        </NotificationProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default Index;
