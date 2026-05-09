"use client";

import { useEffect, useState, useMemo } from "react";
import {
  BookOpen,
   BarChart2
} from "lucide-react";
import axiosInstance from "@/src/lib/axiosInstance";
import SubjectCard from "./_components/SubjectCard";


export const EXAM_TYPE_BN = {
  MIDTERM: "মধ্যবর্ষ", FINAL: "চূড়ান্ত", UNIT_TEST: "ইউনিট টেস্ট",
  QUARTERLY: "ত্রৈমাসিক", HALF_YEARLY: "অর্ধবার্ষিক", YEARLY: "বার্ষিক",
  WEEKLY_TEST: "সাপ্তাহিক", MOCK: "মক", OTHER: "অন্যান্য",
};

export const CATEGORY_BN = {
  SCIENCE: "বিজ্ঞান", MATH: "গণিত", LANGUAGE: "ভাষা", SOCIAL: "সামাজিক বিজ্ঞান",
  RELIGIOUS: "ধর্ম শিক্ষা", ARTS: "কলা", PHYSICAL: "শারীরিক শিক্ষা",
  VOCATIONAL: "বৃত্তিমূলক", OPTIONAL: "ঐচ্ছিক", OTHER: "অন্যান্য",
};

export const CATEGORY_STYLE = {
  SCIENCE: "bg-blue-50 border-blue-200 text-blue-700",
  MATH: "bg-violet-50 border-violet-200 text-violet-700",
  LANGUAGE: "bg-emerald-50 border-emerald-200 text-emerald-700",
  SOCIAL: "bg-amber-50 border-amber-200 text-amber-700",
  RELIGIOUS: "bg-teal-50 border-teal-200 text-teal-700",
  ARTS: "bg-pink-50 border-pink-200 text-pink-700",
  PHYSICAL: "bg-orange-50 border-orange-200 text-orange-700",
  VOCATIONAL: "bg-gray-100 border-gray-200 text-gray-700",
  OPTIONAL: "bg-indigo-50 border-indigo-200 text-indigo-700",
  OTHER: "bg-gray-100 border-gray-200 text-gray-600",
};

export const GRADE_BG = {
  "A+": "bg-emerald-50 border-emerald-200 text-emerald-700",
  "A": "bg-emerald-50 border-emerald-200 text-emerald-600",
  "A-": "bg-teal-50 border-teal-200 text-teal-700",
  "B": "bg-blue-50 border-blue-200 text-blue-700",
  "C": "bg-amber-50 border-amber-200 text-amber-700",
  "D": "bg-orange-50 border-orange-200 text-orange-600",
  "F": "bg-red-50 border-red-200 text-red-600",
};

export const GRADE_BAR = {
  "A+": "bg-emerald-400", "A": "bg-emerald-400", "A-": "bg-teal-400",
  "B": "bg-blue-400", "C": "bg-amber-400", "D": "bg-orange-400", "F": "bg-red-400",
};


function SubjectCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-xl shrink-0" />
          <div className="space-y-2">
            <div className="h-5 bg-gray-100 rounded w-40" />
            <div className="h-3 bg-gray-100 rounded w-24" />
          </div>
        </div>
        <div className="h-6 bg-gray-100 rounded-full w-20" />
      </div>
      <div className="space-y-2 mt-4">
        <div className="h-14 bg-gray-50 rounded-xl" />
        <div className="h-14 bg-gray-50 rounded-xl" />
      </div>
    </div>
  );
}





export default function StudentCoursesPage() {
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState({}); // { "examId_subjectId": result }
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCat, setFilterCat] = useState("ALL");

  // ------ fetch ------
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // /students/me gives us the authenticated student's own profile
        // /results returns only this student's results (server-filtered by auth)
        const [profileRes, examsRes, resultsRes] = await Promise.allSettled([
          axiosInstance.get("/students/me"),
          axiosInstance.get("/results/exams?limit=200"),
          axiosInstance.get("/results"),
        ]);

        const profileData = profileRes.status === "fulfilled" ? profileRes.value.data?.data : null;
        setProfile(profileData);

        const sectionId = profileData?.currentEnrollment?.section?.id
          || profileData?.enrollments?.[0]?.section?.id;

        const allExams = examsRes.status === "fulfilled" ? examsRes.value.data?.data || [] : [];
        const myExams = sectionId ? allExams.filter((e) => e.section?.id === sectionId) : allExams;
        setExams(myExams);

        // /results is auth-scoped — no client-side student ID filtering needed
        const allResults = resultsRes.status === "fulfilled" ? resultsRes.value.data?.data || [] : [];
        const map = {};
        allResults.forEach((r) => {
          if (r.exam?.id && r.subject?.id) {
            map[`${r.exam.id}_${r.subject.id}`] = r;
          }
        });
        setResults(map);
      } catch {
        setError("কোর্সের তথ্য লোড করতে সমস্যা হয়েছে।");
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [profile?.id]); // refetch if student ID changes (e.g. on login/logout)

  // console.log(profile);
  // console.log(exams);
  // console.log(results);

  // --------- build subject-first structure -------
  const subjectMap = useMemo(() => {
    // { subjectId: { subject, examRows: [...] } }
    const map = {};
    exams.forEach((exam) => {
      (exam.examSubjects || []).forEach((es) => {
        const subId = es.subject?.id;
        if (!subId) return;
        if (!map[subId]) {
          map[subId] = { subject: es.subject, examRows: [] };
        }
        map[subId].examRows.push({
          examSubjectId: es.id,
          examId: exam.id,
          examName: exam.name,
          examType: exam.type,
          examDate: es.examDate,
          totalMarks: es.totalMarks,
          passingMarks: es.passingMarks,
          startDate: exam.startDate,
        });
      });
    });
    // sort exam rows within each subject by date desc
    Object.values(map).forEach((s) => {
      s.examRows.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    });
    return map;
  }, [exams]);

  const subjectList = useMemo(() => Object.values(subjectMap), [subjectMap]);

  // ----- summary stats ------
  const stats = useMemo(() => {
    const resultList = Object.values(results);
    const totalSubs = subjectList.length;
    const totalExams = exams.length;
    const withMarks = resultList.length;
    const avgPct = withMarks
      ? Math.round(resultList.reduce((a, b) => a + (b.percentage || 0), 0) / withMarks)
      : null;
    return { totalSubs, totalExams, withMarks, avgPct };
  }, [subjectList, exams, results]);

  // ------- filter ------
  const categories = useMemo(() => {
    const cats = [...new Set(subjectList.map((s) => s.subject?.category).filter(Boolean))];
    return cats;
  }, [subjectList]);

  const filtered = useMemo(() => {
    return subjectList.filter((s) => {
      const matchSearch = !searchQuery
        || s.subject?.name?.toLowerCase().includes(searchQuery.toLowerCase())
        || s.subject?.code?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = filterCat === "ALL" || s.subject?.category === filterCat;
      return matchSearch && matchCat;
    });
  }, [subjectList, searchQuery, filterCat]);

  // console.log(profile);

  
  return (
    <div className="space-y-6 pb-8">

      {/* ── page header ── */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">আমার কোর্সসমূহ</h2>
        <p className="text-xs text-gray-400 mt-1">
          {profile?.enrollments?.length > 0
            ? `${profile.enrollments[0].section?.class?.name} - সেকশন ${profile.enrollments[0].section?.name} · শিক্ষাবর্ষ ${profile.enrollments[0].section?.class?.academicYear || ""}`
            : "বিষয় ও পরীক্ষার নম্বরের বিবরণ"}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>
      )}

      {/* ── summary stat cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          <>
            <div className="h-40 bg-gray-100 rounded-3xl animate-pulse" />
            <div className="h-40 bg-gray-100 rounded-3xl animate-pulse" />
          </>
        ) : (
          <>
            {/* OPTION A: VIBRANT COLOR (The "Electric" Look) */}
            {/* Total Subjects */}
            <div className="relative overflow-hidden bg-indigo-600 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-200 group transition-transform hover:scale-[1.01]">
              {/* Background Decorative Element */}
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors" />

              <div className="relative flex justify-between items-center">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                      <BookOpen size={20} strokeWidth={1.5} className="text-white" />
                    </div>
                    <p className="text-indigo-100 text-sm font-medium tracking-wide">My Learning Space</p>
                  </div>
                  <h3 className="text-2xl font-bold">মোট বিষয়</h3>
                  <p className="text-5xl font-black tracking-normal">
                    {stats.totalSubs} <span className="text-lg font-medium opacity-70">Subjects</span>
                  </p>
                </div>

                <div className="hidden sm:block">
                  <div className="w-24 h-24 border-4 border-white/10 rounded-full flex items-center justify-center relative">
                    <BookOpen size={40} strokeWidth={1} className="text-white/40" />
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle cx="44" cy="44" r="42" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/20" />
                      {/* <circle cx="44" cy="44" r="42" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="276" strokeDashoffset="0" className="text-white" /> */}
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Exams */}
            <div className="relative overflow-hidden bg-violet-600 rounded-[2rem] p-8 text-white shadow-xl shadow-violet-200 group transition-transform hover:scale-[1.01]">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors" />

              <div className="relative flex justify-between items-center">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                      <BarChart2 size={20} strokeWidth={1.5} className="text-white" />
                    </div>
                    <p className="text-violet-100 text-sm font-medium tracking-wide">Examination Hub</p>
                  </div>
                  <h3 className="text-2xl font-bold">মোট পরীক্ষা</h3>
                  <p className="text-5xl font-black tracking-normal">
                    {stats.totalExams} <span className="text-lg font-medium opacity-70">Exams</span>
                  </p>
                </div>

                <div className="hidden sm:block">
                  <div className="w-24 h-24 border-4 border-white/10 rounded-full flex items-center justify-center relative">
                    <BarChart2 size={40} strokeWidth={1} className="text-white/40" />
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle cx="44" cy="44" r="42" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/20" />
                      {/* <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="276" strokeDashoffset="60" className="text-white" /> */}
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* OPTION B: SOFT PAPER (The "Elegant" Look) */}
            {/* Total Subjects (Paper Version) */}
            {/* <div className="relative bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all group">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-widest">
              Academic Library
            </span>
            <h3 className="text-xl font-bold text-gray-800">মোট বিষয়</h3>
            <p className="text-5xl font-black text-indigo-600 tracking-tighter">
              {stats.totalSubs}
            </p>
            <p className="text-sm text-gray-400 font-medium italic">Enrolled in current session</p>
          </div>
          <div className="bg-indigo-50 p-6 rounded-3xl group-hover:rotate-6 transition-transform">
            <BookOpen size={48} strokeWidth={1} className="text-indigo-400" />
          </div>
        </div>
      </div> */}

            {/* Total Exams (Paper Version) */}
            {/* <div className="relative bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all group">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 text-violet-600 text-[10px] font-bold uppercase tracking-widest">
              Assessment Centre
            </span>
            <h3 className="text-xl font-bold text-gray-800">মোট পরীক্ষা</h3>
            <p className="text-5xl font-black text-violet-600 tracking-tighter">
              {stats.totalExams}
            </p>
            <p className="text-sm text-gray-400 font-medium italic">Including midterms & finals</p>
          </div>
          <div className="bg-violet-50 p-6 rounded-3xl group-hover:rotate-6 transition-transform">
            <BarChart2 size={48} strokeWidth={1} className="text-violet-400" />
          </div>
        </div>
      </div> */}
          </>
        )}
      </div>

      {/* ── search + filter bar ── */}
      {!isLoading && subjectList.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          {/* search */}
          <div className="relative flex-1 min-w-48">
            <BookOpen size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="বিষয় খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition-colors"
            />
          </div>
          {/* category filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterCat("ALL")}
              className={`text-xs font-semibold px-3 py-2 rounded-xl border transition-colors ${filterCat === "ALL"
                ? "bg-violet-600 text-white border-violet-600"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
            >
              সব
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                className={`text-xs font-semibold px-3 py-2 rounded-xl border transition-colors ${filterCat === cat
                  ? "bg-violet-600 text-white border-violet-600"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
              >
                {CATEGORY_BN[cat] || cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── subject cards ── */}
      {isLoading ? (
        <div className="space-y-4">
          {Array(4).fill(0).map((_, i) => <SubjectCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm h-48 flex flex-col items-center justify-center text-gray-400 gap-2">
          <BookOpen size={32} className="text-gray-200" />
          <p className="text-sm">
            {searchQuery || filterCat !== "ALL" ? "কোনো বিষয় পাওয়া যায়নি" : "কোনো কোর্সের তথ্য নেই"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(({ subject, examRows }) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              examRows={examRows}
              results={results}
            />
          ))}
        </div>
      )}

    </div>
  );
}