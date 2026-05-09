import React from 'react';
import { Rocket, Sparkles, Timer, ChevronRight } from 'lucide-react';

const FeatureComingSoon = ({ featureName = "This Feature" }) => {
  return (
    <div className="w-full min-h-[400px] flex items-center justify-center p-4">
      <div className="relative max-w-lg w-full bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden">
        
        {/* Decorative Background Glows */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-violet-50 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-50 rounded-full blur-3xl opacity-60" />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Animated Icon Container */}
          <div className="mb-8 relative group">
            <div className="absolute inset-0 bg-violet-600 rounded-3xl rotate-6 group-hover:rotate-12 transition-transform duration-500 opacity-10" />
            <div className="relative w-20 h-20 bg-white rounded-3xl border border-gray-100 shadow-sm flex items-center justify-center text-violet-600 group-hover:-translate-y-1 transition-transform duration-500">
              <Rocket size={36} strokeWidth={1.5} className="animate-pulse" />
            </div>
            
            {/* Tiny Floating Sparkle */}
            <div className="absolute -top-2 -right-2 bg-amber-400 text-white p-1.5 rounded-lg shadow-lg animate-bounce">
              <Sparkles size={14} fill="currentColor" />
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-3">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              {featureName} is almost here!
            </h2>
            <p className="text-gray-500 font-medium leading-relaxed max-w-xs mx-auto">
              We’re currently fine-tuning this section to give you the best experience. It'll be worth the wait.
            </p>
          </div>

          {/* Progress Indicator Pill */}
          <div className="mt-8 inline-flex items-center gap-4 px-5 py-2.5 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-2">
              <Timer size={16} className="text-violet-600" />
              <span className="text-xs font-black text-gray-900 uppercase tracking-wider">Status:</span>
            </div>
            <div className="h-1.5 w-16 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-violet-500 rounded-full" />
            </div>
            <span className="text-[10px] font-black text-violet-600 uppercase tracking-widest">80% Ready</span>
          </div>

          {/* Action Hint */}
          <button className="mt-10 flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-all active:scale-95 text-sm">
            Notify Me when Live
            <ChevronRight size={16} strokeWidth={3} />
          </button>

          <p className="mt-6 text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">
            Planned Launch: Next Academic Week
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeatureComingSoon;