"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, MapPin, Sparkles, Camera, Award } from 'lucide-react';

const GalleryPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState('All');

  const galleryData = [
    { 
      id: 1, 
      category: 'কার্যক্রম', 
      title: 'দৈনিক সমাবেশ ও শপথ', 
      location: 'স্কুল প্রাঙ্গণ',
      image: 'https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=800&q=80'
    },
    { 
      id: 2, 
      category: 'বিজ্ঞান মেলা', 
      title: 'বিজ্ঞান মেলায় খুদে বিজ্ঞানীদের প্রজেক্ট', 
      location: 'বিজ্ঞান গবেষণাগার',
      image: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?w=800' 
    },
    { 
      id: 3, 
      category: 'শ্রেণীকক্ষ', 
      title: 'শ্রেণিকক্ষে দলগত কাজ', 
      location: '১০ম শ্রেণি',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800' 
    },
    { 
      id: 4, 
      category: 'পুরস্কার', 
      title: 'বার্ষিক ক্রীড়া পুরস্কার বিতরণী', 
      location: 'মেইন স্টেজ',
      image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800' 
    },
    { 
      id: 5, 
      category: 'ক্যাম্পাস', 
      title: 'টিফিন পিরিয়ডে বন্ধুদের আড্ডা', 
      location: 'স্কুল করিডোর',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800' 
    },
    { 
      id: 6, 
      category: 'কার্যক্রম', 
      title: 'লাইব্রেরিতে পড়াশোনার মুহূর্ত', 
      location: 'কেন্দ্রীয় গ্রন্থাগার',
      image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800' 
    },
    { 
      id: 7, 
      category: 'শ্রেণীকক্ষ', 
      title: 'ডিজিটাল ল্যাবে কম্পিউটার শেখা', 
      location: 'আইসিটি ল্যাব',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800' 
    },
    { 
      id: 8, 
      category: 'ইভেন্টসমূহ', 
      title: 'সাংস্কৃতিক অনুষ্ঠানে নৃত্য পরিবেশনা', 
      location: 'অডিটোরিয়াম',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800' 
    }
  ];

  const categories = ['All', 'ক্যাম্পাস', 'শ্রেণীকক্ষ', 'বিজ্ঞান মেলা', 'পুরস্কার', 'কার্যক্রম'];

  const filteredImages = filter === 'All' 
    ? galleryData 
    : galleryData.filter(img => img.category === filter);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Title Section */}
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex justify-center gap-2 text-blue-600 mb-3"
          >
            <Camera size={24} />
            <Sparkles size={24} className="animate-pulse" />
          </motion.div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            ক্যাম্পাস <span className="text-blue-600">লাইফ গ্যালারি</span>
          </h1>
          <p className="text-slate-500 text-base max-w-xl mx-auto font-medium">
            আমাদের শিক্ষার্থীদের প্রাণবন্ত মুহূর্ত ও সৃজনশীলতার এক ঝলক।
          </p>
        </div>

        {/* Dynamic Filter Tabs - Smaller Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-xl font-bold text-xs transition-all duration-300 ${
                filter === cat 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'
              }`}
            >
              {cat === 'All' ? 'সব ছবি' : cat}
            </button>
          ))}
        </div>

        {/* Standard Sized Image Grid - 4 Columns on Large Screens */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredImages.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative group cursor-pointer"
                onClick={() => setSelectedImage(item)}
              >
                {/* Standard Card - Smaller Aspect Ratio */}
                <div className="relative aspect-square overflow-hidden rounded-3xl bg-slate-200 shadow-md group-hover:shadow-xl transition-all duration-500">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Smaller Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-slate-900 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm">
                      {item.category}
                    </span>
                  </div>

                  {/* Info Overlay - More Compact */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-5">
                    <div className="flex items-center gap-1 text-white/70 text-[10px] font-bold mb-1">
                      <MapPin size={12} /> {item.location}
                    </div>
                    <h3 className="text-white text-sm font-bold leading-tight mb-2">
                      {item.title}
                    </h3>
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white self-end">
                      <Maximize2 size={14} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox Modal (unchanged as it needs to be big) */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[999] bg-slate-950/98 backdrop-blur-xl flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <button className="absolute top-6 right-6 text-white p-2">
                <X size={32} />
              </button>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-4xl w-full flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <img 
                  src={selectedImage.image} 
                  className="w-full h-auto max-h-[70vh] object-contain rounded-2xl shadow-2xl border border-white/10"
                />
                <div className="mt-6 text-center text-white">
                  <span className="bg-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase mb-2 inline-block">
                    {selectedImage.category}
                  </span>
                  <h2 className="text-xl md:text-2xl font-black mb-1">{selectedImage.title}</h2>
                  <p className="text-white/40 font-bold text-[10px] uppercase">
                    <MapPin size={12} className="inline mr-1" /> {selectedImage.location}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GalleryPage;