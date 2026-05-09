"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Star, Award, GraduationCap, 
  MapPin, Calendar, BookOpen, Quote, X, CheckCircle2 
} from 'lucide-react';

const StudentPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  
  const spotlightStudent = {
    name: "তানজিম আহমেদ",
    class: "১০ম শ্রেণি",
    section: "বিজ্ঞান (ক-শাখা)",
    id: "২০২৪১০৫",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
    achievement: "একাডেমিক শ্রেষ্ঠত্ব ও আন্তঃস্কুল গণিত অলিম্পিয়াড বিজয়ী",
    bio: "তানজিম এ বছর গণিত অলিম্পিয়াডে জাতীয় পর্যায়ে মেধার স্বাক্ষর রেখেছে। সে কেবল পড়াশোনায় নয়, বরং স্কুলের বিভিন্ন স্বেচ্ছাসেবী কার্যক্রমেও সক্রিয়। তার স্বপ্ন ভবিষ্যতে একজন মহাকাশ বিজ্ঞানী হওয়া।",
    hobbies: ["গণিত সমাধান", "ফুটবল", "বই পড়া"],
    attendance: "৯৮%"
  };

  
  const categories = [
    {
      id: 'academic',
      title: 'মেধাবী কৃতি শিক্ষার্থী',
      desc: 'বিগত পাবলিক পরীক্ষায় জিপিএ-৫ প্রাপ্ত সেরা মেধাবীরা।',
      icon: <GraduationCap className="text-blue-600" size={32} />,
      bgColor: 'bg-blue-50',
      students: [
        { name: "সাদিয়া ইসলাম", class: "SSC 2024", detail: "গোল্ডেন জিপিএ-৫.০০ (বিজ্ঞান শাখা)", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop" },
        { name: "মাহিন রহমান", class: "HSC 2023", detail: "জিপিএ-৫.০০ এবং বর্তমানে বুয়েটে অধ্যয়নরত।", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400" }
      ]
    },
    {
      id: 'co-curricular',
      title: 'সহ-শিক্ষা কার্যক্রমের নক্ষত্র',
      desc: 'খেলাধুলা, বিতর্ক ও সাংস্কৃতিক অঙ্গনের গৌরব।',
      icon: <Trophy className="text-amber-600" size={32} />,
      bgColor: 'bg-amber-50',
      students: [
        { name: "রাফসান করিম", class: "৯ম শ্রেণি", detail: "বিভাগীয় পর্যায় বিতর্ক প্রতিযোগিতায় শ্রেষ্ঠ বক্তা।", image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop" },
        { name: "নুসরাত জাহান", class: "৮ম শ্রেণি", detail: "জাতীয় ক্রীড়া প্রতিযোগিতায় ১০০মি দৌঁড়ে স্বর্ণপদক।", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400" }
      ]
    },
    {
      id: 'alumni',
      title: 'প্রাক্তন শিক্ষার্থীদের সাফল্য গাঁথা',
      desc: 'আমাদের প্রাক্তনী যারা বিশ্বজুড়ে স্কুলের নাম উজ্জ্বল করছে।',
      icon: <Award className="text-emerald-600" size={32} />,
      bgColor: 'bg-emerald-50',
      students: [
        { name: "আরিয়ান শেখ", class: "ব্যাচ ২০১৮", detail: "সফটওয়্যার ইঞ্জিনিয়ার হিসেবে গুগল-এ কর্মরত।", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" },
        { name: "ড. ফারিয়া রহমান", class: "ব্যাচ ২০১২", detail: "সহকারী গবেষক, নাসা।", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* --- STUDENT OF THE MONTH - DETAILED VIEW --- */}
        <section className="mb-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-1 bg-blue-600 rounded-full"></div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-widest">স্টুডেন্ট অফ দ্য মান্থ</h2>
          </div>

          <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl overflow-hidden flex flex-col lg:flex-row">
            {/* Image Column */}
            <div className="lg:w-2/5 relative h-[400px] lg:h-auto">
              <img 
                src={spotlightStudent.image} 
                className="w-full h-full object-cover"
                alt={spotlightStudent.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                <div className="flex items-center gap-2 bg-yellow-400 text-slate-900 px-4 py-2 rounded-2xl font-black text-xs uppercase shadow-xl">
                  <Star size={16} fill="currentColor" /> স্টুডেন্ট অফ দ্য মান্থ
                </div>
              </div>
            </div>

            {/* Info Column */}
            <div className="lg:w-3/5 p-8 md:p-14">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
                <div>
                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-2">{spotlightStudent.name}</h1>
                  <p className="text-blue-600 font-bold text-lg flex items-center gap-2">
                    <BookOpen size={20} /> {spotlightStudent.class} ({spotlightStudent.section})
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-3xl">
                  <p className="text-slate-400 text-[10px] font-black uppercase">Student ID</p>
                  <p className="text-slate-900 font-black">{spotlightStudent.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-4">
                  <h4 className="font-black text-slate-800 flex items-center gap-2">
                    <Trophy className="text-yellow-500" size={18} /> অর্জনসমূহ
                  </h4>
                  <p className="text-slate-600 leading-relaxed font-medium">{spotlightStudent.achievement}</p>
                </div>
                <div className="space-y-4">
                  <h4 className="font-black text-slate-800 flex items-center gap-2">
                    <CheckCircle2 className="text-green-500" size={18} /> উপস্থিতি
                  </h4>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full w-[98%]"></div>
                  </div>
                  <p className="text-xs font-bold text-slate-400">বার্ষিক উপস্থিতি: {spotlightStudent.attendance}</p>
                </div>
              </div>

              <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 mb-8 relative">
                <Quote className="absolute -top-3 -left-3 text-blue-200" size={40} />
                <p className="text-slate-700 font-medium italic leading-relaxed">{spotlightStudent.bio}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {spotlightStudent.hobbies.map(h => (
                  <span key={h} className="bg-white border border-slate-100 px-4 py-2 rounded-xl text-xs font-bold text-slate-500">#{h}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* --- INTERACTIVE CARDS SECTION --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <div 
              key={cat.id}
              onClick={() => setSelectedCategory(cat)}
              className="group bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer relative overflow-hidden text-center"
            >
              <div className={`w-20 h-20 ${cat.bgColor} rounded-[2rem] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                {cat.icon}
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">{cat.title}</h3>
              <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">{cat.desc}</p>
              <div className="text-blue-600 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                সবাইকে দেখুন <Star size={14} />
              </div>
            </div>
          ))}
        </div>

        {/* --- POPUP / MODAL FOR DETAILED LIST --- */}
        <AnimatePresence>
          {selectedCategory && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[1000] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4"
              onClick={() => setSelectedCategory(null)}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white w-full max-w-4xl rounded-[3rem] overflow-hidden max-h-[85vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-8 md:p-12">
                  <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-4">
                      {selectedCategory.icon}
                      <h2 className="text-3xl font-black text-slate-900">{selectedCategory.title}</h2>
                    </div>
                    <button onClick={() => setSelectedCategory(null)} className="p-3 bg-slate-100 rounded-full hover:bg-slate-200">
                      <X size={24} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {selectedCategory.students.map((student, idx) => (
                      <div key={idx} className="flex items-center gap-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                        <img src={student.image} className="w-24 h-24 rounded-2xl object-cover shadow-lg" alt={student.name} />
                        <div>
                          <h4 className="text-xl font-black text-slate-900 mb-1">{student.name}</h4>
                          <p className="text-blue-600 text-xs font-black uppercase mb-2">{student.class}</p>
                          <p className="text-slate-500 text-sm font-medium leading-relaxed">{student.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default StudentPage;