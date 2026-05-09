import React from 'react';

const Skeletoncard = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 bg-gray-100 rounded-xl" />
        <div className="w-16 h-6 bg-gray-100 rounded-lg" />
      </div>
      <div className="space-y-2">
        <div className="h-5 bg-gray-100 rounded-lg w-3/4" />
        <div className="h-3 bg-gray-50 rounded-lg w-1/2" />
      </div>
      <div className="flex gap-2 pt-2 border-t border-gray-50">
        <div className="h-8 bg-gray-100 rounded-xl flex-1" />
        <div className="h-8 bg-gray-100 rounded-xl flex-1" />
      </div>
    </div>
  );
};

export default Skeletoncard;