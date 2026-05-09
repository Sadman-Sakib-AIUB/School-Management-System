import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image:
      "https://contextbd.com/wp-content/uploads/2016/11/Context_Masco-school_design-source08.jpg",
    title: "শিক্ষাই জাতির মেরুদণ্ড",
    subtitle: "আদর্শ মানুষ গড়ার কারিগর আমাদের এই প্রিয় প্রতিষ্ঠান।",
    cta: "ভর্তি ফরম",
  },
  {
    image:
      "https://contextbd.com/wp-content/uploads/2016/11/masco-school-6.jpg",
    title: "আধুনিক ল্যাব ও ডিজিটাল ক্লাসরুম",
    subtitle: "প্রযুক্তিনির্ভর শিক্ষার মাধ্যমে আগামীর ভবিষ্যৎ বিনির্মাণ।",
    cta: "ক্যাম্পাস ট্যুর",
  },
  {
    image:
      "https://contextbd.com/wp-content/uploads/2016/11/Context_Masco-school_design-source03.jpg",
    title: "২০২৬ শিক্ষাবর্ষে ভর্তি চলছে",
    subtitle: "প্রথম শ্রেণী থেকে দশম শ্রেণী পর্যন্ত আসন সীমিত।",
    cta: "এখনই আবেদন করুন",
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () =>
    setCurrent(current === slides.length - 1 ? 0 : current + 1);
  const prevSlide = () =>
    setCurrent(current === 0 ? slides.length - 1 : current - 1);

  return (
    <section className="relative h-[500px] md:h-[550px] container mx-auto px-4 overflow-hidden">
      <div className="relative w-full h-full rounded-2xl overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? "opacity-100 scale-100 pointer-events-auto z-20" : "opacity-0 scale-110 pointer-events-none z-10"}`}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-slate-900/30 z-10" />
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center text-center px-4">
              <div className="max-w-4xl">
                <div className="bg-primary-500/80 text-white inline-block px-4 py-1 rounded-full mb-6 text-sm font-medium animate-bounce">
                  স্বাগতম আমাদের বিদ্যালয়ে
                </div>
                <h2 className="text-3xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-2xl text-slate-100 mb-10 max-w-2xl mx-auto leading-relaxed">
                  {slide.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-primary hover:bg-primary-700 text-white px-8 py-4 rounded-full text-lg font-bold transition-all transform hover:scale-105 shadow-xl">
                    {slide.cta}
                  </button>

                  <button className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-full text-lg font-bold transition-all">
                    আমাদের সম্পর্কে জানুন
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-sm transition-all"
      >
        <ChevronLeft size={32} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-sm transition-all"
      >
        <ChevronRight size={32} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${i === current ? "w-8 bg-primary-400" : "w-2 bg-white/50"}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
