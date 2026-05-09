"use client"
import React from 'react';
import { Phone, Mail, Facebook, Linkedin } from 'lucide-react';
import Link from 'next/link';
import teacherData from '../../data/teachersData.js';
const FacultyCard = ({ teacher, index, onContactClick, onDetailsClick }) => {
  const delay = index * 100;

  const handleContactClick = (type, value) => {
    if (onContactClick) {
      onContactClick(type, value);
    }
  };

  const handleDetailsClick = () => {
    if (onDetailsClick) {
      onDetailsClick(teacher.name);
    }
  };

  return (
    <div
    
      className="faculty-card w-full min-h-[400px] bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-200 transition-all duration-300 hover:-translate-y-3 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary-600/20 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Image */}
      <div className="relative w-full h-72 overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100 group">
        <img
          src={teacher.image}
          alt={teacher.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Info */}
      <div className="p-6 md:p-7">
        <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-2">
          {teacher.name}
        </h3>
        <p className="text-sm md:text-base text-primary-600 font-bold mb-5">
          {teacher.designation}
        </p>

        {/* Contact Icons */}
        <div className="flex gap-3 mb-4">
          {/* Phone */}
          <button
            onClick={() => handleContactClick('phone', teacher.phone)}
            className="w-11 h-11 rounded-xl bg-primary-600/10 flex items-center justify-center transition-all duration-300 hover:bg-blue-600 hover:-translate-y-1 hover:scale-110 group"
            title="Phone"
          >
            <Phone className="w-5 h-5 stroke-primary-600 group-hover:stroke-white transition-colors" />
          </button>

          {/* Email */}
          <button
            onClick={() => handleContactClick('email', teacher.email)}
            className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center transition-all duration-300 hover:bg-blue-500 hover:-translate-y-1 hover:scale-110 group"
            title="Email"
          >
            <Mail className="w-5 h-5 stroke-blue-500 group-hover:stroke-white transition-colors" />
          </button>

          {/* Facebook */}
          <button
            onClick={() => handleContactClick('facebook')}
            className="w-11 h-11 rounded-xl bg-blue-600/10 flex items-center justify-center transition-all duration-300 hover:bg-blue-600 hover:-translate-y-1 hover:scale-110 group"
            title="Facebook"
          >
            <Facebook className="w-5 h-5 fill-blue-600 group-hover:fill-white transition-colors" />
          </button>

          {/* LinkedIn */}
          <button
            onClick={() => handleContactClick('linkedin')}
            className="w-11 h-11 rounded-xl bg-blue-700/10 flex items-center justify-center transition-all duration-300 hover:bg-blue-700 hover:-translate-y-1 hover:scale-110 group"
            title="LinkedIn"
          >
            <Linkedin className="w-5 h-5 fill-blue-700 group-hover:fill-white transition-colors" />
          </button>
        </div>

        {/* Details Button */}
        <Link href={`/teachers/${teacher.id}`}> 
          <button
            className="w-full py-3 md:py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-black rounded-xl md:rounded-2xl text-base md:text-lg font-bold transition-all duration-300 hover:scale-[1.03] flex items-center justify-center gap-2"
          >
            বিস্তারিত দেখুন
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default FacultyCard;
