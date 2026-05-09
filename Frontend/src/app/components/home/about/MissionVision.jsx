import { Eye, Target, ArrowRight } from 'lucide-react';
import React from 'react';

const MissionVision = () => {
  return (
    <section className="py-24 bg-[#f8fafc]">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">আমাদের লক্ষ্য ও উদ্দেশ্য</h2>
          <div className="w-20 h-1.5 bg-primary-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Mission Card */}
          <div className="group bg-white p-10 rounded-3xl border border-slate-200 hover:border-primary-200 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-100/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Target size={120} />
            </div>
            
            <div className="bg-primary-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
              <Target className="text-primary-600" size={32} />
            </div>
            
            <h3 className="text-2xl font-bold text-slate-800 mb-4">আমাদের মিশন</h3>
            <p className="text-slate-600 leading-loose text-lg">
              শিক্ষার্থীদের নৈতিক, মানসিক ও বুদ্ধিবৃত্তিক বিকাশ ঘটিয়ে দেশ ও জাতির জন্য যোগ্য নাগরিক তৈরি করা।
              শিক্ষার্থীদের নৈতিক, মানসিক ও বুদ্ধিবৃত্তিক বিকাশ ঘটিয়ে দেশ ও জাতির জন্য যোগ্য নাগরিক তৈরি করা।
              শিক্ষার্থীদের নৈতিক, মানসিক ও বুদ্ধিবৃত্তিক বিকাশ ঘটিয়ে দেশ ও জাতির জন্য যোগ্য নাগরিক তৈরি করা।
              শিক্ষার্থীদের নৈতিক, মানসিক ও বুদ্ধিবৃত্তিক বিকাশ ঘটিয়ে দেশ ও জাতির জন্য যোগ্য নাগরিক তৈরি করা।
            </p>
          </div>

          {/* Vision Card */}
          <div className="group bg-white p-10 rounded-3xl border border-slate-200 hover:border-blue-200 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-100/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Eye size={120} />
            </div>

            <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
              <Eye className="text-blue-600" size={32} />
            </div>
            
            <h3 className="text-2xl font-bold text-slate-800 mb-4">আমাদের ভিশন</h3>
            <p className="text-slate-600 leading-loose text-lg">
              আধুনিক ও প্রযুক্তিনির্ভর শিক্ষা ব্যবস্থার মাধ্যমে আন্তর্জাতিক মানের শিক্ষা নিশ্চিত করা।
              আধুনিক ও প্রযুক্তিনির্ভর শিক্ষা ব্যবস্থার মাধ্যমে আন্তর্জাতিক মানের শিক্ষা নিশ্চিত করা।
              আধুনিক ও প্রযুক্তিনির্ভর শিক্ষা ব্যবস্থার মাধ্যমে আন্তর্জাতিক মানের শিক্ষা নিশ্চিত করা।
              আধুনিক ও প্রযুক্তিনির্ভর শিক্ষা ব্যবস্থার মাধ্যমে আন্তর্জাতিক মানের শিক্ষা নিশ্চিত করা।
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;


