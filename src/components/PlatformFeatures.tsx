
import React from 'react';
import { Award, Users, Shield, Target } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const PlatformFeatures = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Award,
      title: 'Certificate Verification',
      description: 'Secure and transparent certificate verification system',
      color: 'bg-blue-500'
    },
    {
      icon: Users,
      title: 'Multi-Role Platform',
      description: 'Students, shopkeepers, and administrators in one platform',
      color: 'bg-blue-500'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Advanced security measures to protect your data',
      color: 'bg-blue-500'
    },
    {
      icon: Target,
      title: 'Job Matching',
      description: 'Connect students with relevant job opportunities',
      color: 'bg-blue-500'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Platform Features
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need for successful career development
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformFeatures;
