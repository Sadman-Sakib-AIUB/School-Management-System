"use client";

import { useEffect, useState, useMemo } from "react";

import {
  BookOpen, TrendingUp, Award, ChevronRight,
  X, CheckCircle2,
} from "lucide-react";
import axiosInstance from "@/src/lib/axiosInstance";
import ReportCardModal from "./_components/ReportCardModal";
import GpaTrendChart from "./_components/GpaTrendChart";


const GRADE_BG = {
  "A+": "bg-emerald-50 border-emerald-200 text-emerald-700",
  "A": "bg-emerald-50 border-emerald-200 text-emerald-600",
  "A-": "bg-teal-50 border-teal-200 text-teal-700",
  "B": "bg-blue-50 border-blue-200 text-blue-700",
  "C": "bg-amber-50 border-amber-200 text-amber-700",
  "D": "bg-orange-50 border-orange-200 text-orange-600",
  "F": "bg-red-50 border-red-200 text-red-600",
};
const GRADE_BAR = {
  "A+": "bg-emerald-400", "A": "bg-emerald-400", "A-": "bg-teal-400",
  "B": "bg-blue-400", "C": "bg-amber-400", "D": "bg-orange-400", "F": "bg-red-400",
};

const EXAM_TYPE_BN = {
  MIDTERM: "মধ্যবর্ষ", FINAL: "চূড়ান্ত", UNIT_TEST: "ইউনিট টেস্ট",
  QUARTERLY: "ত্রৈমাসিক", HALF_YEARLY: "অর্ধবার্ষিক", YEARLY: "বার্ষিক",
  WEEKLY_TEST: "সাপ্তাহিক", MOCK: "মক", OTHER: "অন্যান্য",
};

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" }) : "—";

// ------ skeleton -----

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 bg-gray-100 rounded-xl" />
        <div className="h-4 bg-gray-100 rounded w-28" />
      </div>
      <div className="h-8 bg-gray-100 rounded w-16 mb-3" />
      <div className="h-1.5 bg-gray-100 rounded-full" />
      <div className="h-3 bg-gray-100 rounded w-24 mt-2" />
    </div>
  );
}

const StudentResultsPage = () => {
  const [studentId, setStudentId] = useState(null);
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState({}); // { [examId]: result }
  const [loadingExams, setLoadingExams] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);
  const [selectedExamName, setSelectedExamName] = useState("");

  // ------- fetch profile + exams --------
  useEffect(() => {

    // Fetch student ID from /me endpoint 
    const fetchStudent = async () => {
      try {
        const res = await axiosInstance.get("students/me");
        // console.log(res);
        return res.data?.data?.id || null;
      } catch {
        setError("শিক্ষার্থীর তথ্য লোড করতে সমস্যা হয়েছে।");
        setIsLoading(false);
        return null;
      }
    };

    fetchStudent().then((id) => {
      if (id) setStudentId(id);
    });

  }, [studentId]);

  useEffect(() => {
    if (!studentId) return;
    const init = async () => {
      setLoadingExams(true);
      setError(null);
      try {
        const [profileRes, examsRes] = await Promise.allSettled([
          axiosInstance.get(`/students/me`),
          axiosInstance.get("/results/exams?limit=200"), // get all exams to filter by section later
          // need permission as a student
        ]);
        // console.log(profileRes);
        // console.log(examsRes); 

        const profileData = profileRes.status === "fulfilled" ? profileRes.value.data?.data : null;
        setProfile(profileData);
        // console.log(profileData);

        const allExams = examsRes.status === "fulfilled" ? examsRes.value.data?.data || [] : [];
        // console.log(allExams);
        const sectionId = profileData?.enrollments?.[0]?.section?.id;
        // console.log(sectionId);
        const myExams = sectionId ? allExams.filter((e) => e.section?.id === sectionId) : allExams;

        const sorted = [...myExams].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

        setExams(sorted);

        // fetch all results in parallel
        if (sorted.length && studentId) {
          // console.log(studentId);
          setLoadingResults(true);
          const fetched = await Promise.allSettled(
            sorted.map((e) => axiosInstance.get(`/results/student/${studentId}/exam/${e.id}`)) // need permission as a student
          );
          // console.log(fetched);
          const map = {};
          fetched.forEach((r, i) => {
            if (r.status === "fulfilled" && r.value.data?.data) {
              map[sorted[i].id] = r.value.data.data;
            }
          });
          setResults(map);
          setLoadingResults(false);
        }
      } catch {
        setError("ফলাফল লোড করতে সমস্যা হয়েছে।");
      } finally {
        setLoadingExams(false);
      }
    };
    init();
  }, [studentId]);

  // --- summary stats ----
  const summaryStats = useMemo(() => {
    const resultList = Object.values(results);
    // console.log(resultList);

    if (!resultList.length) return { total: 0, passed: 0, failed: 0, bestGPA: null, bestGrade: "—", avgGPA: null };
    const gpas = resultList
      .map((r) => r?.overallResult?.averageGPA)
      .filter((g) => g !== null && g !== undefined);

    const grades = resultList
      .map((r) => r?.overallResult?.overallGrade)
      .filter(Boolean);

    const passed = resultList.filter(
      (r) => r?.overallResult?.status === "PASS"
    ).length;

    const avgGPA = gpas.length
      ? (gpas.reduce((a, b) => a + b, 0) / gpas.length).toFixed(2)
      : null;

    const bestGPA = gpas.length ? Math.max(...gpas) : null;

    const gradeOrder = ["A+", "A", "A-", "B", "C", "D", "F"];

    const bestGrade =
      grades.sort(
        (a, b) => gradeOrder.indexOf(a) - gradeOrder.indexOf(b)
      )[0] || "—";

    // Trend Chart Data Preparation

    const gpaTrendData = resultList.map((r, i) => ({
      name: r?.exam?.name || `Exam ${i + 1}`,
      gpa: r?.overallResult?.averageGPA || 0,
    }));


    return { total: resultList.length, passed, failed: resultList.length - passed, bestGPA, bestGrade, avgGPA, gpaTrendData };

  }, [results]);

  const isLoading = loadingExams;

  const handleView = (exam) => {
    const r = results[exam.id];
    if (!r) return;
    setSelectedResult(r);
    setSelectedExamName(exam.name);
  };


  return (
    <div className="space-y-6 pb-8">

      {/* -- page header -- */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">পরীক্ষার ফলাফল</h2>
        <p className="text-xs text-gray-400 mt-1">সকল পরীক্ষার বিষয়ভিত্তিক ফলাফল</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>
      )}

      {/* -- summary stat cards -- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />) : (
          <>
            {/* Total exams */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
                  <BookOpen size={17} className="text-blue-600" />
                </div>
                <p className="text-sm font-bold text-gray-700">মোট পরীক্ষা</p>
              </div>
              <p className="text-3xl font-bold text-blue-600">{exams.length}</p>
              <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400 rounded-full" style={{ width: summaryStats.total ? `${(summaryStats.total / exams.length) * 100}%` : "0%" }} />
              </div>
              <p className="text-xs text-gray-400 mt-1">{summaryStats.total} টির ফলাফল পাওয়া গেছে</p>
            </div>

            {/* Passed */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <CheckCircle2 size={17} className="text-emerald-600" />
                </div>
                <p className="text-sm font-bold text-gray-700">উত্তীর্ণ</p>
              </div>
              <p className="text-3xl font-bold text-emerald-600">{summaryStats.passed}</p>
              <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: summaryStats.total ? `${(summaryStats.passed / summaryStats.total) * 100}%` : "0%" }} />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {summaryStats.total ? Math.round((summaryStats.passed / summaryStats.total) * 100) : 0}% উত্তীর্ণ হার
              </p>
            </div>

            {/* Best GPA */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center">
                  <Award size={17} className="text-violet-600" />
                </div>
                <p className="text-sm font-bold text-gray-700">সর্বোচ্চ GPA</p>
              </div>
              <p className="text-3xl font-bold text-violet-600">{summaryStats.bestGPA ?? "—"}</p>
              <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-violet-400 rounded-full" style={{ width: summaryStats.bestGPA ? `${(summaryStats.bestGPA / 5) * 100}%` : "0%" }} />
              </div>
              <p className="text-xs text-gray-400 mt-1">গ্রেড: {summaryStats.bestGrade} · ৫.০ এর মধ্যে</p>
            </div>

            {/* Average GPA */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
                  <TrendingUp size={17} className="text-amber-600" />
                </div>
                <p className="text-sm font-bold text-gray-700">গড় GPA</p>
              </div>
              <p className="text-3xl font-bold text-amber-600">{summaryStats.avgGPA ?? "—"}</p>
              <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: summaryStats.avgGPA ? `${(summaryStats.avgGPA / 5) * 100}%` : "0%" }} />
              </div>
              <p className="text-xs text-gray-400 mt-1">সকল পরীক্ষার গড়</p>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* -- exam results list -- */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-violet-100 rounded-xl flex items-center justify-center">
                <BookOpen size={16} className="text-violet-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">পরীক্ষার তালিকা</h3>
                <p className="text-xs text-gray-400 mt-0.5">বিস্তারিত দেখতে "দেখুন" বাটনে ক্লিক করুন</p>
              </div>
            </div>
            {loadingResults && (
              <span className="text-xs text-violet-500 font-semibold animate-pulse">ফলাফল লোড হচ্ছে...</span>
            )}
          </div>

          {isLoading ? (
            <div className="divide-y divide-gray-50">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="px-6 py-4 flex items-center justify-between animate-pulse">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-48" />
                    <div className="h-3 bg-gray-100 rounded w-32" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-7 bg-gray-100 rounded-full w-14" />
                    <div className="h-7 bg-gray-100 rounded-lg w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : exams.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-gray-400 gap-2">
              <BookOpen size={32} className="text-gray-200" />
              <p className="text-sm">কোনো পরীক্ষার তথ্য পাওয়া যায়নি</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {exams.map((exam) => {
                const result = results[exam.id];
                const gpa = result?.summary?.gpa ?? result?.gpa ?? null;
                const grade = result?.summary?.grade ?? result?.grade ?? null;
                const obtained = result?.summary?.obtainedMarks ?? result?.obtainedMarks ?? null;
                const total = result?.summary?.totalMarks ?? result?.totalMarks ?? null;
                const gradeStyle = grade ? (GRADE_BG[grade] || "bg-gray-50 border-gray-200 text-gray-600") : null;
                const hasResult = !!result;
                const pct = (total && obtained) ? Math.round((obtained / total) * 100) : null;

                return (
                  <div key={exam.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50/60 transition-colors">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-gray-800">{exam.name}</p>
                        <span className="text-xs font-semibold px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                          {EXAM_TYPE_BN[exam.type] || exam.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 flex-wrap">
                        <span>{formatDate(exam.startDate)}</span>
                        {exam.endDate && exam.endDate !== exam.startDate && (
                          <span>— {formatDate(exam.endDate)}</span>
                        )}
                        {pct !== null && (
                          <span className="text-violet-500 font-semibold">{obtained}/{total} ({pct}%)</span>
                        )}
                      </div>
                      {/* mini progress bar when result available */}
                      {hasResult && pct !== null && (
                        <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden w-48 max-w-full">
                          <div
                            className={`h-full rounded-full ${grade === "F" ? "bg-red-400"
                              : pct >= 80 ? "bg-emerald-400"
                                : pct >= 60 ? "bg-blue-400"
                                  : "bg-amber-400"
                              }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {hasResult && grade && (
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${gradeStyle}`}>
                          {grade}
                        </span>
                      )}
                      {!hasResult && !loadingResults && (
                        <span className="text-xs text-gray-400 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full">
                          অপেক্ষমান / published নয়
                        </span>
                      )}
                      {hasResult && (
                        <button
                          onClick={() => handleView(exam)}
                          className="text-xs font-semibold px-3 py-1.5 border border-violet-200 text-violet-700 bg-violet-50 hover:bg-violet-100 rounded-lg transition-colors flex items-center gap-1"
                        >
                          দেখুন
                          <ChevronRight size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* -- Trend Chart -- */}
        <div>
          <GpaTrendChart data={summaryStats.gpaTrendData} />
        </div>
      </div>
      {/* -- report card modal -- */}
      {selectedResult && (
        <ReportCardModal
          result={selectedResult}
          examName={selectedExamName}
          onClose={() => { setSelectedResult(null); setSelectedExamName(""); }}
        />
      )}
    </div>
  );
}

export default StudentResultsPage;