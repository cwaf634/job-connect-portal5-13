
import React, { useState } from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import UserPanels from './UserPanels';
import PlatformFeatures from './PlatformFeatures';
import Testimonials from './Testimonials';
import CallToAction from './CallToAction';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

const LandingPage = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState<'student' | 'employer' | 'admin' | null>(null);
  const [activePanel, setActivePanel] = useState<'student' | 'employer' | 'admin' | null>(null);

  const handleLoginClick = (userType?: 'student' | 'employer' | 'admin') => {
    if (userType) {
      setSelectedUserType(userType);
      setActivePanel(userType);
    }
    setShowLoginModal(true);
  };

  const handleRegisterClick = (userType?: 'student' | 'employer' | 'admin') => {
    if (userType) {
      setSelectedUserType(userType);
      setActivePanel(userType);
    }
    setShowRegisterModal(true);
  };

  const handleGetStartedClick = () => {
    setShowRegisterModal(true);
  };

  const handleModalClose = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
    setActivePanel(null);
    setSelectedUserType(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header 
        onLoginClick={() => handleLoginClick()}
        onRegisterClick={() => handleRegisterClick()}
      />
      
      <HeroSection />
      
      <div className="px-4 sm:px-6 lg:px-8 pb-20">
        <UserPanels 
          onLoginClick={handleLoginClick}
          onRegisterClick={handleRegisterClick}
          activePanel={activePanel}
        />
      </div>

      <PlatformFeatures />
      
      <Testimonials />
      
      <CallToAction onGetStartedClick={handleGetStartedClick} />

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={handleModalClose}
        defaultUserType={selectedUserType}
      />
      <RegisterModal 
        isOpen={showRegisterModal} 
        onClose={handleModalClose}
        defaultUserType={selectedUserType}
      />
    </div>
  );
};

export default LandingPage;
