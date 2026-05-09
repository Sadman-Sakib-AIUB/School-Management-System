import React from 'react';

const SkeletonRow = () => {
  return (
    <tr>
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <td key={i} className="px-5 py-4">
        <div className="h-4 bg-gray-100 rounded-lg animate-pulse" />
      </td>
    ))}
  </tr>
  );
};

export default SkeletonRow;