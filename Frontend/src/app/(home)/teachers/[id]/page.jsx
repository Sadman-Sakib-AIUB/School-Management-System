"use client"
import React from 'react';
import { getTeacherById } from '../../../data/teachersData'; 
import { ArrowLeft, GraduationCap, Award, Mail, Phone, Star, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';

const TeacherDetails = ({ params }) => {
  const router = useRouter();
  
  
  const resolvedParams = React.use(params); 
  const id = resolvedParams.id;

  
  const teacher = getTeacherById(id); 

  if (!teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">শিক্ষক পাওয়া যায়নি!</h2>
          <button onClick={() => router.back()} className="mt-4 text-primary-600 font-bold">ফিরে যান</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-30 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Back Button */}
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-primary-600 mb-8 font-bold hover:bg-primary-50 p-2 rounded-xl transition-all"
        >
          <ArrowLeft size={20} /> ফিরে যান
        </button>

        <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-gray-100">
          {/* Cover Section */}
          <div className="relative h-48 bg-gradient-to-r from-primary-600 to-primary-400">
            {teacher.coverImage && <img src={teacher.coverImage} className="w-full h-full object-cover opacity-40" alt="cover" />}
          </div>

          <div className="px-8 pb-12">
            {/* Profile Header */}
            <div className="relative -mt-24 flex flex-col md:flex-row items-end gap-6 mb-12">
              <div className="relative">
                <img 
                  src={teacher.image} 
                  className="w-48 h-48 rounded-[2.5rem] border-8 border-white shadow-2xl object-cover" 
                  alt={teacher.name} 
                />
              </div>
              <div className="flex-1 pb-4">
                <h1 className="text-4xl font-black text-gray-900 mb-2">{teacher.name}</h1>
                <p className="text-xl text-primary-600 font-bold">{teacher.designation}</p>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="md:col-span-2 space-y-10">
                {/* Bio Section */}
                <div>
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                    <BookOpen className="text-primary-600" /> পরিচিতি
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg italic">
                    {teacher.bio || "ব্যক্তিগত তথ্য এখনো যুক্ত করা হয়নি।"}
                  </p>
                </div>

                {/* Education Section */}
                {teacher.education && (
                  <div>
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                      <GraduationCap className="text-primary-600" /> শিক্ষাগত যোগ্যতা
                    </h3>
                    <div className="space-y-4">
                      {teacher.education.map((edu, i) => (
                        <div key={i} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition-all">
                          <p className="font-bold text-gray-900 text-lg">{edu.degree}</p>
                          <p className="text-gray-600">{edu.institution} • {edu.year}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Stats */}
              <div className="space-y-6">
                <div className="p-6 bg-primary-50 rounded-[2rem] border border-primary-100">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-2xl shadow-sm"><Award className="text-primary-600" /></div>
                      <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">অভিজ্ঞতা</p>
                        <p className="text-lg font-bold text-gray-900">{teacher.experience || "১০+"} বছর</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-2xl shadow-sm"><Mail className="text-primary-600" /></div>
                      <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">ইমেইল</p>
                        <p className="text-[13px] font-bold text-gray-900 leading-tight">{teacher.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-2xl shadow-sm"><Phone className="text-primary-600" /></div>
                      <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">ফোন</p>
                        <p className="text-sm font-bold text-gray-900">{teacher.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetails;