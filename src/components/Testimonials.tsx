
import React from 'react';
import { Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Testimonials = () => {
  const { t } = useLanguage();

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Student',
      rating: 5,
      text: 'This platform helped me get my certificates verified quickly and find job opportunities.'
    },
    {
      name: 'Rajesh Kumar',
      role: 'Shop Owner',
      rating: 5,
      text: 'Easy to manage job postings and find qualified candidates.'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Success stories from our community
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 text-lg mb-6 leading-relaxed group-hover:text-gray-900 transition-colors duration-300">
                "{testimonial.text}"
              </p>
              <div>
                <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                <p className="text-gray-600 text-sm">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
