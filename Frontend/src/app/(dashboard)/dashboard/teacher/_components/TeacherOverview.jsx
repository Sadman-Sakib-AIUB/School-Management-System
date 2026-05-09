"use client"
import { selectActiveRole, selectCurrentUser } from '@/src/store/slices/authSlice';
import React from 'react';
import { useSelector } from 'react-redux';

const TeacherOverview = () => {

  const user = useSelector(selectCurrentUser);
  const activeRole = useSelector(selectActiveRole);

  return (
    <div className="space-y-6">
      <header className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              স্বাগতম, {user?.username || "প্রধান শিক্ষক"} 👋
            </h1>
            <p className="text-gray-500">প্রতিষ্ঠানের সামগ্রিক পরিস্থিতি একনজরে</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-violet-100 text-violet-700 rounded-xl text-sm font-semibold">
            {/* <TrendingUp size={16} /> */}
            {activeRole}
          </div>
        </div>
      </header>
      <main>
        main stats wil be here...
      </main>
    </div>
  );
};

export default TeacherOverview;