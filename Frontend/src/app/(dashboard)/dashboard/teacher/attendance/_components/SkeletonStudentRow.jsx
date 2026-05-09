import React from 'react';

const SkeletonStudentRow = () => {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 animate-pulse">
      <div className="w-10 h-10 bg-gray-100 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-100 rounded w-40" />
        <div className="h-3 bg-gray-50 rounded w-24" />
      </div>
      <div className="flex gap-2">
        {[1, 2, 3, 4].map(i => <div key={i} className="w-20 h-9 bg-gray-100 rounded-xl" />)}
      </div>
    </div>
  );
};

export default SkeletonStudentRow;