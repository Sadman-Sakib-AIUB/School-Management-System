import { GraduationCap } from "lucide-react";
import React from "react";

const AboutHero = ({ onLearnMoreClick }) => {
  return (
    // <section className="bg-primary-700 text-white py-24">
    //   <div className="container mx-auto px-4 text-center max-w-4xl">
    //     <span className="uppercase tracking-widest text-primary-200 font-bold">
    //       আমাদের সম্পর্কে
    //     </span>
    //     <h1 className="text-4xl md:text-6xl font-black mt-4 leading-tight">
    //       একটি আদর্শ শিক্ষা প্রতিষ্ঠান গড়ে তোলার অঙ্গীকার
    //     </h1>
    //     <p className="mt-6 text-primary-100 text-lg">
    //       জ্ঞান, নৈতিকতা ও আধুনিক শিক্ষার সমন্বয়ে একটি আলোকিত প্রজন্ম গঠনে আমরা প্রতিশ্রুতিবদ্ধ।
    //     </p>
    //   </div>
    // </section>
    // -------------------------------------- v2 ---------------------------------------
    <section className="bg-slate-50 py-5">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          {/* Image Content */}
          <div className="flex-1 w-full relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
              <img
                src="https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="School Building"
                className="w-full h-[400px] object-cover"
              />
            </div>
            {/* Decorative Background Frame */}
            <div className="absolute -inset-4 bg-primary-100/30 rounded-3xl -z-0 -rotate-2"></div>
          </div>

          {/* Text Content */}
          <div className="flex-1 text-left">
            <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
              আমাদের সম্পর্কে
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
              একটি আদর্শ শিক্ষা প্রতিষ্ঠান <br />
              <span className="text-primary-600">গড়ে তোলার অঙ্গীকার</span>
            </h2>

            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              জ্ঞান, নৈতিকতা ও আধুনিক শিক্ষার সমন্বয়ে একটি আলোকিত প্রজন্ম গঠনে
              আমরা প্রতিশ্রুতিবদ্ধ। আমাদের লক্ষ্য শিক্ষার্থীদের সুপ্ত প্রতিভা
              বিকাশ করা এবং তাদের আগামী দিনের যোগ্য নাগরিক হিসেবে গড়ে তোলা।
            </p>

            <div className="flex flex-wrap gap-4">
              <button onClick={onLearnMoreClick} className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-primary-200">
                আরও জানুন
              </button>
              <div className="flex items-center gap-3 px-4 py-2 border border-slate-200 rounded-xl">
                <div className="text-2xl"> <GraduationCap /></div>
                <div className="text-sm font-semibold text-slate-700">
                  ২০+ বছরের অভিজ্ঞতা
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
