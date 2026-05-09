"use client"
import React, { useState } from 'react';
import { 
  Trophy, 
  Users, 
  Music, 
  Microscope, 
  MessageSquare, 
  Flag, 
  Star, 
  ChevronRight,
  Heart,
  Layout
} from 'lucide-react';

const AcademicActivities = () => {
  const [activeTab, setActiveTab] = useState('clubs');

  const content = {
    clubs: [
      { 
        title: "বিতর্ক ক্লাব", 
        desc: "যুক্তিনির্ভর চিন্তা ও বাচনভঙ্গি উন্নয়নের লক্ষ্যে নিয়মিত বিতর্ক প্রতিযোগিতা ও কর্মশালা পরিচালিত হয়।",
        icon: <MessageSquare className="text-blue-500" />,
        color: "bg-blue-50"
      },
      { 
        title: "সায়েন্স ক্লাব", 
        desc: "বিজ্ঞান মেলা, হাতে-কলমে পরীক্ষা এবং নতুন উদ্ভাবনী প্রজেক্টের মাধ্যমে শিক্ষার্থীদের বিজ্ঞানমনস্ক করা হয়।",
        icon: <Microscope className="text-emerald-500" />,
        color: "bg-emerald-50"
      },
      { 
        title: "সাংস্কৃতিক সংঘ", 
        desc: "গান, নাচ, আবৃত্তি ও নাট্যচর্চার মাধ্যমে শিক্ষার্থীদের সুপ্ত প্রতিভা বিকাশে কাজ করে এই সংঘ।",
        icon: <Music className="text-purple-500" />,
        color: "bg-purple-50"
      }
    ],
    sports: [
      { 
        title: "বার্ষিক ক্রীড়া প্রতিযোগিতা", 
        desc: "বছরের শুরুতে জাঁকজমকপূর্ণভাবে অনুষ্ঠিত হয় বার্ষিক ক্রীড়া, যা শিক্ষার্থীদের মাঝে প্রতিযোগিতার মনোভাব গড়ে তোলে।",
        icon: <Trophy className="text-amber-500" />,
        color: "bg-amber-50"
      },
      { 
        title: "নিয়মিত খেলাধুলা", 
        desc: "প্রতিদিন টিফিন বিরতিতে এবং নির্দিষ্ট পিরিয়ডে ফুটবল, ক্রিকেট ও ইনডোর গেমসের সুযোগ রয়েছে।",
        icon: <Star className="text-rose-500" />,
        color: "bg-rose-50"
      }
    ],
    discipline: [
      { 
        title: "স্কাউট ও গার্ল গাইড", 
        desc: "শারীরিক গঠন ও সেবামূলক মানসিকতা তৈরির জন্য স্কাউটিং কার্যক্রম আমাদের স্কুলের একটি অবিচ্ছেদ্য অংশ।",
        icon: <Flag className="text-indigo-500" />,
        color: "bg-indigo-50"
      },
      { 
        title: "মানসিক শৃঙ্খলা", 
        desc: "নিয়মিত পিটি, প্যারেড এবং কাউন্সিলিংয়ের মাধ্যমে শিক্ষার্থীদের সুশৃঙ্খল হিসেবে গড়ে তোলা হয়।",
        icon: <Heart className="text-pink-500" />,
        color: "bg-pink-50"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <Layout size={14} /> আমাদের শিক্ষা কার্যক্রম
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
            লেখাপড়ার পাশাপাশি <span className="text-primary-600">জীবনমুখী শিক্ষা</span>
          </h1>
          <p className="text-slate-500 text-lg">
            আমরা বিশ্বাস করি শুধু পাঠ্যবই নয়, সহ-শিক্ষা কার্যক্রমের মাধ্যমেই একজন শিক্ষার্থী পূর্ণাঙ্গ মানুষ হিসেবে গড়ে ওঠে।
          </p>
        </div>

        {/* Dynamic Tabs Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            { id: 'clubs', label: 'ক্লাবসমূহ', icon: <Users size={18}/> },
            { id: 'sports', label: 'খেলাধুলা', icon: <Trophy size={18}/> },
            { id: 'discipline', label: 'শৃঙ্খলা ও স্কাউটিং', icon: <Flag size={18}/> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all duration-300 ${
                activeTab === tab.id 
                ? 'bg-slate-900 text-white shadow-xl scale-105' 
                : 'bg-white text-slate-500 border border-slate-200 hover:border-primary-500'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content Display Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content[activeTab].map((item, idx) => (
            <div 
              key={idx} 
              className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
            >
              {/* Decorative Circle Background */}
              <div className={`absolute -right-4 -top-4 w-24 h-24 ${item.color} rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700`}></div>
              
              <div className="relative z-10">
                <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform`}>
                  {React.cloneElement(item.icon, { size: 32 })}
                </div>
                
                <h3 className="text-2xl font-black text-slate-800 mb-4">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  {item.desc}
                </p>
                
                <div className="flex items-center gap-2 text-primary-600 font-bold text-sm">
                  বিস্তারিত জানুন <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner Section */}
        <div className="mt-20 bg-primary-600 rounded-[3rem] p-8 md:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-primary-200">
           <div className="relative z-10">
             <h2 className="text-3xl md:text-4xl font-black mb-6">আপনার সন্তানকে কি এই কার্যক্রমে যুক্ত করতে চান?</h2>
             <p className="text-primary-100 mb-10 max-w-2xl mx-auto">সকল ক্লাব ও স্কাউটিং কার্যক্রমের জন্য স্কুল চলাকালীন সময়ে দায়িত্বপ্রাপ্ত শিক্ষকদের সাথে যোগাযোগ করুন।</p>
             <button className="bg-white text-primary-600 px-10 py-4 rounded-2xl font-black hover:bg-slate-900 hover:text-white transition-all">
               ভর্তির নিয়মাবলী দেখুন
             </button>
           </div>
           {/* Abstract Shape */}
           <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>
    </div>
  );
};

export default AcademicActivities; 