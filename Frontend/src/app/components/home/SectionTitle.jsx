// src/components/SectionTitle.jsx
import React from 'react';

const SectionTitle = ({ title }) => {
  return (
    <div className="flex items-center gap-3 mb-10 animate-slide-in-left">
      <div className="w-1.5 h-12 md:h-14 bg-gradient-to-b from-primary-600 to-primary-500 rounded-full shadow-md shadow-primary-600/30"></div>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900">
        {title}
      </h2>
    </div>
  );
};

export default SectionTitle;
