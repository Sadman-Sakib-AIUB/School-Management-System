import { Award, BookOpen, School, Users, Image } from 'lucide-react';
import React from 'react';
import ImageSlider from './ImageSlider';

const AboutSchool = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* -------- Left Content -------- */}
        <div>
          <h2 className="text-4xl font-black text-slate-800 mb-6">
            আমাদের বিদ্যালয় সম্পর্কে
          </h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            আমাদের বিদ্যালয় একটি স্বনামধন্য শিক্ষা প্রতিষ্ঠান, যা দীর্ঘদিন ধরে
            সুনামের সাথে শিক্ষার্থীদের মানসম্মত শিক্ষা প্রদান করে আসছে।
            আধুনিক পাঠ্যক্রম, দক্ষ শিক্ষক এবং নৈতিক শিক্ষার সমন্বয়ে আমরা শিক্ষার্থীদের
            ভবিষ্যতের জন্য প্রস্তুত করি।
          </p>
          <p className="text-slate-600 leading-relaxed mb-6">
            আমরা শুধু পরীক্ষার ফলাফলে নয়, বরং একজন আদর্শ মানুষ গড়ে তোলার উপর গুরুত্ব দিই।
            আমাদের বিদ্যালয় একটি স্বনামধন্য শিক্ষা প্রতিষ্ঠান, যা দীর্ঘদিন ধরে
            সুনামের সাথে শিক্ষার্থীদের মানসম্মত শিক্ষা প্রদান করে আসছে।
            আধুনিক পাঠ্যক্রম, দক্ষ শিক্ষক এবং নৈতিক শিক্ষার সমন্বয়ে আমরা শিক্ষার্থীদের
            ভবিষ্যতের জন্য প্রস্তুত করি।
          </p>
          <p className="text-slate-600 leading-relaxed">
            আমরা শুধু পরীক্ষার ফলাফলে নয়, বরং একজন আদর্শ মানুষ গড়ে তোলার উপর গুরুত্ব দিই।
            আমাদের বিদ্যালয় একটি স্বনামধন্য শিক্ষা প্রতিষ্ঠান, যা দীর্ঘদিন ধরে
            সুনামের সাথে শিক্ষার্থীদের মানসম্মত শিক্ষা প্রদান করে আসছে।
            আধুনিক পাঠ্যক্রম, দক্ষ শিক্ষক এবং নৈতিক শিক্ষার সমন্বয়ে আমরা শিক্ষার্থীদের
            ভবিষ্যতের জন্য প্রস্তুত করি।
          </p>
        </div>

        {/* -------- Right Side (Image + Stats) -------- */}
        <div className="space-y-8">

          {/* Image */}
          <ImageSlider/>
           
          </div>

          {/* Info Card */}
          <div className="bg-slate-50 p-10 rounded-[2rem] border border-slate-100">
            <ul className="space-y-6">
              <li className="flex gap-4">
                <School className="text-primary-600" />
                <span className="font-semibold text-slate-700">
                  প্রতিষ্ঠিত: ১৯৯৮ সাল
                </span>
              </li>
              <li className="flex gap-4">
                <Users className="text-primary-600" />
                <span className="font-semibold text-slate-700">
                  শিক্ষার্থী: ২০০০+
                </span>
              </li>
              <li className="flex gap-4">
                <BookOpen className="text-primary-600" />
                <span className="font-semibold text-slate-700">
                  অভিজ্ঞ শিক্ষক: ৬৫ জন
                </span>
              </li>
              <li className="flex gap-4">
                <Award className="text-primary-600" />
                <span className="font-semibold text-slate-700">
                  বোর্ডে সাফল্যের হার: ৯৫%+
                </span>
              </li>
            </ul>
          </div>

        </div>
      
    </section>
  );
};

export default AboutSchool;
