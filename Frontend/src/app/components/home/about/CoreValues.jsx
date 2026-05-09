import React from 'react';
import { ShieldCheck, GraduationCap, Heart, Lightbulb, Flag, Infinity, Sparkles } from 'lucide-react';

const values = [
  { title: "নৈতিকতা ও শৃঙ্খলা", icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
  { title: "শিক্ষায় উৎকর্ষতা", icon: GraduationCap, color: "text-blue-600", bg: "bg-blue-50" },
  { title: "সমতা ও সহানুভূতি", icon: Heart, color: "text-rose-600", bg: "bg-rose-50" },
  { title: "নবীন চিন্তা", icon: Lightbulb, color: "text-amber-600", bg: "bg-amber-50" },
  { title: "দেশপ্রেম", icon: Flag, color: "text-red-600", bg: "bg-red-50" },
  { title: "আজীবন শিক্ষা", icon: Infinity, color: "text-indigo-600", bg: "bg-indigo-50" },
];

const CoreValues = () => {
  return (
    <section className="py-12 bg-[#fcfcfd]">
      <div className="container mx-auto px-4 max-w">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-5xl font-bold text-slate-800 tracking-tight">মূল্যবোধ</h2>
          <div className="h-px flex-1 bg-slate-200 ml-6"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {values.map((item, idx) => (
            <div
              key={idx}
              className="group relative bg-white p-12 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all duration-300"
            >
              <div className={`w-20 h-20 ${item.bg} ${item.color} rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110`}>
                <item.icon size={30} />
              </div>
              <h3 className="text-2xl font-bold text-slate-700 leading-tight">
                {item.title}
              </h3>
              {/* Subtle accent bar on hover */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-slate-400 group-hover:w-1/2 transition-all duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreValues;

