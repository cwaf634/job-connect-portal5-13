
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

interface UserPanelProps {
  type: 'student' | 'employer' | 'administrator';
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  buttonColor: string;
  onLoginClick: (userType: 'student' | 'employer' | 'administrator') => void;
  onRegisterClick: (userType: 'student' | 'employer' | 'administrator') => void;
}

const UserPanel = ({ type, title, description, icon: IconComponent, color, buttonColor, onLoginClick, onRegisterClick }: UserPanelProps) => {
  const { t } = useLanguage();

  return (
    <Card className="bg-white shadow-lg border-0 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 group animate-fade-in overflow-hidden relative">
      {/* Animated background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <CardHeader className="text-center pb-6 relative z-10">
        <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg group-hover:shadow-xl`}>
          <IconComponent className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
        </div>
        <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
          {title}
        </CardTitle>
        <CardDescription className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 px-6 pb-6 relative z-10">
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 py-2 transition-all duration-300 hover:scale-105"
            onClick={() => onLoginClick(type)}
          >
            {t('login')}
          </Button>
          <Button 
            className={`flex-1 text-white ${buttonColor} py-2 transition-all duration-300 hover:scale-105 hover:shadow-lg`}
            onClick={() => onRegisterClick(type)}
          >
            {t('register')}
          </Button>
        </div>
      </CardContent>
      
      {/* Hover effect border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 rounded-lg transition-all duration-500"></div>
    </Card>
  );
};

export default UserPanel;
