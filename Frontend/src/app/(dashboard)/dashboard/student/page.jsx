"use client";

import { useEffect, useState, useMemo} from "react";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import {
  CalendarCheck, CalendarX, Clock, BookOpen,
  TrendingUp, ClipboardList, GraduationCap,
} from "lucide-react";
import axiosInstance from "@/src/lib/axiosInstance";



const MONTH_BN = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর",
];

const STATUS_BN = { PRESENT: "উপস্থিত", ABSENT: "অনুপস্থিত", LATE: "দেরি", LEAVE: "ছুটি" };

const GRADE_COLOR = {
  "A+": "text-emerald-600", A: "text-emerald-500", "A-": "text-teal-600",
  B: "text-blue-600", C: "text-amber-600", D: "text-orange-500", F: "text-red-600",
};

const GRADE_BG = {
  "A+": "bg-emerald-50 border-emerald-200 text-emerald-700",
  A: "bg-emerald-50 border-emerald-200 text-emerald-600",
  "A-": "bg-teal-50 border-teal-200 text-teal-700",
  B: "bg-blue-50 border-blue-200 text-blue-700",
  C: "bg-amber-50 border-amber-200 text-amber-700",
  D: "bg-orange-50 border-orange-200 text-orange-600",
  F: "bg-red-50 border-red-200 text-red-600",
};


const EXAM_TYPE_BN = {
  MIDTERM: "মধ্যবর্ষ", FINAL: "চূড়ান্ত", UNIT_TEST: "ইউনিট টেস্ট",
  QUARTERLY: "ত্রৈমাসিক", HALF_YEARLY: "অর্ধবার্ষিক", YEARLY: "বার্ষিক",
  WEEKLY_TEST: "সাপ্তাহিক", MOCK: "মক", OTHER: "অন্যান্য",
};


//-------- Skeleton for loading state -------- 
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

// ------- custom bar tooltip ------

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

const StudentDashboardPage = () => {

  const [studentId, setStudentId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- fetch -----


  // Student ID will be fetched from /me endpoint
  useEffect(() => {

    const fetchStudentId = async () => {
      try {
        const res = await axiosInstance.get("/students/me");
        const sid = res.data?.data?.id;
        if (sid) {
          setStudentId(sid);
        } else {
          setError("শিক্ষার্থী তথ্য পাওয়া যায়নি।");
        }
      } catch {
        setError("শিক্ষার্থী তথ্য লোড করতে সমস্যা হয়েছে।");
      }
    };

    fetchStudentId();

  }, [studentId])

  const fetchAll = async () => {
    if (!studentId) return;
    setIsLoading(true);
    setError(null);
    try {
      const [profileRes, attendanceRes, examsRes] = await Promise.allSettled([
        axiosInstance.get(`/students/me`),
        axiosInstance.get(`/attendance/student/${studentId}`),
        axiosInstance.get("/results/exams?limit=200"),
      ]);

      // console.log(examsRes);
      // console.log(profileRes);
      // console.log(attendanceRes);


      // console.log(profileRes.value.data?.data);

      const profileData = profileRes.status === "fulfilled" ? profileRes.value.data?.data : null;
      // console.log(profileData)
      const attendanceData = attendanceRes.status === "fulfilled" ? attendanceRes.value.data?.data.records || [] : [];

      const examsData = examsRes.status === "fulfilled" ? examsRes.value.data?.data || [] : [];

      setProfile(profileData);
      setAttendance(attendanceData);
      setExams(examsData);

      // fetch results for section's exams
      if (profileData) {
        // console.log(profileData);
        const sid = profileData?.enrollments[0]?.section?.id;
        // console.log(sid);
        // console.log(examsData);
        if (sid) {
          const sectionExams = examsData.filter((e) => e.section?.id === sid).slice(0, 6);
          // console.log(sectionExams);
          // console.log(studentId);
          const fetched = await Promise.allSettled(
            sectionExams.map((e) =>
              axiosInstance.get(`/results/student/${studentId}/exam/${e.id}`)
            )
          );

          // console.log(fetched);

          fetched.forEach((r) => {
            if (r.status === "fulfilled" && r.value?.data?.data) {
              results.push(r.value.data.data);
            } else if (r.status === "rejected") {
              console.error("Failed:", r.reason);
            }
          });

          setResults(results);

          // console.log(results);


        }
      }
    } 
    catch (error) {
      console.log(error);
      setError("তথ্য লোড করতে সমস্যা হয়েছে।");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [studentId]);

  // console.log(exams);

  // console.log(profile);



  const stats = useMemo(() => {
    const total = attendance.length;
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
      const rows = attendance.filter((a) => {
        const ad = new Date(a.date);
        return ad.getMonth() === m && ad.getFullYear() === y;
      });
      const c = { PRESENT: 0, LATE: 0, ABSENT: 0 };
      rows.forEach((r) => { if (c[r.status] !== undefined) c[r.status]++; });
      return { month: MONTH_BN[m], ...c };
    });
  }, [attendance]);

  const today = new Date(); today.setHours(0, 0, 0, 0);

  const enrollment = profile?.enrollments[0];
  // console.log(enrollment);
  const sectionId = enrollment?.section?.id;

  const upcomingExams = exams
    .filter((e) => e.section?.id === sectionId && new Date(e.startDate) >= today)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 5);

  const latestResult = results[results.length - 1];
  // console.log(latestResult);
  const latestGPA = latestResult?.overallResult?.averageGPA ?? null;
  // console.log(latestGPA);
  const latestGrade = latestResult?.overallResult?.overallGrade ?? "—";
  // console.log(latestGrade);
  const recentAttendance = [...attendance].reverse().slice(0, 7);
  // console.log(recentAttendance);



  return (
    <div className="space-y-6 pb-8">

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* -- greeting banner -- */}
      {!isLoading && profile && (
        <div className="bg-gradient-to-r from-violet-50 to-white border border-violet-100 rounded-2xl px-6 py-4 flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-base font-bold text-violet-800">
              স্বাগতম, {profile.fullNameBangla || profile.fullNameEnglish}
            </p>
            <p className="text-sm text-violet-500 mt-0.5">
              {enrollment
                ? `${enrollment.section?.class?.name || ""} — সেকশন ${enrollment.section?.name || ""} · রোল নং ${enrollment.rollNumber}`
                : "ভর্তি তথ্য পাওয়া যায়নি"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-violet-100 rounded-xl flex items-center justify-center">
              <GraduationCap size={16} className="text-violet-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-700">{profile.studentCode}</p>
              <p className="text-xs text-gray-400">শিক্ষার্থী কোড</p>
            </div>
          </div>
        </div>
      )}

      {/* -- stat cards -- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            {/* Present rate */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <CalendarCheck size={17} className="text-emerald-600" />
                </div>
                <p className="text-sm font-bold text-gray-700">উপস্থিতির হার</p>
              </div>
              <p className="text-3xl font-bold text-emerald-600">{stats.pct}%</p>
              <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full transition-all"
                  style={{ width: `${stats.pct}%` }} />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {stats.PRESENT} উপস্থিত · {stats.total} মোট দিন
              </p>
            </div>

            {/* Absent */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center">
                  <CalendarX size={17} className="text-red-500" />
                </div>
                <p className="text-sm font-bold text-gray-700">অনুপস্থিতি</p>
              </div>
              <p className="text-3xl font-bold text-red-500">{stats.ABSENT}</p>
              <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-400 rounded-full transition-all"
                  style={{ width: stats.total ? `${(stats.ABSENT / stats.total) * 100}%` : "0%" }} />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {stats.total ? Math.round((stats.ABSENT / stats.total) * 100) : 0}% অনুপস্থিত
              </p>
            </div>

            {/* Late */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Clock size={17} className="text-amber-600" />
                </div>
                <p className="text-sm font-bold text-gray-700">দেরিতে উপস্থিতি</p>
              </div>
              <p className="text-3xl font-bold text-amber-600">{stats.LATE}</p>
              <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full transition-all"
                  style={{ width: stats.total ? `${(stats.LATE / stats.total) * 100}%` : "0%" }} />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {stats.total ? Math.round((stats.LATE / stats.total) * 100) : 0}% দেরি
              </p>
            </div>

            {/* Latest GPA */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center">
                  <TrendingUp size={17} className="text-violet-600" />
                </div>
                <p className="text-sm font-bold text-gray-700">সর্বশেষ GPA</p>
              </div>
              <p className={`text-3xl font-bold ${latestGPA !== null ? (GRADE_COLOR[latestGrade] || "text-violet-600") : "text-gray-400"}`}>
                {latestGPA ?? "—"}
              </p>
              <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-violet-400 rounded-full transition-all"
                  style={{ width: latestGPA !== null ? `${(latestGPA / 5) * 100}%` : "0%" }} />
              </div>
              <p className="text-xs text-gray-400 mt-1">গ্রেড: {latestGrade} · ৫.০ এর মধ্যে</p>
            </div>
          </>
        )}
      </div>

      {/* -- charts row -- */}
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
          {isLoading ? (
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
                  <Bar dataKey="PRESENT" name="উপস্থিত" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="LATE" name="দেরি" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="ABSENT" name="অনুপস্থিত" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-2 text-xs text-gray-500">
                {[["#7c3aed", "উপস্থিত"], ["#f59e0b", "দেরি"], ["#ef4444", "অনুপস্থিত"]].map(([c, l]) => (
                  <span key={l} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: c }} />
                    {l}
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
              <ClipboardList size={16} className="text-blue-600" />
            </div>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : upcomingExams.length === 0 ? (
            <div className="h-52 flex flex-col items-center justify-center text-gray-400 gap-2">
              <ClipboardList size={32} className="text-gray-200" />
              <p className="text-sm">কোনো আসন্ন পরীক্ষা নেই</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {upcomingExams.map((exam) => {
                const start = new Date(exam.startDate);
                const daysLeft = Math.ceil((start - today) / 86400000);
                const urgency = daysLeft <= 3
                  ? "border-red-200 text-red-600 bg-red-50"
                  : daysLeft <= 7
                    ? "border-amber-200 text-amber-600 bg-amber-50"
                    : "border-blue-200 text-blue-600 bg-blue-50";
                return (
                  <div key={exam.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100/60 transition-colors">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{exam.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {EXAM_TYPE_BN[exam.type] || exam.type} · {start.toLocaleDateString("bn-BD", { day: "numeric", month: "long" })}
                      </p>
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

      {/* --- bottom row: recent attendance + results ---*/}
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
          {isLoading ? (
            <div className="space-y-2">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="h-10 bg-gray-50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : recentAttendance.length === 0 ? (
            <div className="h-40 flex flex-col items-center justify-center text-gray-400 gap-2">
              <CalendarCheck size={28} className="text-gray-200" />
              <p className="text-sm">কোনো তথ্য নেই</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentAttendance.map((a, idx) => {
                // console.log(a);
                const statusStyle = {
                  PRESENT: "border-emerald-200 text-emerald-700 bg-emerald-50",
                  ABSENT: "border-red-200 text-red-600 bg-red-50",
                  LATE: "border-amber-200 text-amber-700 bg-amber-50",
                  LEAVE: "border-gray-200 text-gray-600 bg-gray-100",
                }[a.status] || "border-gray-200 text-gray-600 bg-gray-100";
                const d = new Date(a.date);
                return (
                  <div key={idx} className="flex items-center justify-between py-2.5 hover:bg-gray-50/50">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {d.toLocaleDateString("bn-BD", { weekday: "long", day: "numeric", month: "long" }).replace(' ', ', ')}
                      </p>
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
              <BookOpen size={16} className="text-violet-600" />
            </div>
          </div>
          {isLoading ? (
            <div className="space-y-2">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="h-40 flex flex-col items-center justify-center text-gray-400 gap-2">
              <BookOpen size={28} className="text-gray-200" />
              <p className="text-sm">কোনো ফলাফল পাওয়া যায়নি</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {[...results].reverse().slice(0, 5).map((r, i) => {
                const gpa = r?.overallResult?.averageGPA ?? "—";
                const grade = r?.overallResult?.overallGrade ?? "—";
                const examName = r?.exam?.name ?? `পরীক্ষা ${i + 1}`;

                const gradeStyle =
                  GRADE_BG[grade] || "bg-gray-50 border-gray-200 text-gray-600";

                return (
                  <div
                    key={r?.exam?.id ?? i}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100/60 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {examName}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        GPA: {gpa} / 5 এর মধ্যে
                      </p>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border ${gradeStyle}`}
                    >
                      {grade}
                    </span>
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


export default StudentDashboardPage;