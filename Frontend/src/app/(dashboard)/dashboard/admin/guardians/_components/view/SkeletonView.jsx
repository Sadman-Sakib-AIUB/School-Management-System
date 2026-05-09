import React from 'react';

const SkeletonView = () => {
  return (
    <div className="animate-pulse p-6 space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl" />
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-gray-100 rounded w-40" />
          <div className="h-3 bg-gray-100 rounded w-28" />
        </div>
      </div>
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-gray-50 rounded-2xl p-4 space-y-2">
          <div className="h-3 bg-gray-100 rounded w-20" />
          {[1, 2, 3].map(j => <div key={j} className="h-3 bg-gray-100 rounded w-full" />)}
        </div>
      ))}
    </div>
  );
};

export default SkeletonView;