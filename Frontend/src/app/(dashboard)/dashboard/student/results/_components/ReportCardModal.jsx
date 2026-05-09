import { BarChart2, CheckCircle2, X, XCircle } from "lucide-react";

const GRADE_BG = {
  "A+": "bg-emerald-50 border-emerald-200 text-emerald-700",
  A: "bg-emerald-50 border-emerald-200 text-emerald-600",
  "A-": "bg-teal-50 border-teal-200 text-teal-700",
  B: "bg-blue-50 border-blue-200 text-blue-700",
  C: "bg-amber-50 border-amber-200 text-amber-700",
  D: "bg-orange-50 border-orange-200 text-orange-600",
  F: "bg-red-50 border-red-200 text-red-600",
};
const GRADE_BAR = {
  "A+": "bg-emerald-500",
  A: "bg-emerald-400",
  "A-": "bg-teal-400",
  B: "bg-blue-400",
  C: "bg-amber-400",
  D: "bg-orange-400",
  F: "bg-red-400",
};
const ReportCardModal = ({ result, examName, onClose }) => {
  // console.log(result);
  if (!result) return null;

  const marks = result.subjectResults || [];

  const summary = result.overallResult || {};

  const gpa = summary.averageGPA ?? "—";
  const grade = summary.overallGrade ?? "—";

  // calculate total & obtained from subjects
  const total = marks.reduce((sum, m) => sum + (m.totalMarks || 0), 0);
  const obtained = marks.reduce((sum, m) => sum + (m.marksObtained || 0), 0);

  const gradeStyle = GRADE_BG[grade] || "bg-gray-50 border-gray-200 text-gray-600"; 
  const barColor = GRADE_BAR[grade] || "bg-violet-400"; 
  const pct = (total && obtained) ? Math.round((obtained / total) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">

        {/* header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between gap-4 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{result.exam?.name || examName}</h2>
            <p className="text-xs text-gray-400 mt-0.5">বিষয়ভিত্তিক ফলাফলের বিবরণ</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400 shrink-0">
            <X size={18} />
          </button>
        </div>

        {/* summary row */}
        <div className="px-6 py-4 bg-gray-50/60 border-b border-gray-100 shrink-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">মোট নম্বর</p>
              <p className="text-xl font-bold text-gray-800">{total}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">প্রাপ্ত নম্বর</p>
              <p className="text-xl font-bold text-violet-600">{obtained}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">শতাংশ</p>
              <p className="text-xl font-bold text-gray-800">{pct}%</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">গ্রেড / GPA</p>
              <span className={`inline-block text-sm font-bold px-2.5 py-0.5 rounded-full border ${gradeStyle}`}>
                {grade} ({gpa})
              </span>
            </div>
          </div>
          {/* overall bar */}
          <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* subject rows */}
        <div className="overflow-y-auto flex-1 px-6 py-4">
          {marks.length === 0 ? (
            <div className="h-40 flex flex-col items-center justify-center text-gray-400 gap-2">
              <BarChart2 size={28} className="text-gray-200" />
              <p className="text-sm">বিষয়ভিত্তিক তথ্য পাওয়া যায়নি</p>
            </div>
          ) : (
            <div className="space-y-3">
              {marks.map((m, i) => {
                const subjectName = m.subject || `বিষয় ${i + 1}`;
                const subjectGrade = m.grade || "—";
                const subjectGPA = m.gpa ?? "—";
                const subjectTotal = m.totalMarks ?? "—";
                const subjectObtain = m.marksObtained ?? "—";
                const subjectPct = m.percentage ?? 0;
                const isPassed = subjectObtain >= m.passingMarks;
                // const subjectPct = (subjectTotal && subjectObtain) ? Math.round((subjectObtain / subjectTotal) * 100) : 0;
                // const isPassed = m.isPassed ?? (subjectGrade !== "F");
                const sgStyle = GRADE_BG[subjectGrade] || "bg-gray-50 border-gray-200 text-gray-600";
                const sBarColor = GRADE_BAR[subjectGrade] || "bg-gray-300";

                return (
                  <div key={m.id ?? i} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100/60 transition-colors">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {isPassed
                          ? <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                          : <XCircle size={15} className="text-red-500 shrink-0" />
                        }
                        <p className="text-sm font-semibold text-gray-800 truncate">{subjectName}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-gray-500 font-mono">
                          {subjectObtain}/{subjectTotal}
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${sgStyle}`}>
                          {subjectGrade}
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full ${sBarColor} rounded-full transition-all`} style={{ width: `${subjectPct}%` }} />
                    </div>
                    <div className="flex items-center justify-between mt-1.5 text-xs text-gray-400">
                      <span>{subjectPct}%</span>
                      {subjectGPA !== "—" && <span>GPA: {subjectGPA}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReportCardModal;