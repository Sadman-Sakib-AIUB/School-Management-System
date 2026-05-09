import { Calendar, NotepadText } from 'lucide-react';
import { notices } from '../../data/mockData.js';
import React from 'react';
import Link from 'next/link.js';
import Breadcrumb from '../../components/Breadcrumb.jsx';


const Notices = () => {
  return (
    <div className="container mx-auto py-33">

      <div>

        <h1 className='text-4xl text-center text-primary-700 font-bold mb-8'><Breadcrumb /><span><NotepadText className='inline-block size-8 mr-2' /></span>সব নোটিশ</h1>
      
      </div>


      <div>
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

    </div>
  );
};

export default Notices