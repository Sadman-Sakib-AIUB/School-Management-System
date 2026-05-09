import React from 'react';

const SectionCard = ({ title, icon: Icon, color, children }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className={`flex items-center gap-2.5 px-6 py-4 border-b border-gray-50 ${color}`}>
        <Icon size={17} />
        <h3 className="text-sm font-bold uppercase tracking-wider">{title}</h3>
      </div>
      <div className="px-6">{children}</div>
    </div>
  );
};

export default SectionCard;