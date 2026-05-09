"use client"
import React, { useState } from 'react';
import { 
  Download, 
  LayoutGrid, 
  GraduationCap, 
  X, 
  FileCheck, 
  Sparkles,
  ArrowDownToLine,
  BookOpenCheck
} from 'lucide-react';

const SyllabusPage = () => {
  const [selectedClass, setSelectedClass] = useState(null);

   
  const classes = [
    { id: '1', name: 'প্রথম শ্রেণি', subjects: '৩টি বিষয়', category: 'Primary', fullSyllabusLink: '/syllabus/class1.pdf' },
    { id: '2', name: 'দ্বিতীয় শ্রেণি', subjects: '৩টি বিষয়', category: 'Primary', fullSyllabusLink: '#' },
    { id: '3', name: 'তৃতীয় শ্রেণি', subjects: '৬টি বিষয়', category: 'Primary', fullSyllabusLink: '#' },
    { id: '4', name: 'চতুর্থ শ্রেণি', subjects: '৬টি বিষয়', category: 'Primary', fullSyllabusLink: '#' },
    { id: '5', name: 'পঞ্চম শ্রেণি', subjects: '৬টি বিষয়', category: 'Primary', fullSyllabusLink: '#' },
    { id: '6', name: 'ষষ্ঠ শ্রেণি', subjects: '১০টি বিষয়', category: 'Secondary', fullSyllabusLink: '#' },
    { id: '7', name: 'সপ্তম শ্রেণি', subjects: '১০টি বিষয়', category: 'Secondary', fullSyllabusLink: '#' },
    { id: '8', name: 'অষ্টম শ্রেণি', subjects: '১০টি বিষয়', category: 'Secondary', fullSyllabusLink: '#' },
    { id: '9', name: 'নবম শ্রেণি', subjects: '১০টি বিষয়', category: 'Secondary', fullSyllabusLink: '#' },
    { id: '10', name: 'দশম শ্রেণি', subjects: '১০টি বিষয়', category: 'Secondary', fullSyllabusLink: '#' },
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfd] pt-36 pb-20 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary-100/30 rounded-full blur-3xl opacity-50"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        
        {/* Unique Minimal Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          {/* <div className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-1.5 rounded-full shadow-sm mb-6 animate-bounce">
            <Sparkles size={16} className="text-amber-500" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">Academic Hub</span>
          </div> */}
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
            অ্যাকাডেমিক <span className="text-primary-600 underline decoration-primary-200 decoration-8 underline-offset-8">সিলেবাস</span>
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed">
            এক ক্লিকেই ডাউনলোড করুন আপনার পূর্ণাঙ্গ বার্ষিক পাঠ্যক্রম ও সিলেবাস।
          </p>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {classes.map((cls) => (
            <div 
              key={cls.id} 
              className="group relative bg-white rounded-[2rem] p-1 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(59,130,246,0.12)] transition-all duration-500 hover:-translate-y-1"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-primary-50 group-hover:rotate-6 transition-all duration-500">
                    <BookOpenCheck size={32} className="text-slate-400 group-hover:text-primary-600" />
                  </div>
                  <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    {cls.category}
                  </span>
                </div>
                
                <h3 className="text-2xl font-black text-slate-800 mb-2">{cls.name}</h3>
                <div className="flex items-center gap-2 text-slate-400 text-sm font-medium mb-8">
                  <GraduationCap size={16} />
                  <span>{cls.subjects} অন্তর্ভুক্ত</span>
                </div>

                <button 
                  onClick={() => setSelectedClass(cls)}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 group-hover:bg-primary-600 transition-all active:scale-95"
                >
                  সিলেবাস দেখুন <ArrowDownToLine size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Simple One-Action Modal --- */}
      {selectedClass && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setSelectedClass(null)}></div>
          
          <div className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden p-10 animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedClass(null)}
              className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="text-center">
              <div className="w-20 h-20 bg-primary-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary-600">
                <FileCheck size={40} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-2">{selectedClass.name}</h3>
              <p className="text-slate-500 mb-8 font-medium">পূর্ণাঙ্গ বার্ষিক সিলেবাসটি ডাউনলোড করুন</p>
              
              <div className="space-y-4">
                <a 
                  href={selectedClass.fullSyllabusLink}
                  download
                  className="flex items-center justify-center gap-3 w-full py-5 bg-primary-600 text-white rounded-3xl font-black shadow-xl shadow-primary-200 hover:bg-primary-700 hover:shadow-none transition-all"
                >
                  <Download size={22} /> ডাউনলোড করুন (PDF)
                </a>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  File Size: ~2.4 MB • Updated: 2026
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SyllabusPage;