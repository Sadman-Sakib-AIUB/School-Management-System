import { BookOpen } from 'lucide-react';
import React from 'react';

const BookHeader = () => {
    return (
        <section className="relative overflow-hidden bg-slate-900 pt-32 pb-24 text-white">
      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="inline-flex p-3 rounded-2xl bg-primary-500/10 border border-primary-500/20 mb-6 backdrop-blur-sm">
          <BookOpen size={32} className="text-primary-400" />
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
          ই-বুক <span className="text-primary-400">লাইব্রেরি</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">প্রয়োজনীয় পাঠ্যপুস্তকগুলো এখন আরও সহজে খুঁজে নাও এবং ডাউনলোড করো সরাসরি তোমার ডিভাইসে।</p>
      </div>
    </section>
    );
};

export default BookHeader;