
import React from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import LandingPage from '@/components/LandingPage';
import Dashboard from '@/components/Dashboard';

const MainContent = () => {
  const { user } = useAuth();
  
  return user ? <Dashboard /> : <LandingPage />;
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
