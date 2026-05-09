"use client"
import Link from 'next/link';
import { siteInfo } from '../../data/mockData';
import { Heart, ArrowUp, ChevronRight } from 'lucide-react';


const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-slate-950 text-slate-400 pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div>
            <div className="flex items-center gap-3 mb-6 text-white">
              <div className="w-10 h-10 bg-primary-700 rounded-lg flex items-center justify-center font-bold text-xl">S</div>
              <h4 className="font-bold text-xl">{siteInfo.schoolName}</h4>
            </div>
            <p className="leading-relaxed mb-8">
              মানসম্মত শিক্ষা ও নৈতিক চরিত্র গঠনের লক্ষে আমরা নিরলস কাজ করে যাচ্ছি। আমাদের মূল চালিকাশক্তি হলো আমাদের শিক্ষার্থীদের সাফল্য।
            </p>
            <div className="flex items-center gap-2 text-white font-bold text-sm bg-white/5 p-4 rounded-2xl border border-white/10">
              <span className="text-primary-500">প্রতিষ্ঠার সাল:</span> {siteInfo.established}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-xl mb-8 border-l-4 border-primary-600 pl-4">গুরুত্বপূর্ণ লিংক</h4>
            <ul className="space-y-4">
              {[{name: 'শিক্ষা বোর্ড', url: '/board'}, {name: 'উপবৃত্তি তথ্য', url: '/upobritti'}, {name: 'বই ডাউনলোড', url: '/books'}, {name: 'বোর্ড পরীক্ষার ফলাফল চেক', url: '/results'}, {name: 'শিক্ষক বাতায়ন', url: '/teacher'}].map(link => (
                <li key={link.name}>
                  <Link href={link.url} className="flex items-center gap-2 hover:text-primary-500 transition-colors group">
                    <ChevronRight size={16} className="text-primary-700 group-hover:translate-x-1 transition-transform" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xl mb-8 border-l-4 border-primary-600 pl-4">অ্যাকাডেমিক মেনু</h4>
            <ul className="space-y-4">
              {[{name: 'অ্যাকাডেমিক ক্যালেন্ডার', url: '/academic-calendar'}, {name: 'ক্লাস রুটিন', url: '/class-routine'}, {name: 'সিলেবাস', url: '/syllabus'}, {name: 'পোশাক ও নিয়মাবলী', url: '/uniform-rules'}, {name: 'সহ-শিক্ষা কার্যক্রম', url: '/co-curricular'}].map(link => (
                <li key={link.name}>
                  <Link href={link.url} className="flex items-center gap-2 hover:text-primary-500 transition-colors group">
                    <ChevronRight size={16} className="text-primary-700 group-hover:translate-x-1 transition-transform" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xl mb-8 border-l-4 border-primary-600 pl-4">একনজরে বিদ্যালয়</h4>
            <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-4">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>EIIN</span>
                <span className="text-white font-bold">{siteInfo.eiin}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>স্কুল কোড</span>
                <span className="text-white font-bold">{siteInfo.schoolCode}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>মন্ত্রণালয়</span>
                <span className="text-white font-bold">শিক্ষা মন্ত্রণালয়</span>
              </div>
              <Link href="/about">
                <button className="w-full bg-primary-700 hover:bg-primary-600 text-white py-3 rounded-xl font-bold transition-all text-sm mt-2">
                  বিস্তারিত স্কুল প্রোফাইল
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm">
            স্বত্ব © ২০২৫ {siteInfo.schoolName}। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <div className="flex items-center gap-2 text-sm bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <span>Developed By</span>
            <Heart size={14} className="text-red-500 fill-red-500" />
            <span className="text-white font-bold">Sadman Sakib</span>
          </div>
          <button
            onClick={scrollToTop}
            className="p-4 bg-primary-700 text-white rounded-full hover:bg-primary-600 shadow-lg shadow-primary-900/20 transition-all hover:-translate-y-1"
          >
            <ArrowUp size={20} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
