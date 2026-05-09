"use client";
import axiosInstance from '@/src/lib/axiosInstance';
import React, { useEffect, useState } from 'react';
import AssignedSubjectsCard from './_components/AssignedSubjectsCard';
import { BookMarked } from 'lucide-react';

const Page = () => {

  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get("/teachers/me");
        setProfile(res.data?.data);
      } catch {
        setError("প্রোফাইল লোড করতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);
  // console.log(profile);

  
  return (
    <div>
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
        <BookMarked size={26} className="text-violet-600" />
        <h1 className="text-2xl font-bold text-gray-700">নির্ধারিত বিষয়সমূহ</h1>
      </div>
      <AssignedSubjectsCard assignedSubjects={profile?.assignedSubjects} />
    </div>
  );
};

export default Page;