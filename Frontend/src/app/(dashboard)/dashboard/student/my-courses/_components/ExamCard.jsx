import { CheckCircle2, Clock, User, XCircle } from "lucide-react";
import { EXAM_TYPE_BN, GRADE_BAR, GRADE_BG } from "../page";

const ExamRow = ({ examSubject, result }) => {
  const hasMarks = !!result;
  const pct = hasMarks ? result.percentage : null;
  const barColor = hasMarks ? (GRADE_BAR[result.grade] || "bg-gray-300") : null;
  const gradeStyle = hasMarks ? (GRADE_BG[result.grade] || "bg-gray-50 border-gray-200 text-gray-600") : null;

  const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" }) : "—";

  return (
    <div className="flex flex-col gap-2 p-3 rounded-xl bg-gray-50 hover:bg-gray-100/60 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-800 truncate">{examSubject.examName}</span>
            <span className="text-xs font-semibold px-2 py-0.5 bg-white border border-gray-200 text-gray-500 rounded-full shrink-0">
              {EXAM_TYPE_BN[examSubject.examType] || examSubject.examType}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="text-xs text-gray-400">
              <Clock size={10} className="inline mr-1" />
              {formatDate(examSubject.examDate)}
            </span>
            <span className="text-xs text-gray-400">
              পূর্ণমান: {examSubject.totalMarks} · পাস: {examSubject.passingMarks}
            </span>
            {hasMarks && result.enteredBy?.username && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <User size={10} />
                {result.enteredBy.username}
              </span>
            )}
          </div>
        </div>

        {/* marks / status */}
        <div className="shrink-0 flex flex-col items-end gap-1">
          {hasMarks ? (
            <>
              <div className="flex items-center gap-1.5">
                {result.grade !== "F"
                  ? <CheckCircle2 size={13} className="text-emerald-500" />
                  : <XCircle size={13} className="text-red-500" />
                }
                <span className="text-sm font-bold text-gray-800 font-mono">
                  {result.marksObtained}/{result.totalMarks}
                </span>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${gradeStyle}`}>
                {result.grade} · {result.gpa}
              </span>
            </>
          ) : (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full border border-gray-200 bg-white text-gray-400">
              নম্বর নেই
            </span>
          )}
        </div>
      </div>

      {/* progress bar */}
      {hasMarks && (
        <div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-400">
            <span>{result.remarks || ""}</span>
            <span>{pct}%</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExamRow;