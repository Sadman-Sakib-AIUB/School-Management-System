import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { stats } from '../../data/mockData.js';

const chartData = [
  { name: '২০২০', rate: 92 },
  { name: '২০২১', rate: 84 },
  { name: '২০২২', rate: 96 },
  { name: '২০২৩', rate: 97 },
  { name: '২০২৪', rate: 68 },
];

const Stats = () => {
  return (
    <section id="stats" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-primary-600 font-bold tracking-widest uppercase text-sm mb-4 block">আমাদের অর্জন</span>
            <h3 className="text-4xl font-black text-slate-800 mb-8 leading-tight">বিগত ৫ বছরের এসএসসি পরীক্ষার সাফল্যের চিত্র</h3>
            <div className="h-[350px] w-full bg-slate-50 p-6 rounded-3xl border border-slate-100">

              {/* -------------------------------------- Bar Chart ---------------------------------- */}
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 14}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 14}} domain={[0, 100]} />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    formatter={(value) => [value.toLocaleString('bn-BD'), 'পাশের হার']}
                  />
                  <Bar dataKey="rate" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? 'var(--primary-600)' : 'var(--primary-500)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* --------------------------------------Area Chart----------------------------------- */}
              {/* <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />

                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 14 }}
                    dy={10}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 14 }}
                    domain={[0, 100]}
                  />

                  <Tooltip
                    cursor={{ stroke: '#cbd5f5', strokeWidth: 1 }}
                    contentStyle={{
                      borderRadius: '1rem',
                      border: 'none',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    }}
                  />

                  <defs>
                    <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>

                  <Area
                    type="monotone"
                    dataKey="rate"
                    stroke="#059669"
                    strokeWidth={3}
                    fill="url(#rateGradient)"
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer> */}

            </div>
            <p className="mt-6 text-slate-500 text-center italic">উৎস: শিক্ষা বোর্ড বার্ষিক ফলাফল রিপোর্ট</p>
          </div>

          <div className="grid grid-cols-2 gap-6">

            {stats.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div key={idx} className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 hover:border-primary-200 hover:bg-white hover:shadow-xl transition-all group">
                  <div className="text-4xl mb-4  transform transition-transform group-hover:scale-110 duration-300"><IconComponent size={32} /></div>
                  <div className="text-4xl font-black text-primary-700 mb-2">{item.value}</div>
                  <div className="text-slate-600 font-bold">{item.label}</div>
                </div>
              )
            })}

            <div className="col-span-2 bg-primary-700 p-8 rounded-[2rem] text-white flex items-center justify-between">
              <div>
                <h4 className="text-xl font-bold mb-1">অংশ নিন আমাদের সাথে</h4>
                <p className="text-emerald-100">একটি উজ্জ্বল ভবিষ্যৎ গঠনে আপনার যাত্রা শুরু হোক এখান থেকেই।</p>
              </div>
              <button className="bg-white text-primary-800 px-6 py-3 rounded-2xl font-bold hover:bg-amber-400 hover:text-slate-900 transition-colors cursor-pointer">ভর্তি হন</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
