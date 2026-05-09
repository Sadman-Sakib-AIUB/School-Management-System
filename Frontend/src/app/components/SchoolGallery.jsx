import React, { useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ArrowUpRight,
} from "lucide-react";
import { gallery } from "../data/mockData";

const SchoolGallery = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const nextSlide = () =>
    setSelectedIndex((prev) => (prev + 1) % gallery.length);
  const prevSlide = () =>
    setSelectedIndex((prev) => (prev - 1 + gallery.length) % gallery.length);

  return (
    <section className="py-24 bg-white overflow-hidden">
      {/* Header Area */}
      <div className="max-w-7xl mx-auto px-6 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-primary-600 font-bold tracking-[0.1em] uppercase text-[15px] mb-3 block">
            ইমেজ গ্যালারি
          </span>
          <h2 className="text-5xl md:text-6xl font-black text-slate-900 leading-none">
            ক্যাম্পাস{" "}
            <span className="text-transparent bg-clip-text bg-primary-500">
              লাইফ
            </span>
          </h2>
        </div>
        <p className="text-slate-500 max-w-xs text-sm leading-relaxed border-l-2 border-primary-600 pl-4">
          আমাদের প্রতিটি মুহূর্তের গল্প ফুটে ওঠে ক্যামেরার ফ্রেমে। ক্যাম্পাসের
          সেরা মুহূর্তগুলো দেখুন।
        </p>
      </div>

      {/* Infinite Auto-Scroll Track */}
      <div className="container mx-auto px-4">
        <div className="relative group overflow-hidden rounded-3xl">
          <div className="flex w-max gap-8 animate-infinite-scroll group-hover:[animation-play-state:paused]">
            {/* Double the list for seamless loop */}
            {[...gallery, ...gallery].map((item, index) => (
              <div
                key={index}
                onClick={() => setSelectedIndex(index % gallery.length)}
                className="relative w-[320px] md:w-[500px] h-[350px] rounded-[2.5rem] overflow-hidden cursor-pointer transition-all duration-700 hover:z-10"
              >
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />

                {/* Sleek Overlay - Glassmorphism style */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/90 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-white text-2xl font-bold tracking-tight mb-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-primary-400 font-semibold text-sm">
                      <span>বিস্তারিত দেখুন</span>
                      <ArrowUpRight size={16} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          

          {/* CSS for Infinite Scroll & Scrollbar Removal */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
          @keyframes infinite-scroll {
            from { transform: translateX(0); }
            to { transform: translateX(calc(-50% - 1rem)); }
          }
          .animate-infinite-scroll {
            animation: infinite-scroll 50s linear infinite;
          }
          /* Ensure no scrollbar appears anywhere */
          body { overflow-x: hidden; }
          ::-webkit-scrollbar { display: none; }
          * { -ms-overflow-style: none; scrollbar-width: none; }
        `,
            }}
          />
        </div>
      </div>

      {/* Ultra-Modern Full-Screen Lightbox */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-3xl p-4 md:p-10 animate-in fade-in zoom-in duration-300">
          {/* Close Button - Clean Top Right */}
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-8 right-8 w-14 h-14 flex items-center justify-center bg-slate-100 text-slate-900 rounded-full hover:bg-slate-200 transition-all active:scale-90 z-[110]"
          >
            <X size={28} />
          </button>

          {/* Navigation Arrows - Integrated at bottom for 2026 mobile-first feel */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 z-[110]">
            <button
              onClick={prevSlide}
              className="w-12 h-12 flex items-center justify-center rounded-full border border-slate-200 text-slate-900 hover:bg-slate-900 hover:text-white transition-all"
            >
              <ChevronLeft size={32} />
            </button>
            <div className="whitespace-nowrap bg-slate-900 text-white px-3 py-2 rounded-full font-mono text-sm tracking-widest shadow-xl">
              {String(selectedIndex + 1).padStart(2, "0")} /{" "}
              {String(gallery.length).padStart(2, "0")}
            </div>
            <button
              onClick={nextSlide}
              className="w-12 h-12 flex items-center justify-center rounded-full border border-slate-200 text-slate-900 hover:bg-slate-900 hover:text-white transition-all"
            >
              <ChevronRight size={32} />
            </button>
          </div>

          {/* Image Container */}
          <div className="relative w-full max-w-6xl flex flex-col items-center">
            <img
              src={gallery[selectedIndex].url}
              alt="Full view"
              className="max-h-[70vh] w-auto object-contain rounded-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)]"
            />
            <h3 className="mt-8 text-3xl font-black text-slate-900 tracking-tight text-center">
              {gallery[selectedIndex].title}
            </h3>
          </div>
        </div>
      )}
    </section>
  );
};

export default SchoolGallery;
