import React from "react";
const InfoRowView = ({ icon: Icon, label, value, accent = "text-gray-400" }) => (
  <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
    <div className={`mt-0.5 shrink-0 ${accent}`}><Icon size={14} /></div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-800 wrap-break-words">{value || "—"}</p>
    </div>
  </div>
);

export default InfoRowView;