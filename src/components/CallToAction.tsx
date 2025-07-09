
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface CallToActionProps {
  onGetStartedClick: () => void;
}

const CallToAction = ({ onGetStartedClick }: CallToActionProps) => {
  const { t } = useLanguage();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="animate-fade-in">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Ready to Get Started?
          </h2>
          <p className="text-xl md:text-2xl mb-10 opacity-90 leading-relaxed">
            Join thousands of students and employers already using our platform
          </p>
          <Button
            onClick={onGetStartedClick}
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 hover:text-blue-700 px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
          >
            Get Started Today
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
      </div>
      
      {/* Animated background elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
    </section>
  );
};

export default CallToAction;
