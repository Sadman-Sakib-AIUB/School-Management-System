"use client"
import React from 'react';
import { ExternalLink, GraduationCap } from 'lucide-react';
import { educationBoards } from '../../data/mockData';

const EducationBoardsPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">শিক্ষা বোর্ডসমূহ</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            বাংলাদেশ শিক্ষা মন্ত্রণালয়ের অধীনে পরিচালিত সকল শিক্ষা বোর্ডের অফিসিয়াল ওয়েবসাইট এখান থেকে সরাসরি ভিজিট করতে পারবেন।
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {educationBoards.map((board) => (
            <a 
              key={board.code}
              href={board.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary-500 transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-600 transition-colors">
                <GraduationCap className="text-primary-600 group-hover:text-white transition-colors" size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{board.name}</h3>
              <p className="text-sm text-slate-500 mb-6 font-medium">অফিসিয়াল ওয়েবসাইট</p>
              <div className="flex items-center gap-2 text-primary-600 font-bold text-sm">
                ভিজিট করুন <ExternalLink size={16} />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EducationBoardsPage;