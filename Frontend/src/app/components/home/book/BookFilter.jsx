import { BookOpen, Filter, Search } from 'lucide-react';
import React from 'react';

const BookFilter = ({classes, boards, selectedClass, setSelectedClass, selectedBoard, setSelectedBoard, search, setSearch}) => {
    return (
        <section className="-mt-12 relative z-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-white/80 backdrop-blur-xl p-3 md:p-4 rounded-3xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] grid grid-cols-1 md:grid-cols-3 gap-3">
            
            <div className="relative group">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
              <select
                className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-transparent focus:border-primary-500/30 focus:bg-white rounded-2xl transition-all appearance-none cursor-pointer outline-none text-slate-700 font-medium"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                {classes.map((cls) => <option key={cls}>{cls}</option>)}
              </select>
            </div>

            <div className="relative group">
              <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
              <select
                className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-transparent focus:border-primary-500/30 focus:bg-white rounded-2xl transition-all appearance-none cursor-pointer outline-none text-slate-700 font-medium"
                value={selectedBoard}
                onChange={(e) => setSelectedBoard(e.target.value)}
              >
                {boards.map((board) => <option key={board}>{board}</option>)}
              </select>
            </div>

            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="বইয়ের নাম দিয়ে সার্চ করুন..."
                className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-transparent focus:border-primary-500/30 focus:bg-white rounded-2xl transition-all outline-none text-slate-700 placeholder:text-slate-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>
    );
};

export default BookFilter;