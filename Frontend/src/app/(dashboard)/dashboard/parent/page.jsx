"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Users, GraduationCap, BookOpen, Hash,
  TrendingUp, CalendarCheck, CalendarX, Clock, Star,
  Check,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import axiosInstance from "@/src/lib/axiosInstance";



const MONTH_BN = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];
const RELATION_BN = { FATHER: "বাবা", MOTHER: "মা", GRANDFATHER: "দাদা", GRANDMOTHER: "দাদি", UNCLE: "চাচা", AUNT: "চাচি", SIBLING: "ভাই/বোন", GUARDIAN: "অভিভাবক", OTHER: "অন্যান্য" };
const GENDER_BN = { MALE: "পুরুষ", FEMALE: "মহিলা", OTHER: "অন্যান্য" };
const STATUS_BN = { PRESENT: "উপস্থিত", ABSENT: "অনুপস্থিত", LATE: "দেরি", LEAVE: "ছুটি" };
const GRADE_COLOR = { "A+": "text-emerald-600", "A": "text-emerald-500", "A-": "text-teal-600", "B": "text-blue-600", "C": "text-amber-600", "D": "text-orange-500", "F": "text-red-600" };
const GRADE_BG = {
  "A+": "bg-emerald-50 border-emerald-200 text-emerald-700",
  "A": "bg-emerald-50 border-emerald-200 text-emerald-600",
  "A-": "bg-teal-50 border-teal-200 text-teal-700",
  "B": "bg-blue-50 border-blue-200 text-blue-700",
  "C": "bg-amber-50 border-amber-200 text-amber-700",
  "D": "bg-orange-50 border-orange-200 text-orange-600",
  "F": "bg-red-50 border-red-200 text-red-600",
};
const EXAM_TYPE_BN = { WEEKLY_TEST: "সাপ্তাহিক টেস্ট", CLASS_TEST: "ক্লাস টেস্ট", MID_TERM: "অর্ধবার্ষিক", FINAL: "বার্ষিক", TERM_END: "টার্ম-এন্ড" };



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

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-gray-100 shadow-lg rounded-xl px-3 py-2 text-xs">
      <p className="font-bold text-gray-700 mb-1.5">{label}</p>
      <p className="text-violet-600">উপস্থিত: {d.PRESENT}</p>
      <p className="text-amber-500">দেরি: {d.LATE}</p>
      <p className="text-red-500">অনুপস্থিত: {d.ABSENT}</p>
    </div>
  );
}



// function StudentTabBar({ students, activeId, onChange }) {
//   return (
//     <div className="flex gap-2 flex-wrap">
//       {students.map((s) => (
//         <button
//           key={s.id}
//           onClick={() => onChange(s.id)}
//           className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors border ${activeId === s.id
//             ? "bg-violet-600 text-white border-violet-600 shadow-sm"
//             : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
//             }`}
//         >
//           {s.isPrimary && <Star size={12} className={activeId === s.id ? "text-yellow-300" : "text-amber-400"} fill="currentColor" />}
//           {s.fullNameBangla || s.fullNameEnglish}
//         </button>
//       ))}
//     </div>
//   );
// }


const GuardianDashboardPage = () => {
  const [profile, setProfile] = useState(null);
  const [activeStudentId, setActiveStudentId] = useState(null);
  const [studentData, setStudentData] = useState({}); // { [studentId]: { attendance, results, exams } }
  const [isLoading, setIsLoading] = useState(true);
  const [isStudentLoading, setIsStudentLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  // ---- initial fetch -----

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get("/guardians/me");
      const data = res.data?.data;
      setProfile(data);
      if (data?.students?.length) {
        const first = data.students.find((s) => s.isPrimary) || data.students[0];
        setActiveStudentId(first.id);
        await fetchStudentData(first.id, data.students);
      }
      setLastUpdated(new Date());
    } catch {
      setError("তথ্য লোড করতে সমস্যা হয়েছে।");
    } finally {
      setIsLoading(false);
    }
  };

  // ---- per-student data ----

  const fetchStudentData = async (studentId, students) => {
    if (studentData[studentId]) return; // already cached
    setIsStudentLoading(true);
    try {
      const allStudents = students || profile?.students || [];
      const student = allStudents.find((s) => s.id === studentId);
      // console.log(student);
      const sectionId = student?.currentEnrollment?.section?.id;
      // console.log(sectionId);

      // const [attendanceRes, examsRes] = await Promise.allSettled([
      //   axiosInstance.get(`/attendance/student/${studentId}`),
      //   axiosInstance.get("/results/exams?limit=200"), // need permission as a guardian
      // ]);

      const [attendanceRes] = await Promise.allSettled([
        axiosInstance.get(`/attendance/student/${studentId}`),

      ]);

      // console.log(attendanceRes.value.data.data.records);

      const attendance = attendanceRes.status === "fulfilled" ? attendanceRes.value.data.data.records || [] : [];
      // console.log(attendance);
      const allExams = examsRes.status === "fulfilled" ? examsRes.value.data?.data || [] : [];
      // console.log(allExams);
      const sectionExams = sectionId ? allExams.filter((e) => e.section?.id === sectionId).slice(0, 6) : [];
      
      const resultFetches = await Promise.allSettled(
        sectionExams.map((e) => axiosInstance.get(`/results/student/${studentId}/exam/${e.id}`))
      );

      // console.log(resultFetches);
      const results = resultFetches
        .filter((r) => r.status === "fulfilled")
        .map((r) => r.value.data?.data)
        .filter(Boolean);

      const today = new Date(); today.setHours(0, 0, 0, 0);
      const upcomingExams = allExams
        .filter((e) => e.section?.id === sectionId && new Date(e.startDate) >= today)
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
        .slice(0, 4);

      setStudentData((prev) => ({ ...prev, [studentId]: { attendance, results, upcomingExams } }));
    } catch {
      // silently fail — empty state will show
    } finally {
      setIsStudentLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);
  // console.log(profile);

  const handleStudentChange = async (id) => {
    setActiveStudentId(id);
    await fetchStudentData(id);
  };

  // ------ active student derived ------

  const activeStudent = profile?.students?.find((s) => s.id === activeStudentId);
  // console.log(activeStudent.id);

  const sd = studentData[activeStudentId] || {};
  // console.log(studentData)
  const attendance = sd.attendance || [];
  const results = sd.results || [];
  const upcomingExams = sd.upcomingExams || [];

  const attStats = useMemo(() => {
    const total = attendance.length;
    // console.log(attendance);
    const c = { PRESENT: 0, ABSENT: 0, LATE: 0, LEAVE: 0 };
    attendance.forEach((a) => { if (c[a.status] !== undefined) c[a.status]++; });
    const pct = total ? Math.round(((c.PRESENT + c.LATE) / total) * 100) : 0;
    return { ...c, total, pct };
  }, [attendance]);

  const chartData = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      const m = d.getMonth(); const y = d.getFullYear();
      const rows = attendance.filter((a) => { const ad = new Date(a.date); return ad.getMonth() === m && ad.getFullYear() === y; });
      const c = { PRESENT: 0, LATE: 0, ABSENT: 0 };
      rows.forEach((r) => { if (c[r.status] !== undefined) c[r.status]++; });
      return { month: MONTH_BN[m], ...c };
    });
  }, [attendance]);

  const latestResult = results[results.length - 1];
  // console.log(results);
  const latestGPA = latestResult?.summary?.gpa ?? latestResult?.gpa ?? null;
  
  const latestGrade = latestResult?.summary?.grade ?? latestResult?.grade ?? "—";
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const recentAtt = [...attendance].reverse().slice(0, 7);
  const enrollment = activeStudent?.currentEnrollment;



  return (
    <div className="space-y-6 pb-8">

      {/* ── page header ── */}

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>
      )}

      {/* -- guardian greeting banner -- */}
      {!isLoading && profile && (
        <div className="bg-gradient-to-r from-violet-50 to-white border border-violet-100 rounded-2xl px-6 py-4 flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-base font-bold text-violet-800">
              স্বাগতম, {profile.fullNameBangla || profile.fullNameEnglish} 👋
            </p>
            <p className="text-sm text-violet-500 mt-0.5">
              {profile.students?.length
                ? `আপনার ${profile.students.length} জন শিক্ষার্থী নিবন্ধিত আছে`
                : "কোনো শিক্ষার্থী সংযুক্ত নেই"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-violet-100 rounded-xl flex items-center justify-center">
              <Users size={16} className="text-violet-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-700">{profile.guardianCode}</p>
              <p className="text-xs text-gray-400">অভিভাবক কোড</p>
            </div>
          </div>
        </div>
      )}

      {/* ── no students ── */}
      {!isLoading && profile && profile.students?.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 flex flex-col items-center justify-center text-gray-400 gap-3">
          <GraduationCap size={40} className="text-gray-200" />
          <p className="text-base font-semibold">কোনো শিক্ষার্থী সংযুক্ত নেই</p>
          <p className="text-sm">স্কুল প্রশাসনের সাথে যোগাযোগ করুন।</p>
        </div>
      )}

      {/* ── 1. THE STUDENT NAVIGATOR (Ultra-Minimalist Profile Strip) ── */}
      {!isLoading && profile?.students?.length > 1 && (
        <div className="mb-10">
          <div className="text-center mb-8">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">শিক্ষার্থী নির্বাচন করুন</p>
            <h2 className="text-xl font-bold text-gray-800">যার তথ্য দেখতে চান তার প্রোফাইলে ক্লিক করুন</h2>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            {profile.students.map((student) => {
              const isActive = student.id === activeStudentId;
              const profilePhoto = student.profilePhotoUrl;
              // console.log(profilePhoto);
              const initials = (student.fullNameEnglish || "S")
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <button
                  key={student.id}
                  onClick={() => handleStudentChange(student.id)}
                  className="group flex flex-col items-center outline-none"
                >
                  {/* Profile Card Container - Matching Attendance Card Style */}
                  <div className={`
              relative w-28 h-28 rounded-2xl flex items-center justify-center transition-all duration-300 border
              ${isActive
                      ? 'bg-white shadow-md border-violet-200 scale-105'
                      : 'bg-white border-gray-100 shadow-sm hover:border-violet-100 hover:scale-105'}
            `}>

                    {/* Avatar Ring */}
                    <div className={`
                w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold transition-all
                ${isActive
                        ? 'bg-violet-600 text-white shadow-lg shadow-violet-200'
                        : 'bg-violet-50 text-violet-400 group-hover:bg-violet-100 group-hover:text-violet-600'}
              `}>
                      {profilePhoto ? (
                        <img src={profilePhoto} alt={initials} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        initials
                      )}

                    </div>

                    {/* Active Badge - Violet Theme */}
                    {isActive && (
                      <div className="absolute top-1 right-1 w-7 h-7 bg-violet-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                        <Check size={14} strokeWidth={4} className="text-white" />
                      </div>
                    )}
                  </div>

                  {/* Name Label */}
                  <p className={`mt-3 text-sm font-bold transition-colors ${isActive ? 'text-violet-600' : 'text-gray-500 group-hover:text-gray-900'
                    }`}>
                    {student.fullNameBangla || student.fullNameEnglish.split(" ")[0]}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 2. THE IDENTITY HEADER (No Borders, Pure Depth) ── */}
      {!isLoading && activeStudent && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

            {/* Left Section: Avatar & Primary Info */}
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 bg-violet-100 rounded-2xl flex items-center justify-center text-violet-700 text-3xl font-bold shadow-inner">
                  {activeStudent.profilePhotoUrl ? (
                    <img src={activeStudent.profilePhotoUrl} className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    (activeStudent.fullNameEnglish || "S")[0].toUpperCase()
                  )}
                </div>

              </div>

              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                    {activeStudent.fullNameBangla}
                  </h2>

                </div>
                <p className="text-sm font-medium text-gray-400 mt-0.5">{activeStudent.fullNameEnglish}</p>

                <div className="flex items-center gap-4 mt-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Student ID</span>
                    <span className="text-xs font-bold text-violet-600 font-mono">{activeStudent.studentCode}</span>
                  </div>
                  <div className="w-px h-6 bg-gray-100" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">সম্পর্ক</span>
                    <span className="text-xs font-bold text-gray-700">{RELATION_BN[activeStudent.relationship]}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section: Academic Pills (Matching your sample stats look) */}
            {enrollment && (
              <div className="flex flex-wrap gap-2">
                <div className="bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl text-center min-w-[80px]">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">শ্রেণি</p>
                  <p className="text-sm font-bold text-gray-800">{enrollment.section?.class?.name}</p>
                </div>
                <div className="bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl text-center min-w-[80px]">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">সেকশন</p>
                  <p className="text-sm font-bold text-gray-800">{enrollment.section?.name}</p>
                </div>
                <div className="bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl text-center min-w-[80px]">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">রোল</p>
                  <p className="text-sm font-bold text-violet-600">#{enrollment.rollNumber}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}




      {/* ── stat cards ── */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : activeStudent && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Attendance % */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CalendarCheck size={17} className="text-emerald-600" />
              </div>
              <p className="text-sm font-bold text-gray-700">উপস্থিতির হার</p>
            </div>
            {isStudentLoading ? <div className="h-8 bg-gray-100 rounded animate-pulse" /> : (
              <>
                <p className="text-3xl font-bold text-emerald-600">{attStats.pct}%</p>
                <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full transition-all" style={{ width: `${attStats.pct}%` }} />
                </div>
                <p className="text-xs text-gray-400 mt-1">{attStats.PRESENT} উপস্থিত · {attStats.total} মোট দিন</p>
              </>
            )}
          </div>

          {/* Absent */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center">
                <CalendarX size={17} className="text-red-500" />
              </div>
              <p className="text-sm font-bold text-gray-700">অনুপস্থিতি</p>
            </div>
            {isStudentLoading ? <div className="h-8 bg-gray-100 rounded animate-pulse" /> : (
              <>
                <p className="text-3xl font-bold text-red-500">{attStats.ABSENT}</p>
                <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-400 rounded-full transition-all" style={{ width: attStats.total ? `${(attStats.ABSENT / attStats.total) * 100}%` : "0%" }} />
                </div>
                <p className="text-xs text-gray-400 mt-1">{attStats.total ? Math.round((attStats.ABSENT / attStats.total) * 100) : 0}% অনুপস্থিত</p>
              </>
            )}
          </div>

          {/* Late */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
                <Clock size={17} className="text-amber-600" />
              </div>
              <p className="text-sm font-bold text-gray-700">দেরিতে উপস্থিতি</p>
            </div>
            {isStudentLoading ? <div className="h-8 bg-gray-100 rounded animate-pulse" /> : (
              <>
                <p className="text-3xl font-bold text-amber-600">{attStats.LATE}</p>
                <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: attStats.total ? `${(attStats.LATE / attStats.total) * 100}%` : "0%" }} />
                </div>
                <p className="text-xs text-gray-400 mt-1">{attStats.total ? Math.round((attStats.LATE / attStats.total) * 100) : 0}% দেরি</p>
              </>
            )}
          </div>

          {/* Latest GPA */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center">
                <TrendingUp size={17} className="text-violet-600" />
              </div>
              <p className="text-sm font-bold text-gray-700">সর্বশেষ GPA</p>
            </div>
            {isStudentLoading ? <div className="h-8 bg-gray-100 rounded animate-pulse" /> : (
              <>
                <p className={`text-3xl font-bold ${latestGPA !== null ? (GRADE_COLOR[latestGrade] || "text-violet-600") : "text-gray-400"}`}>
                  {latestGPA ?? "—"}
                </p>
                <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-400 rounded-full transition-all" style={{ width: latestGPA !== null ? `${(latestGPA / 5) * 100}%` : "0%" }} />
                </div>
                <p className="text-xs text-gray-400 mt-1">গ্রেড: {latestGrade} · ৫.০ এর মধ্যে</p>
              </>
            )}
          </div>

        </div>
      )}

      {/* ── charts row ── */}
      {activeStudent && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Attendance bar chart */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-gray-900">মাসিক উপস্থিতি</h3>
                <p className="text-xs text-gray-400 mt-0.5">শেষ ৬ মাসের বিবরণ</p>
              </div>
              <div className="w-8 h-8 bg-violet-100 rounded-xl flex items-center justify-center">
                <CalendarCheck size={16} className="text-violet-600" />
              </div>
            </div>
            {isLoading || isStudentLoading ? (
              <div className="h-52 bg-gray-50 rounded-xl animate-pulse" />
            ) : attendance.length === 0 ? (
              <div className="h-52 flex flex-col items-center justify-center text-gray-400 gap-2">
                <CalendarCheck size={32} className="text-gray-200" />
                <p className="text-sm">কোনো উপস্থিতির তথ্য নেই</p>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={210}>
                  <BarChart data={chartData} barSize={10} barGap={2} margin={{ left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f5f3ff" }} />
                    <Bar dataKey="PRESENT" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="LATE" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="ABSENT" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                  {[["#7c3aed", "উপস্থিত"], ["#f59e0b", "দেরি"], ["#ef4444", "অনুপস্থিত"]].map(([c, l]) => (
                    <span key={l} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: c }} />{l}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Upcoming exams */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-gray-900">আসন্ন পরীক্ষা</h3>
                <p className="text-xs text-gray-400 mt-0.5">নির্ধারিত পরীক্ষার তালিকা</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                <GraduationCap size={16} className="text-blue-600" />
              </div>
            </div>
            {isLoading || isStudentLoading ? (
              <div className="space-y-3">{Array(3).fill(0).map((_, i) => <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />)}</div>
            ) : upcomingExams.length === 0 ? (
              <div className="h-52 flex flex-col items-center justify-center text-gray-400 gap-2">
                <GraduationCap size={32} className="text-gray-200" />
                <p className="text-sm">কোনো আসন্ন পরীক্ষা নেই</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {upcomingExams.map((exam) => {
                  const start = new Date(exam.startDate);
                  const daysLeft = Math.ceil((start - today) / 86400000);
                  const urgency = daysLeft <= 3 ? "border-red-200 text-red-600 bg-red-50" : daysLeft <= 7 ? "border-amber-200 text-amber-600 bg-amber-50" : "border-blue-200 text-blue-600 bg-blue-50";
                  return (
                    <div key={exam.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100/60 transition-colors">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{exam.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{EXAM_TYPE_BN[exam.type] || exam.type} · {start.toLocaleDateString("bn-BD", { day: "numeric", month: "short" })}</p>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border whitespace-nowrap ${urgency}`}>
                        {daysLeft === 0 ? "আজ" : daysLeft === 1 ? "আগামীকাল" : `${daysLeft} দিন`}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── bottom row: recent attendance + results ── */}
      {activeStudent && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Recent attendance */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-gray-900">সাম্প্রতিক উপস্থিতি</h3>
                <p className="text-xs text-gray-400 mt-0.5">সর্বশেষ ৭ দিনের রেকর্ড</p>
              </div>
              <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CalendarCheck size={16} className="text-emerald-600" />
              </div>
            </div>
            {isLoading || isStudentLoading ? (
              <div className="space-y-2">{Array(5).fill(0).map((_, i) => <div key={i} className="h-10 bg-gray-50 rounded-xl animate-pulse" />)}</div>
            ) : recentAtt.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-gray-400 gap-2">
                <CalendarCheck size={28} className="text-gray-200" />
                <p className="text-sm">কোনো তথ্য নেই</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {recentAtt.map((a, idx) => {
                  const statusStyle = { PRESENT: "border-emerald-200 text-emerald-700 bg-emerald-50", ABSENT: "border-red-200 text-red-600 bg-red-50", LATE: "border-amber-200 text-amber-700 bg-amber-50", LEAVE: "border-gray-200 text-gray-600 bg-gray-100" }[a.status] || "border-gray-200 text-gray-600 bg-gray-100";
                  const d = new Date(a.date);
                  return (
                    <div key={idx} className="flex items-center justify-between py-2.5 hover:bg-gray-50/50">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{d.toLocaleDateString("bn-BD", { weekday: "short", day: "numeric", month: "short" })}</p>
                        {a.remarks && <p className="text-xs text-gray-400 mt-0.5">{a.remarks}</p>}
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${statusStyle}`}>
                        {STATUS_BN[a.status] || a.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Results */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-gray-900">পরীক্ষার ফলাফল</h3>
                <p className="text-xs text-gray-400 mt-0.5">সর্বশেষ ফলাফলসমূহ</p>
              </div>
              <div className="w-8 h-8 bg-violet-100 rounded-xl flex items-center justify-center">
                <TrendingUp size={16} className="text-violet-600" />
              </div>
            </div>
            {isLoading || isStudentLoading ? (
              <div className="space-y-2">{Array(4).fill(0).map((_, i) => <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />)}</div>
            ) : results.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-gray-400 gap-2">
                <TrendingUp size={28} className="text-gray-200" />
                <p className="text-sm">কোনো ফলাফল পাওয়া যায়নি</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {[...results].reverse().slice(0, 5).map((r, i) => {
                  const gpa = r?.summary?.gpa ?? r?.gpa ?? "—";
                  const grade = r?.summary?.grade ?? r?.grade ?? "—";
                  const examName = r?.exam?.name ?? `পরীক্ষা ${i + 1}`;
                  const gradeStyle = GRADE_BG[grade] || "bg-gray-50 border-gray-200 text-gray-600";
                  return (
                    <div key={r?.exam?.id ?? i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100/60 transition-colors">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{examName}</p>
                        <p className="text-xs text-gray-400 mt-0.5">GPA: {gpa} · ৫.০ এর মধ্যে</p>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${gradeStyle}`}>{grade}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

    </div>


  );
}

export default GuardianDashboardPage;