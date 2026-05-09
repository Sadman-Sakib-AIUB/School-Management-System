import { BookMarked, BookOpen, Calendar, Pencil, Trash2, Users } from 'lucide-react';
import React from 'react';

const CLASS_COLORS = [
  { bg: "bg-blue-50", icon: "bg-blue-100 text-blue-600", badge: "bg-blue-100 text-blue-700", border: "border-blue-100" },
  { bg: "bg-violet-50", icon: "bg-violet-100 text-violet-600", badge: "bg-violet-100 text-violet-700", border: "border-violet-100" },
  { bg: "bg-emerald-50", icon: "bg-emerald-100 text-emerald-600", badge: "bg-emerald-100 text-emerald-700", border: "border-emerald-100" },
  { bg: "bg-amber-50", icon: "bg-amber-100 text-amber-600", badge: "bg-amber-100 text-amber-700", border: "border-amber-100" },
  { bg: "bg-rose-50", icon: "bg-rose-100 text-rose-600", badge: "bg-rose-100 text-rose-700", border: "border-rose-100" },
  { bg: "bg-gray-50", icon: "bg-gray-100 text-gray-600", badge: "bg-gray-100 text-gray-700", border: "border-gray-100" },
];

const ClassCard = ({ cls, index, onEdit, onDelete, onViewSubjects }) => {

  const color = CLASS_COLORS[index % CLASS_COLORS.length];
  const sectionCount = cls._count?.sections ?? 0;


  return (
    <div className={`bg-white rounded-2xl border ${color.border} shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden`}>
      {/* Card top accent */}
      <div className={`h-1.5 ${color.icon.split(" ")[0].replace("100", "400")}`} />

      <div className="p-5 flex flex-col flex-1">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color.icon}`}>
            <BookOpen size={20} />
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${color.badge}`}>
            <Calendar size={11} />
            {cls.academicYear}
          </span>
        </div>

        {/* Class name */}
        <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">{cls.name}</h3>
        <p className="text-xs text-gray-400 mb-4">{cls.institution?.name}</p>

        {/* Section count */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${color.bg} mb-4`}>
          <Users size={14} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-600">
            {sectionCount} টি সেকশন
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-3 border-t border-gray-50">
          <button
            onClick={() => onEdit(cls)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
          >
            <Pencil size={13} /> আপডেট
          </button>
          <button
            onClick={() => onDelete(cls)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
          >
            <Trash2 size={13} /> ডিলিট
          </button>
        </div>
        <div className="py-2">
          <button
            onClick={() => onViewSubjects(cls)}
            className=" w-full flex items-center justify-center gap-1.5 flex-1 px-2 py-2 text-xs font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 rounded-xl transition-colors border border-violet-100"
          >
            <BookMarked size={13} /> বিষয় দেখুন
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassCard;