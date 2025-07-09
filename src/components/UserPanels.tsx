
import React from 'react';
import { Building2, Users, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import UserPanel from './UserPanel';

interface UserPanelsProps {
  onLoginClick: (userType: 'student' | 'employer' | 'administrator') => void;
  onRegisterClick: (userType: 'student' | 'employer' | 'administrator') => void;
  activePanel?: 'student' | 'employer' | 'administrator' | null;
}

const UserPanels = ({ onLoginClick, onRegisterClick, activePanel }: UserPanelsProps) => {
  const { t } = useLanguage();

  const userPanels = [
    {
      type: 'student' as const,
      title: t('students'),
      description: t('studentsDesc'),
      icon: Users,
      color: 'bg-blue-500',
      buttonColor: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      type: 'employer' as const,
      title: t('employers'),
      description: t('employersDesc'),
      icon: Building2,
      color: 'bg-green-500',
      buttonColor: 'bg-green-500 hover:bg-green-600'
    },
    {
      type: 'administrator' as const,
      title: t('administrators'),
      description: t('administratorsDesc'),
      icon: Shield,
      color: 'bg-purple-500',
      buttonColor: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  // Filter panels based on activePanel
  const displayPanels = activePanel 
    ? userPanels.filter(panel => panel.type === activePanel)
    : userPanels;

  return (
    <div className={`grid gap-8 max-w-6xl mx-auto px-4 ${activePanel ? 'md:grid-cols-1 justify-center' : 'md:grid-cols-3'}`}>
      {displayPanels.map((panel) => (
        <UserPanel
          key={panel.type}
          type={panel.type}
          title={panel.title}
          description={panel.description}
          icon={panel.icon}
          color={panel.color}
          buttonColor={panel.buttonColor}
          onLoginClick={onLoginClick}
          onRegisterClick={onRegisterClick}
        />
      ))}
    </div>
  );
};

export default UserPanels;
