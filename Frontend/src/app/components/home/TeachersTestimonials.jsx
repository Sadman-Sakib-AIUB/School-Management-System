// src/components/TeachersTestimonials.jsx

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import teacherData from '../../data/teachersData.js';
import { testimonials } from '../../data/teachersData';
const TeachersTestimonials = ({ }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  
useEffect(() => {
    if (!testimonials || testimonials.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [testimonials?.length]);

  const nextTestimonial = () => {
    if (testimonials.length > 0)
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const previousTestimonial = () => {
    if (testimonials.length > 0)
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
      );
  };

  const goToTestimonial = (index) => {
    setCurrentIndex(index);
  };

  if (!testimonials || testimonials.length === 0) return null;

  const currentTestimonial = testimonials[currentIndex];

  return (
      // 1. Main Section: Removed 'justify-center'
    <section className="-mt-15 pb-10 w-full bg-slate-50/50"> 
      
      
      <div className="container mx-auto px-4">
        
        
        <div className="relative max-w-full max-w-8xl bg-white rounded-3xl p-6 md:p-40 shadow-xl border border-gray-200 animate-fade-in-up">
          
          {/* Previous Button */}
          <button
            onClick={previousTestimonial}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 w-10 h-10 rounded-full border-2 border-primary-600 bg-white items-center justify-center transition-all hover:bg-primary-600 hover:scale-110 shadow-lg z-10 group"
          >
            <ChevronLeft className="w-5 h-5 stroke-primary-600 group-hover:stroke-white" />
          </button>

          {/* Next Button */}
          <button
            onClick={nextTestimonial}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 w-10 h-10 rounded-full border-2 border-primary-600 bg-white items-center justify-center transition-all hover:bg-primary-600 hover:scale-110 shadow-lg z-10 group"
          >
            <ChevronRight className="w-5 h-5 stroke-primary-600 group-hover:stroke-white" />
          </button>

          {/* Content Grid */}
          <div className="grid md:grid-cols-[200px_1fr] gap-6 items-center">
            
            {/* Teacher Image */}
            <div className="relative mx-auto md:mx-0">
              <div className="w-[200px] h-[240px] md:w-[200px] md:h-[240px] rounded-2xl overflow-hidden border-[4px] border-primary-600 shadow-lg transition-transform hover:rotate-1 mx-auto">
                <img
                  src={currentTestimonial.image}
                  alt={currentTestimonial.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-3 -right-3 md:-right-4 w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-500 rounded-full flex items-center justify-center shadow-md animate-pulse-slow">
                <span className="text-2xl font-bold text-white">"</span>
              </div>
            </div>

            {/* Text Content */}
            <div className="text-left"> 
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {currentTestimonial.name}
              </h3>
              <p className="text-sm font-bold text-primary-600 mb-4">
                {currentTestimonial.designation}
              </p>

              <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-4 rounded-xl mb-4 border-l-[4px] border-primary-600">
                <p className="text-sm md:text-base leading-relaxed text-gray-900 italic line-clamp-3">
                  {currentTestimonial.quote}
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <h4 className="text-sm font-bold text-primary-600 mb-1 flex items-center gap-2">
                  <span className="text-lg">💡</span>
                  শিক্ষার্থীদের জন্য পরামর্শ:
                </h4>
                <p className="text-xs md:text-sm leading-relaxed text-gray-700 line-clamp-2">
                  {currentTestimonial.advice}
                </p>
              </div>
            </div>
          </div>

          {/* Indicators */}
          <div className="flex gap-2 justify-center mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-primary-600'
                    : 'w-2 bg-gray-300 hover:bg-primary-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeachersTestimonials;
