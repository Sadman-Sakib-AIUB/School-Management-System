"use client"
import React from 'react';
import { ExternalLink, Award, BookOpen, GraduationCap, CheckCircle } from 'lucide-react';

const ResultsLandingPage = () => {
  
  const redirectLinks = [
    {
      id: 1,
      title: "SSC পরীক্ষার ফলাফল",
      description: "সেকেন্ডারি স্কুল সার্টিফিকেট (SSC) ও সমমান পরীক্ষার ফলাফল দেখুন সরাসরি অফিসিয়াল বোর্ড ওয়েবসাইট থেকে।",
      year: "২০২৪ - ২০২৫",
      url: "http://www.educationboardresults.gov.bd/", 
      icon: <BookOpen size={40} />,
      color: "blue"
    },
    {
      id: 2,
      title: "HSC পরীক্ষার ফলাফল",
      description: "হায়ার সেকেন্ডারি সার্টিফিকেট (HSC) ও সমমান পরীক্ষার ফলাফল এবং মার্কশিট ডাউনলোড করুন।",
      year: "২০২৪ - ২০২৫",
      url: "https://eboardresults.com/v2/home", 
      icon: <GraduationCap size={40} />,
      color: "blue"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
            বোর্ড পরীক্ষার <span className="text-blue-600">ফলাফল চেক</span>
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            আপনার কাঙ্ক্ষিত পরীক্ষার ফলাফল দেখতে নিচের সংশ্লিষ্ট কার্ডটি নির্বাচন করুন। এটি আপনাকে সরাসরি শিক্ষা বোর্ডের অফিসিয়াল রেজাল্ট পোর্টালে নিয়ে যাবে।
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {redirectLinks.map((item) => (
            <a 
              key={item.id}
              href={item.url}
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden"
            >
              {/* Decorative Background */}
              <div className={`absolute -right-10 -top-10 w-40 h-40 bg-${item.color}-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700`}></div>

              <div className="relative z-10">
                <div className={`w-20 h-20 bg-${item.color}-50 text-${item.color}-600 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                  {item.icon}
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-4 py-1.5 bg-${item.color}-100 text-${item.color}-700 rounded-xl text-xs font-black uppercase tracking-wider`}>
                    বোর্ড রেজাল্ট
                  </span>
                  <div className="flex items-center gap-1 text-green-500 text-xs font-bold">
                    <CheckCircle size={14} /> ভেরিফাইড লিংক
                  </div>
                </div>

                <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight">
                  {item.title}
                </h3>
                
                <p className="text-slate-500 mb-8 font-medium leading-relaxed">
                  {item.description}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <span className="text-slate-400 font-bold text-sm">সেশন: {item.year}</span>
                  <div className={`flex items-center gap-2 font-black text-${item.color}-600 group-hover:gap-4 transition-all`}>
                    চেক করুন <ExternalLink size={18} />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Notice Section */}
        <div className="mt-16 bg-blue-50/50 p-8 rounded-[2rem] border border-blue-100 text-center">
          <div className="flex justify-center mb-4 text-blue-600">
            <Award size={32} />
          </div>
          <p className="text-blue-800 font-bold mb-2 text-lg italic">
            "সাফল্য কোনো শেষ নয়, ব্যর্থতা কোনো মৃত্যু নয়; বরং এগিয়ে যাওয়ার সাহসই হলো আসল।"
          </p>
          <p className="text-blue-600/70 text-sm">
            সকল পরীক্ষার্থীদের জন্য আমাদের প্রতিষ্ঠানের পক্ষ থেকে রইল শুভকামনা।
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultsLandingPage;