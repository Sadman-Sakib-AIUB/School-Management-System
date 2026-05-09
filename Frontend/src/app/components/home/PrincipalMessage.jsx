import React from 'react';
import { Quote } from 'lucide-react';

const PrincipalMessage = () => {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-[2rem] overflow-hidden shadow-xl flex flex-col lg:flex-row items-stretch border border-slate-100">
          <div className="lg:w-2/5 relative">
            <img 
              src={"./principal.jpg"} 
              alt="Principal" 
              className="w-full h-full object-cover min-h-[400px]"
            />
            <div className="absolute bottom-8 left-8 right-8 bg-primary-800/90 backdrop-blur-md p-6 rounded-2xl text-white">
              <h4 className="text-2xl font-bold">মো: রফিক আহমেদ</h4>
              <p className="text-primary-100 text-sm">প্রধান শিক্ষক, আদর্শ উচ্চ বিদ্যালয়</p>
            </div>
          </div>
          <div className="lg:w-3/5 p-8 md:p-16 flex flex-col justify-center">
            <Quote className="text-primary-100 mb-6" size={64} />
            <h3 className="text-3xl font-black text-slate-800 mb-8 leading-tight">অধ্যক্ষের বাণী</h3>
            <div className="space-y-6 text-slate-600 text-lg leading-relaxed italic">
              <p>
                "সুশিক্ষা কেবল পুথিগত বিদ্যার মধ্যে সীমাবদ্ধ নয়, বরং এটি চরিত্র গঠন ও নৈতিকতা বিকাশের একটি মাধ্যম। আমাদের এই শিক্ষা প্রতিষ্ঠানটি দীর্ঘ দুই যুগেরও বেশি সময় ধরে মানসম্মত শিক্ষা প্রদানের মাধ্যমে দক্ষ ও সুনাগরিক গড়ে তোলার কাজ করে যাচ্ছে।"
              </p>
              <p>
                "আমরা বিশ্বাস করি প্রতিটি শিশুর মধ্যে সুপ্ত প্রতিভা রয়েছে। আমাদের অভিজ্ঞ শিক্ষক মণ্ডলী এবং আধুনিক শিক্ষার পরিবেশ সেই প্রতিভার বিকাশে গুরুত্বপূর্ণ ভূমিকা পালন করে। আমি সকল অভিভাবক ও শিক্ষার্থীদের আমাদের পথচলায় সাথে থাকার জন্য ধন্যবাদ জানাই।"
              </p>
            </div>
            <div className="mt-12 flex items-center gap-6">
              <div className="w-16 h-1 bg-primary-600 rounded-full" />
              <button className="text-primary-700 font-bold hover:underline">আরও বিস্তারিত পড়ুন</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrincipalMessage;
