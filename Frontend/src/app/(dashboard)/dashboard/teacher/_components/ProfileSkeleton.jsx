import React from 'react';

const ProfileSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
    {/* Header skeleton */}
    <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-2xl bg-gray-100 shrink-0" />
        <div className="space-y-3 flex-1">
          <div className="h-6 bg-gray-100 rounded-lg w-48" />
          <div className="h-4 bg-gray-100 rounded-lg w-32" />
          <div className="h-4 bg-gray-100 rounded-lg w-40" />
        </div>
      </div>
    </div>
    {/* Cards skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="h-4 bg-gray-100 rounded-lg w-32" />
          {[1, 2, 3].map((j) => (
            <div key={j} className="h-4 bg-gray-50 rounded-lg w-full" />
          ))}
        </div>
      ))}
    </div>
  </div>
  );
};

export default ProfileSkeleton;