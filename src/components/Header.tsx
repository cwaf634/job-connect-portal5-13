
import React from 'react';
import { Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

interface HeaderProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

const Header = ({ onLoginClick, onRegisterClick }: HeaderProps) => {
  const { t } = useLanguage();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{t('jobConnect')}</h1>
              <p className="text-sm text-gray-600">{t('governmentJobPortal')}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <Button variant="outline" onClick={onLoginClick}>
              {t('login')}
            </Button>
            <Button onClick={onRegisterClick} className="bg-blue-600 hover:bg-blue-700">
              {t('register')}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
