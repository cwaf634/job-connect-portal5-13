
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full flex items-center space-x-2 shadow-sm">
            <span className="text-pink-500">🚀</span>
            <span className="text-sm text-gray-700">{t('revolutionizing')}</span>
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          {t('gatewayTo')} <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{t('verifiedSuccess')}</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed px-4">
          {t('heroDescription')}
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
