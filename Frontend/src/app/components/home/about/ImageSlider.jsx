"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  "https://contextbd.com/wp-content/uploads/2016/11/Context_Masco-school_design-source08.jpg",
  "https://contextbd.com/wp-content/uploads/2016/11/masco-school-6.jpg",
  "https://contextbd.com/wp-content/uploads/2016/11/Context_Masco-school_design-source03.jpg",
];

const ImageSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const prev = () =>
    setCurrent((current - 1 + images.length) % images.length);

  const next = () =>
    setCurrent((current + 1) % images.length);

  return (
    <div className="relative h-[360px] rounded-[2rem] overflow-hidden border border-slate-100">

      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt="School Campus"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700
            ${index === current ? "opacity-100" : "opacity-0"}`}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Controls */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-md p-2 rounded-full text-white z-10"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-md p-2 rounded-full text-white z-10"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all
              ${i === current ? "w-8 bg-primary-400" : "w-2 bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
