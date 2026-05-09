"use client";
import { X, Calendar, BookOpen, Hash, Clock, CheckCircle2, AlertCircle, BookMarked } from "lucide-react";
import { EXAM_TYPE_BN, fmtDate } from "../page";


// const CATEGORY_COLORS = {
//   MATHEMATICS: "bg-blue-100 text-blue-700",
//   SCIENCE: "bg-emerald-100 text-emerald-700",
//   LANGUAGES: "bg-violet-100 text-violet-700",
//   SOCIAL: "bg-amber-100 text-amber-700",
//   RELIGIOUS: "bg-rose-100 text-rose-700",
//   ARTS: "bg-pink-100 text-pink-700",
//   PHYSICAL: "bg-cyan-100 text-cyan-700",
//   OTHER: "bg-gray-100 text-gray-600",
// };



const fmtWeekday = (iso) => iso
  ? new Date(iso).toLocaleDateString("bn-BD", { weekday: "long" })
  : "";

export default function ViewExamModal({ isOpen, onClose, exam }) {
  if (!isOpen || !exam) return null;
  console.log(exam);

  const today = new Date();
  const start = new Date(exam.startDate);
  const end = new Date(exam.endDate);

  const status =
    today < start ? "UPCOMING" :
      today > end ? "COMPLETED" : "ONGOING";

  const statusConfig = {
    UPCOMING: { label: "আসন্ন", cls: "bg-blue-100 text-blue-700", icon: Clock },
    ONGOING: { label: "চলমান", cls: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
    COMPLETED: { label: "সম্পন্ন", cls: "bg-gray-100 text-gray-600", icon: CheckCircle2 },
  }[status];

  const StatusIcon = statusConfig.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 bg-lin-to-r from-violet-50 to-white shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${statusConfig.cls}`}>
                  <StatusIcon size={11} /> {statusConfig.label}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-100 text-violet-700">
                  {EXAM_TYPE_BN[exam.type] ?? exam.type}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                  {exam.academicYear}
                </span>
              </div>
              <h2 className="text-lg font-bold text-gray-900">{exam.name}</h2>
              <p className="text-sm text-gray-400 mt-0.5">
                {exam.section?.class?.name} — সেকশন {exam.section?.name}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 shrink-0">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Date range */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-50 rounded-2xl p-4">
              <p className="text-xs text-emerald-600 font-medium mb-1">শুরুর তারিখ</p>
              <p className="text-sm font-bold text-gray-800">{fmtDate(exam.startDate)}</p>
            </div>
            <div className="bg-rose-50 rounded-2xl p-4">
              <p className="text-xs text-red-600 font-medium mb-1">শেষের তারিখ</p>
              <p className="text-sm font-bold text-gray-800">{fmtDate(exam.endDate)}</p>
            </div>
          </div>

          {/* Subjects */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              বিষয় সমূহ ({exam.examSubjects?.length ?? 0}টি)
            </p>
            <div className="space-y-2">
              {exam.examSubjects?.map((es, i) => {

                return (
                  
                  <div key={es.id} className="group flex items-center gap-3 py-2 px-3 bg-white border-b border-gray-100 hover:bg-violet-50/50 transition-colors">
                    {/* Smaller, lighter Index Badge */}
                    <div className="w-6 h-6 bg-gray-100 group-hover:bg-violet-100 group-hover:text-violet-700 rounded-md flex items-center justify-center text-gray-500 font-bold text-[10px] shrink-0 transition-colors">
                      {i + 1}
                    </div>

                    {/* Main Info: One-line layout */}
                    <div className="flex-1 min-w-0 flex items-center gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{es.subject?.name}</p>
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-50 text-gray-400 border border-gray-100 shrink-0">
                          {es.subject?.code}
                        </span>
                      </div>

                      {/* Date Info: Moved to the middle to keep height low */}
                      <div className=" sm:flex items-center gap-1.5 text-[11px] text-gray-400 whitespace-nowrap ml-auto">
                        <span className="font-medium text-violet-600">{fmtWeekday(es.examDate)}</span>
                        <span>•</span>
                        <span>{fmtDate(es.examDate)}</span>
                      </div>

                    </div>

                    {/* Marks: Side-by-side for zero vertical bulk */}
                    <div className="hidden sm:flex items-center gap-3 shrink-0 ml-4 border-l border-gray-200 pl-4">
                      <div className="text-right">
                        <p className="text-[9px] uppercase tracking-wider text-gray-400 leading-none mb-1 font-bold">Marks</p>
                        <p className="text-sm font-black text-gray-800 leading-none">{es.totalMarks}</p>
                      </div>

                      <div className="h-6 w-[1px] bg-gray-100" />

                      <div className="text-right">
                        <p className="text-[9px] uppercase tracking-wider text-gray-400 leading-none mb-1 font-bold">Pass</p>
                        <p className="text-sm font-bold text-emerald-600 leading-none">{es.passingMarks}</p>
                      </div>
                    </div>

                  </div>

                );
              })}
            </div>
          </div>

          {/* Meta */}
          <div className="text-xs text-gray-400 text-right">
            তৈরি: {fmtDate(exam.createdAt)}
          </div>
        </div>

        <div className="flex justify-end px-6 py-4 border-t border-gray-100 shrink-0">
          <button onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
}