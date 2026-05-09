"use client"
import React from 'react';
import { 
  Info, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Download,
  HelpCircle
} from 'lucide-react';

const UpobrittiPage = () => {
  const requirements = [
    "শিক্ষার্থীর জন্ম নিবন্ধনের সত্যায়িত ফটোকপি।",
    "পিতা ও মাতার জাতীয় পরিচয়পত্রের (NID) ফটোকপি।",
    "শিক্ষার্থীর বিগত বছরের পরীক্ষার ফলাফলের কপি।",
    "অভিভাবকের সচল মোবাইল নম্বর (নগদ/বিকাশ একাউন্টসহ)।",
    "বর্তমান শিক্ষা প্রতিষ্ঠান থেকে প্রত্যয়নপত্র।"
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          {/* <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-bold mb-4">
            <Info size={16} /> সরকারি উপবৃত্তি সংক্রান্ত তথ্য
          </div> */}
          <h1 className="text-4xl md:text-5xl py-4 font-black mb-6 leading-tight">
           <span className="text-primary-600">উপবৃত্তি</span>{' '}
           <span className="text-slate-900">তথ্য কেন্দ্র</span>
          </h1>
          <p className="text-slate-600 text-lg max-w-3xl mx-auto leading-relaxed">
            মাধ্যমিক ও উচ্চ মাধ্যমিক স্তরের শিক্ষার্থীদের উপবৃত্তি সংক্রান্ত সকল আপডেট, আবেদনের নিয়মাবলী এবং প্রয়োজনীয় তথ্যাদি এখানে পাওয়া যাবে।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Information - Left Side */}
          <div className="md:col-span-2 space-y-8">
            
            {/* Eligibility Section */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <CheckCircle2 className="text-green-500" /> উপবৃত্তির যোগ্যতা
              </h3>
              <div className="space-y-4 text-slate-600">
                <p className="flex gap-3 items-start">
                  <span className="w-2 h-2 rounded-full bg-primary-500 mt-2 shrink-0"></span>
                  নিয়মিত শিক্ষার্থী হতে হবে এবং ক্লাসে কমপক্ষে ৭৫% উপস্থিত থাকতে হবে।
                </p>
                <p className="flex gap-3 items-start">
                  <span className="w-2 h-2 rounded-full bg-primary-500 mt-2 shrink-0"></span>
                  বিগত সমাপনী পরীক্ষায় ন্যূনতম জিপিএ (GPA) প্রাপ্ত হতে হবে।
                </p>
                <p className="flex gap-3 items-start">
                  <span className="w-2 h-2 rounded-full bg-primary-500 mt-2 shrink-0"></span>
                  সরকারি অন্য কোনো উৎস থেকে উপবৃত্তি গ্রহণ করা যাবে না।
                </p>
              </div>
            </div>

            {/* Documents Section */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <FileText className="text-blue-500" /> প্রয়োজনীয় কাগজপত্র
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {requirements.map((item, index) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700 text-sm font-medium">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Application Process */}
            <div className="bg-primary-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-primary-200">
              <h3 className="text-2xl font-bold mb-6">আবেদন করার প্রক্রিয়া</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold shrink-0">১</div>
                  <p>আপনার শিক্ষা প্রতিষ্ঠান থেকে নির্ধারিত উপবৃত্তি ফরম সংগ্রহ করুন।</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold shrink-0">২</div>
                  <p>ফরমটি সঠিকভাবে পূরণ করে প্রয়োজনীয় কাগজপত্র সংযুক্ত করুন।</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold shrink-0">৩</div>
                  <p>শিক্ষা প্রতিষ্ঠানের অফিস কক্ষে বা দায়িত্বপ্রাপ্ত শিক্ষকের নিকট জমা দিন।</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100">
              <h4 className="font-bold text-amber-800 mb-4 flex items-center gap-2">
                <AlertCircle size={18} /> গুরুত্বপূর্ণ সতর্কতা
              </h4>
              <p className="text-sm text-amber-700 leading-relaxed">
                উপবৃত্তির টাকা লেনদেনের জন্য কোনো পিন (PIN) বা ওটিপি (OTP) কাউকে দেবেন না। শিক্ষা অফিস বা কোনো শিক্ষক কখনোই আপনার পাসওয়ার্ড চাইবেন না।
              </p>
            </div>

            <div className="p-6 bg-white rounded-[2rem] border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <HelpCircle size={18} /> সাহায্য প্রয়োজন?
              </h4>
              <p className="text-sm text-slate-500 mb-4">যেকোনো জিজ্ঞাসা বা সমস্যার জন্য যোগাযোগ করুন:</p>
              <div className="space-y-2">
                <div className="p-3 bg-slate-50 rounded-xl text-xs font-bold text-slate-700">হেল্পলাইন: ১৬১৩১ (শিক্ষা মন্ত্রণালয়)</div>
                <div className="p-3 bg-slate-50 rounded-xl text-xs font-bold text-slate-700">অফিস সময়: সকাল ১০টা - বিকেল ৪টা</div>
              </div>
            </div>

            <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
              <Download size={18} /> আবেদন ফরম ডাউনলোড
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpobrittiPage;