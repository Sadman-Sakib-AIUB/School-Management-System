import { Download, Eye } from 'lucide-react';
import React from 'react';

const BookCard = ({ book, onPreview }) => {
    return (
        <div
              key={book.id}
              className="group bg-white p-2 rounded-[2.5rem] border border-slate-200/60 hover:border-primary-500/20 hover:shadow-[0_20px_50px_rgba(79,70,229,0.05)] transition-all duration-500"
            >
              <div className="bg-slate-50 rounded-[2rem] p-8 h-full flex flex-col group-hover:bg-white transition-colors duration-500">
                <div className="flex-1">
                  <span className="inline-block px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                    {book.board}
                  </span>
                  <h3 className="text-2xl font-bold text-slate-800 leading-tight mb-2 group-hover:text-primary-600 transition-colors">
                    {book.name}
                  </h3>
                  <p className="text-slate-500 font-medium">বিষয়: {book.subject}</p>
                  <p className="text-slate-400 text-sm mt-1">{book.class}</p>
                </div>

                <div className="mt-10 flex gap-3">
                  <button
                    onClick={onPreview}
                    className="flex-1 flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 py-3.5 rounded-2xl font-bold transition-all active:scale-[0.98]"
                  >
                    <Eye size={18} />
                    প্রিভিউ
                  </button>

                  <a
                    href={book.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-primary-200 transition-all active:scale-[0.98]"
                  >
                    <Download size={18} />
                    ডাউনলোড
                  </a>
                </div>
              </div>
            </div>
    );
};

export default BookCard;