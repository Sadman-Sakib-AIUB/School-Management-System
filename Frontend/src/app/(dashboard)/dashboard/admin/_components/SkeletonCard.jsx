import React from 'react';

const SkeletonCard = () => {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm h-28 animate-pulse`}>
    <div className="p-5 space-y-3">
      <div className="flex justify-between">
        <div className="w-10 h-10 bg-gray-100 rounded-xl" />
        <div className="w-16 h-5 bg-gray-100 rounded-lg" />
      </div>
      <div className="w-20 h-7 bg-gray-100 rounded-lg" />
      <div className="w-32 h-3 bg-gray-50 rounded" />
    </div>
  </div>
  );
};

export default SkeletonCard;