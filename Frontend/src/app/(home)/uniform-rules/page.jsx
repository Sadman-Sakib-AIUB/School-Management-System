"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shirt, ShieldCheck, Clock, AlertCircle, 
  CheckCircle2, Download, Sun, Snowflake, 
  UserCheck, Smartphone, Info
} from 'lucide-react';

const UniformRules = () => {
  const [activeGender, setActiveGender] = useState('boys');
  const [isWinter, setIsWinter] = useState(false);

  const uniformData = {
    boys: {
      title: "ছাত্রদের পোশাক গাইড",
      summerImage: "/boy-summer.png", 
      winterImage: "/boy-winter.png", 
      summer: ["হাফ হাতা সাদা শার্ট (স্কুল মনোগ্রামসহ)", "নেভি ব্লু প্যান্ট", "কালো বেল্ট", "সাদা মোজা ও কালো জুতো"],
      winter: ["ফুল হাতা সাদা শার্ট", "নেভি ব্লু ভি-নেক সোয়েটার", "নেভি ব্লু প্যান্ট ও টাই", "কালো জুতো"]
    },
    girls: {
      title: "ছাত্রীদের পোশাক গাইড",
      summerImage: "/girl-summer.png", 
      winterImage: "/girl-winter.png", 
      summer: ["সাদা কামিজ (স্কুল মনোগ্রামসহ)", "নেভি ব্লু সালোয়ার ও ওড়না", "সাদা বেল্ট", "সাদা মোজা ও কেডস"],
      winter: ["নেভি ব্লু কার্ডিগান বা সোয়েটার", "সাদা স্কার্ফ ও কামিজ", "নেভি ব্লু সালোয়ার", "সাদা কেডস"]
    }
  };

  const currentImage = isWinter 
    ? uniformData[activeGender].winterImage 
    : uniformData[activeGender].summerImage;

  const rules = [
    {
      title: "সময় ও শৃঙ্খলা",
      icon: <Clock className="text-blue-600" />,
      items: ["সকাল ৮:৩০ এর মধ্যে স্কুলে উপস্থিতি বাধ্যতামূলক", "অ্যাসেম্বলিতে অংশগ্রহণ অপরিহার্য", "স্কুল ত্যাগের পূর্বে অনুমতি প্রয়োজন"]
    },
    {
      title: "ব্যক্তিগত পরিচ্ছন্নতা",
      icon: <UserCheck className="text-emerald-600" />,
      items: ["পরিষ্কার-পরিচ্ছন্ন ইউনিফর্ম পরিধান করা", "নখ ছোট রাখা ও চুল সুশৃঙ্খল রাখা", "জুতো পালিশ করা থাকতে হবে"]
    },
    {
      title: "নিষিদ্ধ বিষয়াবলী",
      icon: <Smartphone className="text-red-600" />,
      items: ["মোবাইল ফোন বা ইলেকট্রনিক ডিভাইস আনা নিষেধ", "দামি গয়না বা প্রসাধনী ব্যবহার করা যাবে না", "অশালীন আচরণ কঠোরভাবে দমনীয়"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-20 px-4 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* --- HERO SECTION --- */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-6 py-2 rounded-full font-bold text-sm mb-6 border border-blue-100"
          >
            <ShieldCheck size={18} /> শৃঙ্খলাই প্রগতি
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
            পোশাক ও <span className="text-blue-600">আচরণবিধি</span>
          </h1>
        </div>

        {/* --- MAIN INTERACTIVE SECTION --- */}
        <section className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl p-6 md:p-12 mb-16 overflow-hidden">
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
            {/* Gender Toggle */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto">
              <button 
                onClick={() => setActiveGender('boys')}
                className={`flex-1 md:px-10 py-3.5 rounded-xl font-black text-xs transition-all duration-300 ${activeGender === 'boys' ? 'bg-white shadow-xl text-blue-600' : 'text-slate-500'}`}
              >
                ছাত্রদের পোশাক
              </button>
              <button 
                onClick={() => setActiveGender('girls')}
                className={`flex-1 md:px-10 py-3.5 rounded-xl font-black text-xs transition-all duration-300 ${activeGender === 'girls' ? 'bg-white shadow-xl text-blue-600' : 'text-slate-500'}`}
              >
                ছাত্রীদের পোশাক
              </button>
            </div>

            {/* Season Switch */}
            <div className="flex items-center gap-5 bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm">
              <Sun size={20} className={!isWinter ? "text-orange-500" : "text-slate-300"} />
              <button 
                onClick={() => setIsWinter(!isWinter)}
                className={`w-14 h-7 rounded-full relative transition-all duration-500 ${isWinter ? 'bg-blue-600' : 'bg-orange-400'}`}
              >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-500 shadow-md ${isWinter ? 'left-8' : 'left-1'}`}></div>
              </button>
              <Snowflake size={20} className={isWinter ? "text-blue-600" : "text-slate-300"} />
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">সেশন পরিবর্তন</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Image Preview */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeGender + isWinter}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="relative rounded-[2.5rem] overflow-hidden shadow-2xl h-[550px] border-4 border-slate-50 group"
              >
                <img 
                  src={currentImage} 
                  alt="School Uniform" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8 text-white">
                  <p className="text-xs font-black uppercase tracking-widest text-blue-400 mb-2">ইউনিফর্ম প্রিভিউ</p>
                  <h3 className="text-2xl font-bold">{isWinter ? 'শীতকালীন ইউনিফর্ম' : 'গ্রীষ্মকালীন ইউনিফর্ম'}</h3>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Content */}
            <div className="space-y-6">
              <h4 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-3">
                <Info className="text-blue-600" size={24} /> নির্ধারিত তালিকা:
              </h4>
              <div className="grid gap-4">
                {(isWinter ? uniformData[activeGender].winter : uniformData[activeGender].summer).map((item, index) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={index} 
                    className="flex items-center gap-5 p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 hover:bg-white hover:border-blue-200 transition-all shadow-sm group"
                  >
                    <div className="bg-white p-2 rounded-lg text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <CheckCircle2 size={18} />
                    </div>
                    <p className="text-slate-700 font-bold">{item}</p>
                  </motion.div>
                ))}
              </div>

              <button className="mt-8 w-full flex items-center justify-center gap-3 bg-blue-600 text-white py-5 rounded-[1.5rem] font-bold hover:bg-slate-900 transition-all duration-300 shadow-xl shadow-blue-200 hover:shadow-slate-200 hover:-translate-y-1">
                 <Download size={20} /> পূর্ণাঙ্গ নির্দেশিকা ডাউনলোড (PDF)
              </button>
            </div>
          </div>
        </section>

        {/* --- RULES GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {rules.map((rule, idx) => (
            <div key={idx} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
                {rule.icon}
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-6">{rule.title}</h3>
              <ul className="space-y-4">
                {rule.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-500 font-semibold leading-relaxed">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default UniformRules;