import React from 'react';
import { Calendar, Bell, ChevronRight, Tag } from 'lucide-react';
import { notices } from '../../data/mockData.js';
import Link from 'next/link.js';

const NoticeBoard = () => {
  return (
    <section id="notices" className="py-20  mx-auto bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Main Notice List */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8 border-b-2 border-slate-100 pb-4">
              <h3 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                <Bell className="text-primary-600" />
                সর্বশেষ নোটিশ বোর্ড
              </h3>
              <Link href={'/notice'}>
                <button className="text-primary-700 font-bold flex cursor-pointer items-center gap-1 hover:underline">
                  সব নোটিশ দেখুন <ChevronRight size={18} />
                </button></Link>
            </div>

            <div className="space-y-4">
              {notices.map((notice) => (
                <Link
                  key={notice.id}
                  href={`/notice/${notice.id}`}
                  className="block"
                >
                  <div
                    className={`group p-6 rounded-2xl border transition-all hover:shadow-md cursor-pointer
        ${notice.isImportant
                        ? 'bg-primary-50 border-primary-200 shadow-sm'
                        : 'bg-white border-slate-100'
                      }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold
                ${notice.category === 'পরীক্ষা' ? 'bg-red-100 text-red-700' :
                                notice.category === 'ছুটি' ? 'bg-amber-100 text-amber-700' :
                                  notice.category === 'ভর্তি' ? 'bg-blue-100 text-blue-700' :
                                    'bg-slate-100 text-slate-700'
                              }`}
                          >
                            {notice.category}
                          </span>

                          {notice.isImportant && (
                            <span className="bg-red-500 text-white text-[10px] uppercase font-black px-2 py-0.5 rounded-sm animate-pulse">
                              জরুরী
                            </span>
                          )}
                        </div>

                        <h4 className="text-xl font-bold text-slate-800 group-hover:text-primary-700 transition-colors">
                          {notice.title}
                        </h4>
                      </div>

                      <div className="flex items-center text-slate-500 text-sm gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                        <Calendar size={16} />
                        {notice.date}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Featured / Highlighted Side Card */}
          <div className="w-full md:w-80 lg:w-96">
            <div className="bg-primary-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl h-full flex flex-col justify-between">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-700 rounded-full blur-3xl opacity-50" />

              <div>
                <Tag className="mb-6 opacity-80" size={40} />
                <h3 className="text-2xl font-bold mb-4">ভর্তি আবেদন ২০২৬</h3>
                <p className="text-primary-100/80 mb-6 leading-relaxed">
                  আগ্রহী অভিভাবকগণ অনলাইনে অথবা বিদ্যালয় অফিস থেকে সরাসরি ভর্তির আবেদন ফরম সংগ্রহ করতে পারবেন।
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3 text-sm">
                    <div className="mt-1 w-2 h-2 bg-secondary rounded-full" />
                    আবেদনের শেষ সময়: ১৫ নভেম্বর
                  </li>
                  <li className="flex items-start gap-3 text-sm">
                    <div className="mt-1 w-2 h-2 bg-secondary rounded-full" />
                    ভর্তি পরীক্ষা: ২০ নভেম্বর
                  </li>
                </ul>
              </div>

              <button className="bg-white hover:bg-amber-500 text-slate-900 w-full py-4 rounded-2xl font-black text-lg transition-transform hover:scale-105 active:scale-95">
                আবেদন করুন
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NoticeBoard;
