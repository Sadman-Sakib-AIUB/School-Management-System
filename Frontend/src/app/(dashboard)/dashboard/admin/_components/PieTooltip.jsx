import React from 'react';

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 shadow-xl rounded-xl px-4 py-3">
      <p className="text-sm font-bold" style={{ color: payload[0].payload.color }}>{payload[0].name}</p>
      <p className="text-xs text-gray-500">{payload[0].value} টি সেকশন</p>
    </div>
  );
};

export default PieTooltip;