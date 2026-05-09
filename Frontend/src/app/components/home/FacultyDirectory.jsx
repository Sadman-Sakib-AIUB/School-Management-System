// src/components/FacultyDirectory.jsx
import React from 'react';
import FacultyCard from './FacultyCard';

import {faculty} from '../../data/teachersData';
const FacultyDirectory = ({ 
  
  onContactClick, 
  onDetailsClick, 
  onViewAllClick 
}) => {

  return (
    <div className="faculty-directory">
      {/* Faculty Grid */}
      <div className=" container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mb-12">
        {faculty.map((teacher, index) => (
          <FacultyCard
            key={teacher.id}
            teacher={teacher}
            index={index}
            onContactClick={onContactClick}
            onDetailsClick={onDetailsClick}
          />
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center">
        <button
          onClick={onViewAllClick}
          className="px-12 md:px-16 py-4 md:py-5 bg-white text-primary-600 border-3 border-primary-600 rounded-2xl text-lg md:text-xl font-extrabold transition-all duration-300 hover:bg-primary-600 hover:text-white hover:scale-105 hover:shadow-xl inline-flex items-center gap-3"
        >
          সকল শিক্ষক দেখুন
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FacultyDirectory;
