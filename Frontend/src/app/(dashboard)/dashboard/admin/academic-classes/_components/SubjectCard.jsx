import { BookMarked, User, UserPlus } from "lucide-react";

export const CATEGORIES = [
  { value: "MATHEMATICS", label: "গণিত" },
  { value: "SCIENCE", label: "বিজ্ঞান" },
  { value: "LANGUAGES", label: "ভাষা" },
  { value: "SOCIAL", label: "সামাজিক বিজ্ঞান" },
  { value: "RELIGIOUS", label: "ধর্ম শিক্ষা" },
  { value: "ARTS", label: "শিল্পকলা" },
  { value: "PHYSICAL", label: "শারীরিক শিক্ষা" },
  { value: "VOCATIONAL", label: "বৃত্তিমূলক" },
  { value: "OTHER", label: "অন্যান্য" },
];

const CATEGORY_COLORS = {
  MATHEMATICS: "bg-blue-100 text-blue-700",
  SCIENCE: "bg-emerald-100 text-emerald-700",
  LANGUAGES: "bg-violet-100 text-violet-700",
  SOCIAL: "bg-amber-100 text-amber-700",
  RELIGIOUS: "bg-rose-100 text-rose-700",
  ARTS: "bg-pink-100 text-pink-700",
  PHYSICAL: "bg-cyan-100 text-cyan-700",
  VOCATIONAL: "bg-orange-100 text-orange-700",
  OTHER: "bg-gray-100 text-gray-600",
};

const SubjectCard = ({ item, onAssignTeacher }) => {
  const catClss = CATEGORY_COLORS[item.subject?.category] ?? "bg-gray-100 text-gray-600";
  const catLabel = CATEGORIES.find(c => c.value === item.subject?.category)?.label ?? item.subject?.category;
  const hasTeacher = !!item.teacher;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center shrink-0">
            <BookMarked size={16} className="text-violet-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-800 text-sm">{item.subject?.name}</p>
            <p className="text-xs text-gray-400 mt-0.5 font-mono">{item.subject?.code}</p>
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${catClss}`}>
                {catLabel}
              </span>
              {item.isCompulsory && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-600">
                  আবশ্যিক
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs text-gray-400">মোট নম্বর</p>
          <p className="text-lg font-bold text-gray-800">{item.totalMarks}</p>
          <p className="text-xs text-gray-400">পাস: {item.passingMarks}</p>
        </div>
      </div>

      {/* Teacher row */}
      <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
        {hasTeacher ? (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center">
              <User size={12} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700">{item.teacher.fullNameEnglish}</p>
              <p className="text-xs text-gray-400">{item.teacher.teacherCode}</p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic">শিক্ষক নির্ধারিত হয়নি</p>
        )}
        <button
          onClick={() => onAssignTeacher(item)}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${hasTeacher
              ? "border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
              : "border border-violet-200 text-violet-700 bg-violet-50 hover:bg-violet-100"
            }`}
        >
          {hasTeacher ? <><User size={11} /> শিক্ষক পরিবর্তন</> : <><UserPlus size={11} /> শিক্ষক যোগ</>}
        </button>
      </div>
    </div>
  );
}


export default SubjectCard;