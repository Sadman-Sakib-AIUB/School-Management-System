"use client"
import React from 'react';
import { siteInfo } from '../../data/mockData.js';
import { Bell } from 'lucide-react';

const TopBar = ({isHidden}) => {
  return (
    <div className={`bg-slate-800 text-white overflow-hidden border-white/10
      transition-all duration-300 ease-in-out
      ${isHidden ? '-translate-y-full h-0 opacity-0' : 'translate-y-0 h-auto py-1.5 opacity-100'}`}>
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-xs md:text-sm font-medium">
        <div className="hidden md:flex gap-6">
          <span>EIIN: {siteInfo.eiin}</span>
          <span>School Code: {siteInfo.schoolCode}</span>
          <span>Reg: {siteInfo.regNo}</span>
        </div>
        <div className="flex-1 w-full md:ml-10 overflow-hidden text-center md:text-left">
          <div className="animate-marquee whitespace-nowrap inline-block">
             <span className="mx-4 text-primary-400">সর্বশেষ আপডেট <Bell className="inline-block w-4 h-4 mr-1" /></span>
             ভর্তি চলছে ২০২৬ শিক্ষাবর্ষের জন্য | বার্ষিক ক্রীড়া প্রতিযোগিতার ফলাফল প্রকাশিত হয়েছে | নতুন একাডেমিক ভবন উদ্বোধন কাল
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
