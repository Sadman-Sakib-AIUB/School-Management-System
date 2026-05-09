import React from "react";

const SectionCardView = ({ title, icon: Icon, colorClass, children }) => (
  <div className="bg-gray-50 rounded-2xl overflow-hidden">
    <div className={`flex items-center gap-2 px-4 py-3 ${colorClass}`}>
      <Icon size={14} /><h3 className="text-xs font-bold uppercase tracking-wider">{title}</h3>
    </div>
    <div className="px-4 pb-2">{children}</div>
  </div>
);

export default SectionCardView;