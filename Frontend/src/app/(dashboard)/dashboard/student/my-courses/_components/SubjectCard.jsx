import { ChevronDown, ChevronUp, Hash } from "lucide-react";
import { useState } from "react";
import { CATEGORY_BN, GRADE_BG } from "../page";
import ExamRow from "./ExamCard";

const SubjectCard = ({ subject, examRows, results }) => {
  const [expanded, setExpanded] = useState(false);

  const subjectResults = examRows.map((er) => results[`${er.examId}_${subject.id}`]).filter(Boolean);
  const avgPct = subjectResults.length
    ? Math.round(subjectResults.reduce((a, b) => a + (b.percentage || 0), 0) / subjectResults.length)
    : null;
  const bestGrade = subjectResults.length
    ? subjectResults.sort((a, b) =>
      ["A+", "A", "A-", "B", "C", "D", "F"].indexOf(a.grade) - ["A+", "A", "A-", "B", "C", "D", "F"].indexOf(b.grade)
    )[0]?.grade
    : null;

  // icon letter from subject name
  const letter = (subject.name || "?")[0];

  return (
    <div className="mb-4">
      <div
        className={`group relative bg-white rounded-2xl border transition-all duration-300 ${expanded
            ? 'border-violet-200 shadow-lg shadow-violet-100/50 ring-1 ring-violet-50'
            : 'border-gray-100 shadow-sm hover:border-violet-200 hover:shadow-md'
          }`}
      >
        {/* Header Section */}
        <div
          className="p-4 sm:p-5 flex items-center gap-4 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          {/* 1. Dynamic Subject Badge */}
          <div className={`relative w-12 h-12 flex items-center justify-center rounded-xl font-black text-lg transition-all duration-300 ${expanded ? 'bg-violet-600 text-white rotate-3 shadow-lg shadow-violet-200' : 'bg-gray-50 text-gray-400 group-hover:bg-violet-50 group-hover:text-violet-500'
            }`}>
            {letter}
          </div>

          {/* 2. Primary Subject Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-[16px] font-bold text-gray-900 truncate">
                {subject.name}
              </h3>
              <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border transition-colors ${expanded ? 'bg-violet-50 border-violet-100 text-violet-600' : 'bg-gray-50 border-gray-100 text-gray-400'
                }`}>
                {subject.code}
              </span>
            </div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-tighter">
              {CATEGORY_BN[subject.category] || subject.category}
            </p>
          </div>

          {/* 3. Visual Stats (The "Eye-Catchy" Part) */}
          <div className="flex items-center gap-3">
            {/* Quick Progress Badge */}
            <div className="hidden xs:flex flex-col items-center px-3 py-1 bg-gray-50 rounded-lg border border-gray-100 group-hover:bg-white transition-colors">
              <span className="text-[10px] font-bold text-gray-400 leading-none mb-1">পরীক্ষা</span>
              <span className="text-xs font-black text-gray-900 leading-none">{examRows.length}</span>
            </div>

            {/* Grade Spotlight */}
            
            {bestGrade && (
              <div className={`w-10 h-10 flex flex-col items-center justify-center rounded-full border-2 font-black text-sm transition-all ${expanded
                  ? (GRADE_BG[bestGrade] )
                  : (GRADE_BG[bestGrade] )
                }`}>
                <span className="leading-none">{bestGrade}</span>
              </div>
            )}

          {/* Interaction Indicator */}
          <div className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${expanded ? 'bg-violet-50 text-violet-600' : 'bg-gray-50 text-gray-300'
            }`}>
            {expanded ? <ChevronUp size={18} strokeWidth={3} /> : <ChevronDown size={18} strokeWidth={3} />}
          </div>
        </div>
      </div>

      {/* Expanded View: The "Sheet" Look */}
      {expanded && (
        <div className="px-5 pb-5 animate-in slide-in-from-top-3 duration-300">
          <div className="p-1 bg-gray-50/50 border border-gray-100 rounded-xl space-y-1">
            {examRows.length === 0 ? (
              <div className="py-10 text-center flex flex-col items-center">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-2">
                  <Hash size={18} />
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No Records Yet</p>
              </div>
            ) : (
              examRows.map((er, idx) => (
                <div
                  key={er.examSubjectId}
                  className="bg-white p-1 rounded-lg border border-transparent hover:border-violet-100 hover:shadow-sm transition-all"
                >
                  <ExamRow
                    examSubject={er}
                    result={results[`${er.examId}_${subject.id}`] || null}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
</div >
  );
}

export default SubjectCard;