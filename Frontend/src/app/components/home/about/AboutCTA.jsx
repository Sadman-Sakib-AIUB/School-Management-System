import React from 'react';

const AboutCTA = () => {
    return (
        <section className="py-20 bg-primary-700">
        <div className="container mx-auto px-4 text-center text-white">
          <h3 className="text-4xl font-black mb-6">
            আপনার সন্তানের উজ্জ্বল ভবিষ্যৎ গড়ুন আমাদের সাথে
          </h3>
          <p className="text-primary-100 mb-8">
            আজই ভর্তি প্রক্রিয়া সম্পর্কে জানুন
          </p>
          <button className="bg-white text-primary-800 px-10 py-4 rounded-2xl font-bold hover:bg-amber-400 transition">
            ভর্তি সংক্রান্ত তথ্য
          </button>
        </div>
      </section>
    );
};

export default AboutCTA;