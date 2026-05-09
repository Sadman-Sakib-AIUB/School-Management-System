"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Users, Loader2, AlertCircle, Edit3, Eye,
  BarChart2
} from "lucide-react";

import axiosInstance from "@/src/lib/axiosInstance";
import ReportCardModal from "../_components/ReportCardModal";
import BulkResultEntry from "../_components/BulkResultEntry";
import SectionSummaryModal from "../_components/Sectionsummarymodal";

// const EXAM_TYPE_BN = {
//   MIDTERM: "মিডটার্ম", 
//   FINAL: "ফাইনাল", 
//   CLASS_TEST: "ক্লাস টেস্ট",
//   WEEKLY_TEST: "সাপ্তাহিক টেস্ট",
// };

// const CATEGORY_COLORS = {
//   MATHEMATICS: "bg-blue-100 text-blue-700", 
//   SCIENCE: "bg-emerald-100 text-emerald-700",
//   LANGUAGES: "bg-violet-100 text-violet-700", 
//   SOCIAL: "bg-amber-100 text-amber-700",
//   RELIGIOUS: "bg-rose-100 text-rose-700", 
//   OTHER: "bg-gray-100 text-gray-600",
// };

// const GRADE_COLORS = {
//   "A+": "text-emerald-600 bg-emerald-50 border-emerald-200",
//   "A": "text-emerald-600 bg-emerald-50 border-emerald-200",
//   "A-": "text-teal-600 bg-teal-50 border-teal-200",
//   "B": "text-blue-600 bg-blue-50 border-blue-200",
//   "C": "text-amber-600 bg-amber-50 border-amber-200",
//   "D": "text-orange-600 bg-orange-50 border-orange-200",
//   "F": "text-red-600 bg-red-50 border-red-200",
// };

// const fmtDate = (iso) => iso
//   ? new Date(iso).toLocaleDateString("bn-BD", { month: "long", day: "numeric" })
//   : "—";

// const ExamResultPage = () => {
//   const { examId } = useParams();
//   // console.log(examId);
//   const router = useRouter();

//   const [exam, setExam] = useState(null);
//   const [examLoading, setExamLoading] = useState(true);
//   const [selectedSubject, setSelectedSubject] = useState(null); // examSubject object
//   const [students, setStudents] = useState([]);
//   const [results, setResults] = useState({});   // studentId -> result
//   const [studentsLoading, setStudentsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Modal state
//   const [bulkEntryOpen, setBulkEntryOpen] = useState(false);
//   const [reportStudent, setReportStudent] = useState(null); // { studentId, studentName }

//   // ----------- Load exam ------------
//   useEffect(() => {
//     axiosInstance.get("/results/exams", { params: { limit: 200 } })
//       .then(res => {
//         const found = (res.data?.data ?? []).find(e => e.id === examId);
//         // console.log(res.data.data);
//         setExam(found ?? null);
//         if (found?.examSubjects?.length > 0) 
//           {
//             setSelectedSubject(found.examSubjects[0]);
//           }

//       })
//       .catch(() => setError("পরীক্ষার তথ্য লোড করতে ব্যর্থ হয়েছে।"))
//       .finally(() => setExamLoading(false));
//   }, [examId]);

//   // ----------- Load students + existing results when subject changes -------------
//   const loadStudentsAndResults = useCallback(async () => {
//     if (!exam?.sectionId || !selectedSubject) return;
//     setStudentsLoading(true);
//     try {
//       // Get enrolled students in this section
//       const studRes = await axiosInstance.get("/students", {
//         params: { limit: 200 },
//       });
//       const allStudents = studRes.data?.data ?? [];
//       const sectionStudents = allStudents.filter(s =>
//         s.currentEnrollment?.section?.id === exam.sectionId ||
//         s.currentEnrollment?.sectionId === exam.sectionId
//       );
//       setStudents(sectionStudents);

//       // Get existing results for this examSubject
//       try {
//         const resRes = await axiosInstance.get("/results", {
//           params: { examSubjectId: selectedSubject.id, limit: 200 },
//         });
//         const resData = resRes.data?.data ?? [];
//         const map = {};
//         resData.forEach(r => { map[r.student?.id ?? r.studentId] = r; });
//         setResults(map);
//       }
//        catch (err) {
//         console.log("Error Fetching Results:", err);
//         setResults({});
//       }
//     }
//      catch {
//       setError("শিক্ষার্থীদের তথ্য লোড করতে ব্যর্থ হয়েছে।");
//     } finally {
//       setStudentsLoading(false);
//     }
//   }, [exam?.sectionId, selectedSubject]);

//   useEffect(() => { loadStudentsAndResults(); }, [loadStudentsAndResults]);

//   // ------ Refresh after bulk entry --------
//   const handleBulkSuccess = () => {
//     setBulkEntryOpen(false);
//     loadStudentsAndResults();
//   };

//   if (examLoading) 
//     return (
//     <div className="flex items-center justify-center py-32">
//       <Loader2 size={28} className="text-violet-400 animate-spin" />
//     </div>
//   );

//   if (!exam) 
//     return (
//     <div className="flex flex-col items-center py-24 text-center">
//       <AlertCircle size={28} className="text-red-400 mb-3" />
//       <p className="font-semibold text-gray-600">পরীক্ষা পাওয়া যায়নি।</p>
//       <button onClick={() => router.push("/dashboard/admin/results")}
//         className="mt-4 text-sm text-violet-600 hover:underline font-semibold">← ফিরে যান</button>
//     </div>
//   );

//   const markedCount = Object.keys(results).length;
//   const passCount = Object.values(results).filter(r => r.grade !== "F").length;

//   return (
//     <div className="space-y-5 pb-8">

//       {/* Header */}
//       <div className="flex items-start gap-3 flex-wrap">

//         <button onClick={() => router.push("/dashboard/admin/results")}
//           className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500 mt-0.5 shrink-0">
//           <ArrowLeft size={18} />
//         </button>

//         <div className="flex-1 min-w-0">
//           <h2 className="text-xl font-bold text-gray-900">{exam.name}</h2>
//           <div className="flex flex-wrap items-center gap-2 mt-1">
//             <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-100 text-violet-700">
//               {EXAM_TYPE_BN[exam.type] ?? exam.type}
//             </span>
//             <span className="text-xs text-black-400">
//               {exam.section?.class?.name} - সেকশন: <span className=" font-semibold">{exam.section?.name}</span>
//             </span>
//             <span className="text-xs text-gray-400">({exam.academicYear})</span>
//           </div>
//         </div>
//       </div>

//       {/* Subject tabs */}
//       <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
//         <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">বিষয় নির্বাচন করুন</p>
//         <div className="flex flex-wrap gap-2">
//           {exam.examSubjects?.map(es => {
//             const active = selectedSubject?.id === es.id;
//             const catCls = CATEGORY_COLORS[es.subject?.category] ?? "bg-gray-100 text-gray-600";
//             // console.log(es.subject);
//             return (
//               <button key={es.id} onClick={() => setSelectedSubject(es)}
//                 className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${active
//                     ? "border-violet-500 bg-violet-50 text-violet-700 shadow-sm"
//                     : "border-gray-100 bg-white text-gray-600"
//                   }`}
//               >
//                 <span className={`text-xs px-2.5 py-0.5 rounded-md font-bold ${catCls}`}>
//                   {es.subject?.code}
//                 </span>
//                 {es.subject?.name}
//                 <span className="text-xs opacity-60">({fmtDate(es.examDate)})</span>
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* Selected subject info + action */}
//       {selectedSubject && (
//         <div className="flex items-center justify-between flex-wrap gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
//           <div className="flex items-center gap-4 flex-wrap">
//             <div>
//               <p className="text-xs text-gray-400">বিষয়</p>
//               <p className="text-sm font-bold text-gray-800">{selectedSubject.subject?.name}</p>
//             </div>

//             <div className="w-px h-8 bg-gray-100" />
//             <div>
//               <p className="text-xs text-gray-400">মোট নম্বর</p>
//               <p className="text-sm font-bold text-gray-800">{selectedSubject.totalMarks}</p>
//             </div>

//             <div>
//               <p className="text-xs text-gray-400">পাসের নম্বর</p>
//               <p className="text-sm font-bold text-gray-800">{selectedSubject.passingMarks}</p>
//             </div>

//             <div>
//               <p className="text-xs text-gray-400">নম্বর দেওয়া হয়েছে</p>
//               <p className="text-sm font-bold text-violet-700">{markedCount} / {students.length}</p>
//             </div>

//             {markedCount > 0 && (
//               <div>
//                 <p className="text-xs text-gray-400">পাস করেছে</p>
//                 <p className="text-sm font-bold text-emerald-600">{passCount} জন</p>
//               </div>
//             )}

//           </div>
//           <button
//             onClick={() => setBulkEntryOpen(true)}
//             disabled={studentsLoading}
//             className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-violet-600 rounded-xl hover:bg-violet-700 active:scale-95 shadow-lg shadow-violet-200 disabled:opacity-40"
//           >
//             <Edit3 size={15} />
//             {markedCount > 0 ? "ফলাফল আপডেট করুন" : "ফলাফল প্রদান করুন"}
//           </button>
//         </div>
//       )}


//       {/* Students table */}
//       {selectedSubject && (
//         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//           <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
//             <h3 className="font-bold text-gray-800">শিক্ষার্থী তালিকা</h3>
//             <p className="text-xs text-gray-400">{students.length} জন শিক্ষার্থী</p>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="bg-gray-50 border-b border-gray-100">
//                   {["রোল", "শিক্ষার্থী", "প্রাপ্ত নম্বর", "মোট", "গ্রেড", "GPA", "মন্তব্য", "একশন"].map((h, i) => (
//                     <th key={i} className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-50">
//                 {studentsLoading
//                   ? Array(5).fill(0).map((_, i) => (
//                     <tr key={i}>{Array(8).fill(0).map((__, j) => (
//                       <td key={j} className="px-5 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse w-16" /></td>
//                     ))}</tr>
//                   ))
//                   : students.length === 0
//                     ? (
//                       <tr><td colSpan={8} className="px-5 py-16 text-center">
//                         <div className="flex flex-col items-center gap-2">
//                           <Users size={24} className="text-gray-400" />
//                           <p className="text-sm text-gray-500">এই সেকশনে কোনো শিক্ষার্থী নেই।</p>
//                         </div>
//                       </td></tr>
//                     )
//                     : students.map(student => {
//                       const result = results[student.id];
//                       // console.log(result);
//                       const initials = student.fullNameEnglish?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) ?? "S";
//                       const gradeCls = result?.grade ? (GRADE_COLORS[result.grade] ?? "bg-gray-50 text-gray-600 border-gray-200") : "";

//                       return (
//                         <tr key={student.id} className={`hover:bg-gray-50/50 transition-colors ${result ? "" : "opacity-60"}`}>
//                           <td className="px-5 py-3.5">
//                             <span className="font-mono text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
//                               {student.currentEnrollment?.rollNumber ?? "—"}
//                             </span>
//                           </td>
//                           <td className="px-5 py-3.5">
//                             <div className="flex items-center gap-2.5">
//                               <div className="w-8 h-8 bg-violet-100 rounded-xl flex items-center justify-center text-violet-700 font-bold text-xs shrink-0">
//                                 {initials}
//                               </div>
//                               <div>
//                                 <p className="font-semibold text-gray-800 text-sm">{student.fullNameEnglish}</p>
//                                 <p className="text-xs text-gray-400">{student.studentCode}</p>
//                               </div>
//                             </div>
//                           </td>
//                           <td className="px-5 py-3.5">
//                             {result
//                               ? <span className="text-base font-bold text-gray-800">{result.marksObtained}</span>
//                               : <span className="text-xs text-gray-400 italic">দেওয়া হয়নি</span>
//                             }
//                           </td>
//                           <td className="px-5 py-3.5 text-sm text-gray-500">{selectedSubject.totalMarks}</td>
//                           <td className="px-5 py-3.5">
//                             {result?.grade && (
//                               <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${gradeCls}`}>
//                                 {result.grade}
//                               </span>
//                             )}
//                           </td>
//                           <td className="px-5 py-3.5 text-sm font-semibold text-gray-700">
//                             {result?.gpa ?? "—"}
//                           </td>
//                           <td className="px-5 py-3.5 text-xs text-gray-400 max-w-xs truncate">
//                             {result?.remarks ?? "—"}
//                           </td>
//                           <td className="px-5 py-3.5">
//                             <button
//                               onClick={() => setReportStudent({ studentId: student.id, studentName: student.fullNameEnglish })}
//                               className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
//                             >
//                               <Eye size={11} /> রিপোর্ট
//                             </button>
//                           </td>
//                         </tr>
//                       );
//                     })
//                 }
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* Modals */}
//       {bulkEntryOpen && selectedSubject && (
//         <BulkResultEntry
//           isOpen={bulkEntryOpen}
//           onClose={() => setBulkEntryOpen(false)}
//           onSuccess={handleBulkSuccess}
//           examSubject={selectedSubject}
//           students={students}
//           existingResults={results}
//         />
//       )}

//       <ReportCardModal
//         isOpen={!!reportStudent}
//         onClose={() => setReportStudent(null)}
//         studentId={reportStudent?.studentId}
//         studentName={reportStudent?.studentName}
//         examId={examId}
//         exam={exam}
//       />

//     </div>
//   );
// }


// export default ExamResultPage;

// "use client";
// import { useState, useEffect, useCallback } from "react";
// import { useParams, useRouter } from "next/navigation";
// import {
//   ArrowLeft, BookOpen, Users, Loader2, AlertCircle,
//   CheckCircle2, Edit3, Eye, ChevronDown, BarChart2,
// } from "lucide-react";
// import axiosInstance from "../../../../../lib/axiosInstance";
// import BulkResultEntry from "../_components/BulkResultEntry";
// import ReportCardModal from "../_components/ReportCardModal";
// import SectionSummaryModal from "../_components/SectionSummaryModal";



const EXAM_TYPE_BN = {
  MIDTERM: "মিডটার্ম", FINAL: "ফাইনাল", UNIT_TEST: "ইউনিট টেস্ট",
  MOCK: "মক", QUARTERLY: "ত্রৈমাসিক", HALF_YEARLY: "অর্ধ-বার্ষিক",
  YEARLY: "বার্ষিক", WEEKLY_TEST: "সাপ্তাহিক", OTHER: "অন্যান্য",
};

const CATEGORY_COLORS = {
  MATHEMATICS: "bg-blue-100 text-blue-700", SCIENCE: "bg-emerald-100 text-emerald-700",
  LANGUAGES: "bg-violet-100 text-violet-700", SOCIAL: "bg-amber-100 text-amber-700",
  RELIGIOUS: "bg-rose-100 text-rose-700", OTHER: "bg-gray-100 text-gray-600",
};

const GRADE_COLORS = {
  "A+": "text-emerald-600 bg-emerald-50 border-emerald-200",
  "A": "text-emerald-600 bg-emerald-50 border-emerald-200",
  "A-": "text-teal-600 bg-teal-50 border-teal-200",
  "B": "text-blue-600 bg-blue-50 border-blue-200",
  "C": "text-amber-600 bg-amber-50 border-amber-200",
  "D": "text-orange-600 bg-orange-50 border-orange-200",
  "F": "text-red-600 bg-red-50 border-red-200",
};

const fmtDate = (iso) => iso
  ? new Date(iso).toLocaleDateString("bn-BD", { month: "long", day: "numeric" })
  : "—";

export default function ExamResultPage() {
  const { examId } = useParams();
  const router = useRouter();

  const [exam, setExam] = useState(null);
  const [examLoading, setExamLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState(null); // examSubject object
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState({});   // studentId → result
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal state
  const [bulkEntryOpen, setBulkEntryOpen] = useState(false);
  const [reportStudent, setReportStudent] = useState(null); // { studentId, studentName }
  const [summaryOpen, setSummaryOpen] = useState(false);

  // ── Load exam ─────────────────────────────────────────────────────────
  useEffect(() => {
    axiosInstance.get("/results/exams", { params: { limit: 200 } })
      .then(res => {
        const found = (res.data?.data ?? []).find(e => e.id === examId);
        setExam(found ?? null);
        if (found?.examSubjects?.length > 0) setSelectedSubject(found.examSubjects[0]);
      })
      .catch(() => setError("পরীক্ষার তথ্য লোড করতে ব্যর্থ হয়েছে।"))
      .finally(() => setExamLoading(false));
  }, [examId]);

  // ── Load students + existing results when subject changes ─────────────
  const loadStudentsAndResults = useCallback(async () => {
    if (!exam?.sectionId || !selectedSubject) return;
    setStudentsLoading(true);
    try {
      // Get enrolled students in this section
      const studRes = await axiosInstance.get("/students", {
        params: { limit: 200 },
      });
      const allStudents = studRes.data?.data ?? [];
      const sectionStudents = allStudents.filter(s =>
        s.currentEnrollment?.section?.id === exam.sectionId ||
        s.currentEnrollment?.sectionId === exam.sectionId
      );
      setStudents(sectionStudents);

      // Get existing results for this examSubject
      try {
        const resRes = await axiosInstance.get("/results", {
          params: { examSubjectId: selectedSubject.id, limit: 200 },
        });
        const resData = resRes.data?.data ?? [];
        const map = {};
        resData.forEach(r => { map[r.student?.id ?? r.studentId] = r; });
        setResults(map);
      } catch {
        // Results endpoint may not exist yet — ok
        setResults({});
      }
    } catch {
      setError("শিক্ষার্থীদের তথ্য লোড করতে ব্যর্থ হয়েছে।");
    } finally {
      setStudentsLoading(false);
    }
  }, [exam?.sectionId, selectedSubject]);

  useEffect(() => { loadStudentsAndResults(); }, [loadStudentsAndResults]);

  // ── Refresh after bulk entry ──────────────────────────────────────────
  const handleBulkSuccess = () => {
    setBulkEntryOpen(false);
    loadStudentsAndResults();
  };

  if (examLoading) return (
    <div className="flex items-center justify-center py-32">
      <Loader2 size={28} className="text-violet-400 animate-spin" />
    </div>
  );

  if (!exam) return (
    <div className="flex flex-col items-center py-24 text-center">
      <AlertCircle size={28} className="text-red-400 mb-3" />
      <p className="font-semibold text-gray-600">পরীক্ষা পাওয়া যায়নি।</p>
      <button onClick={() => router.push("/dashboard/admin/results")}
        className="mt-4 text-sm text-violet-600 hover:underline font-semibold">← ফিরে যান</button>
    </div>
  );

  const markedCount = Object.keys(results).length;
  const passCount = Object.values(results).filter(r => r.grade !== "F").length;

  return (
    <div className="space-y-5 pb-8">

      {/* Header */}
      <div className="flex items-start gap-3 flex-wrap">
        <button onClick={() => router.push("/dashboard/admin/results")}
          className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500 mt-0.5 shrink-0">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-gray-900">{exam.name}</h2>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-100 text-violet-700">
              {EXAM_TYPE_BN[exam.type] ?? exam.type}
            </span>
            <span className="text-xs text-gray-400">
              {exam.section?.class?.name} — সেকশন {exam.section?.name}
            </span>
            <span className="text-xs text-gray-400">{exam.academicYear}</span>
          </div>
        </div>
        <button
          onClick={() => setSummaryOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border border-violet-200 text-violet-700 bg-violet-50 hover:bg-violet-100 rounded-xl transition-colors shrink-0"
        >
          <BarChart2 size={16} /> সেকশন সারসংক্ষেপ
        </button>
      </div>

      {/* Subject tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">বিষয় নির্বাচন করুন</p>
        <div className="flex flex-wrap gap-2">
          {exam.examSubjects?.map(es => {
            const active = selectedSubject?.id === es.id;
            const catCls = CATEGORY_COLORS[es.subject?.category] ?? "bg-gray-100 text-gray-600";
            return (
              <button key={es.id} onClick={() => setSelectedSubject(es)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${active
                    ? "border-violet-500 bg-violet-50 text-violet-700 shadow-sm"
                    : "border-gray-100 bg-white text-gray-600 hover:border-violet-200"
                  }`}
              >
                <span className={`text-xs px-2.5 py-0.5 rounded-md font-bold ${catCls}`}>
                  {es.subject?.code}
                </span>
                {es.subject?.name}
                <span className="text-xs opacity-60">{fmtDate(es.examDate)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected subject info + action */}
      {selectedSubject && (
        <div className="flex items-center justify-between flex-wrap gap-3 bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <p className="text-xs text-gray-400">বিষয়</p>
              <p className="text-sm font-bold text-gray-800">{selectedSubject.subject?.name}</p>
            </div>
            <div className="w-px h-8 bg-gray-100" />
            <div>
              <p className="text-xs text-gray-400">মোট নম্বর</p>
              <p className="text-sm font-bold text-gray-800">{selectedSubject.totalMarks}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">পাসের নম্বর</p>
              <p className="text-sm font-bold text-gray-800">{selectedSubject.passingMarks}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">নম্বর দেওয়া হয়েছে</p>
              <p className="text-sm font-bold text-violet-700">{markedCount} / {students.length}</p>
            </div>
            {markedCount > 0 && (
              <div>
                <p className="text-xs text-gray-400">পাস করেছে</p>
                <p className="text-sm font-bold text-emerald-600">{passCount} জন</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setBulkEntryOpen(true)}
            disabled={studentsLoading}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-violet-600 rounded-xl hover:bg-violet-700 active:scale-95 shadow-lg shadow-violet-200 disabled:opacity-40"
          >
            <Edit3 size={15} />
            {markedCount > 0 ? "ফলাফল আপডেট করুন" : "ফলাফল প্রদান করুন"}
          </button>
        </div>
      )}

      {/* Students table */}
      {selectedSubject && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-800">শিক্ষার্থী তালিকা</h3>
            <p className="text-xs text-gray-400">{students.length} জন শিক্ষার্থী</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["রোল", "শিক্ষার্থী", "প্রাপ্ত নম্বর", "মোট", "গ্রেড", "GPA", "মন্তব্য", ""].map((h, i) => (
                    <th key={i} className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {studentsLoading
                  ? Array(5).fill(0).map((_, i) => (
                    <tr key={i}>{Array(8).fill(0).map((__, j) => (
                      <td key={j} className="px-5 py-4"><div className="h-4 bg-gray-100 rounded animate-pulse w-16" /></td>
                    ))}</tr>
                  ))
                  : students.length === 0
                    ? (
                      <tr><td colSpan={8} className="px-5 py-16 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Users size={24} className="text-gray-400" />
                          <p className="text-sm text-gray-500">এই সেকশনে কোনো শিক্ষার্থী নেই।</p>
                        </div>
                      </td></tr>
                    )
                    : students.map(student => {
                      const result = results[student.id];
                      const initials = student.fullNameEnglish?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) ?? "S";
                      const gradeCls = result?.grade ? (GRADE_COLORS[result.grade] ?? "bg-gray-50 text-gray-600 border-gray-200") : "";

                      return (
                        <tr key={student.id} className={`hover:bg-gray-50/50 transition-colors ${result ? "" : "opacity-60"}`}>
                          <td className="px-5 py-3.5">
                            <span className="font-mono text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                              {student.currentEnrollment?.rollNumber ?? "—"}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 bg-violet-100 rounded-xl flex items-center justify-center text-violet-700 font-bold text-xs shrink-0">
                                {initials}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800 text-sm">{student.fullNameEnglish}</p>
                                <p className="text-xs text-gray-400">{student.studentCode}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            {result
                              ? <span className="text-base font-bold text-gray-800">{result.marksObtained}</span>
                              : <span className="text-xs text-gray-400 italic">দেওয়া হয়নি</span>
                            }
                          </td>
                          <td className="px-5 py-3.5 text-sm text-gray-500">{selectedSubject.totalMarks}</td>
                          <td className="px-5 py-3.5">
                            {result?.grade && (
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${gradeCls}`}>
                                {result.grade}
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-sm font-semibold text-gray-700">
                            {result?.gpa ?? "—"}
                          </td>
                          <td className="px-5 py-3.5 text-xs text-gray-400 max-w-xs truncate">
                            {result?.remarks ?? "—"}
                          </td>
                          <td className="px-5 py-3.5">
                            <button
                              onClick={() => setReportStudent({ studentId: student.id, studentName: student.fullNameEnglish })}
                              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                              <Eye size={11} /> রিপোর্ট
                            </button>
                          </td>
                        </tr>
                      );
                    })
                }
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      {bulkEntryOpen && selectedSubject && (
        <BulkResultEntry
          isOpen={bulkEntryOpen}
          onClose={() => setBulkEntryOpen(false)}
          onSuccess={handleBulkSuccess}
          examSubject={selectedSubject}
          students={students}
          existingResults={results}
        />
      )}

      <SectionSummaryModal
        isOpen={summaryOpen}
        onClose={() => setSummaryOpen(false)}
        sectionId={exam?.sectionId}
        examId={examId}
      />

      <ReportCardModal
        isOpen={!!reportStudent}
        onClose={() => setReportStudent(null)}
        studentId={reportStudent?.studentId}
        studentName={reportStudent?.studentName}
        examId={examId}
        exam={exam}
      />

    </div>
  );
}