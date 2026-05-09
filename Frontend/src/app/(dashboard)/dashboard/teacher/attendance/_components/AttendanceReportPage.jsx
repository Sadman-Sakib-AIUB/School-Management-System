"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, BarChart2, Users, AlertCircle, RefreshCw,
  ChevronDown, ChevronUp, TrendingUp, TrendingDown,
  Minus, Calendar, BookOpen, Eye, X,
} from "lucide-react";
import axiosInstance from "@/src/lib/axiosInstance";
import { useTeacherSections } from "@/src/hooks/useTeachersSections";
import StudentHistoryModal from "./StudentHistoryModal";


// ----------------------------- HELPERS -----------------------------
const statusColor = (status) => {
  const s = status?.toLowerCase();
  console.log(s);
  if (s === "good") return { bg: "bg-emerald-100", text: "text-emerald-700", bar: "bg-emerald-500" };
  if (s === "average") return { bg: "bg-amber-100", text: "text-amber-700", bar: "bg-amber-500" };
  if (s === "critical") return { bg: "bg-red-100", text: "text-red-600", bar: "bg-red-500" };
  return { bg: "bg-gray-100", text: "text-gray-600", bar: "bg-gray-400" };
};

const pctColor = (pct) =>
  pct >= 85 ? "text-emerald-600" : pct >= 65 ? "text-amber-600" : "text-red-500";

const SkeletonRow = () => (
  <tr>{[1, 2, 3, 4, 5, 6, 7].map((i) => (
    <td key={i} className="px-5 py-4">
      <div className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: `${40 + (i * 17) % 50}%` }} />
    </td>
  ))}</tr>
);

export default function AttendanceReportPage() {
  const router = useRouter();

  const { sections, isLoading: sectionsLoading, error: sectionsError, isFallback } = useTeacherSections();
  const [selectedSectionId, setSelectedSectionId] = useState("");

  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [sortField, setSortField] = useState("rollNumber");
  const [sortDir, setSortDir] = useState("asc");
  const [viewStudent, setViewStudent] = useState(null);



  // ----------- Auto select first section when hook loads ------------
  useEffect(() => {
    if (sections.length > 0 && !selectedSectionId) {
      setSelectedSectionId(sections[0].id);
    }
  }, [sections, selectedSectionId]);

  // ------------ Load report -------------------
  const loadReport = useCallback(async () => {
    if (!selectedSectionId) return;
    setIsLoading(true); setError(null); setReport(null);
    try {
      const res = await axiosInstance.get(`/attendance/section/${selectedSectionId}/report`);
      setReport(res.data?.data);
    } catch (err) {
      setError(err.response?.data?.message ?? "রিপোর্ট লোড করতে ব্যর্থ হয়েছে।");
    } finally {
      setIsLoading(false);
    }
  }, [selectedSectionId]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  // ----------- Sort -------------------
  const handleSort = (field) => {
    if (sortField === field) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const sorted = [...(report?.students ?? [])].sort((a, b) => {
    let av = a[sortField], bv = b[sortField];
    if (sortField === "rollNumber") { av = Number(av); bv = Number(bv); }
    if (typeof av === "number") return sortDir === "asc" ? av - bv : bv - av;
    return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
  });

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <Minus size={12} className="text-gray-300" />;
    return sortDir === "asc"
      ? <ChevronUp size={12} className="text-violet-500" />
      : <ChevronDown size={12} className="text-violet-500" />;
  };

  const ThSortable = ({ field, children }) => (
    <th
      onClick={() => handleSort(field)}
      className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer select-none hover:text-gray-700 group"
    >
      <div className="flex items-center gap-1.5">
        {children}
        <SortIcon field={field} />
      </div>
    </th>
  );

  return (
    <div className="space-y-5 pb-8">

      {/* -- Header -- */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/dashboard/teacher/attendance")}
            className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 border border-gray-200">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">উপস্থিতি রিপোর্ট</h2>
            <p className="text-sm text-gray-400 mt-0.5">সেকশনভিত্তিক মাসিক উপস্থিতির বিশ্লেষণ</p>
          </div>
        </div>
        <button onClick={loadReport} disabled={isLoading}
          className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500 disabled:opacity-40">
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* -- Section selector -- */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-56">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">সেকশন</label>
            {sectionsLoading ? (
              <div className="h-11 bg-gray-100 rounded-xl animate-pulse" />
            ) : (
              <select
                value={selectedSectionId}
                onChange={(e) => setSelectedSectionId(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-violet-400 text-gray-700 font-medium"
              >
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.class?.name ?? "ক্লাস"} — সেকশন {s.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Fallback notice */}
          {isFallback && !sectionsLoading && (
            <div className="w-full mt-0 flex items-center gap-2 text-xs text-amber-700 bg-amber-50 px-4 py-2.5 rounded-xl border border-amber-100">
              <span className="shrink-0">⚠</span>
              শিক্ষকের নির্ধারিত সেকশন API তে যোগ হয়নি। প্রতিষ্ঠানের সকল সেকশন দেখানো হচ্ছে।
            </div>
          )}

          {/* Report summary chips */}
          {report && (
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-violet-50 rounded-xl border border-violet-100">
                <BarChart2 size={15} className="text-violet-600" />
                <span className="text-sm font-bold text-violet-700">গড় উপস্থিতি: {report.sectionAverage}%</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200">
                <Users size={15} className="text-gray-500" />
                <span className="text-sm font-semibold text-gray-600">{report.students?.length ?? 0} জন শিক্ষার্থী</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200">
                <Calendar size={15} className="text-gray-500" />
                <span className="text-sm font-semibold text-gray-600">
                  {report.period?.startDate
                    ? new Date(report.period.startDate).toLocaleDateString("bn-BD", { month: "long", day: "numeric" })
                    : ""} —{" "}
                  {report.period?.endDate
                    ? new Date(report.period.endDate).toLocaleDateString("bn-BD", { month: "long", day: "numeric" })
                    : ""}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Error ── */}
      {error && !isLoading && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 px-5 py-4 rounded-2xl text-sm font-medium">
          <AlertCircle size={18} className="shrink-0" />
          {error}
        </div>
      )}

      {/* ── Section avg progress bar ── */}
      {report && !isLoading && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className={report.sectionAverage >= 75 ? "text-emerald-500" : "text-amber-500"} />
              <span className="text-sm font-bold text-gray-700">সেকশনের গড় উপস্থিতি</span>
            </div>
            <span className={`text-2xl font-bold ${pctColor(report.sectionAverage)}`}>
              {report.sectionAverage}%
            </span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${report.sectionAverage >= 85 ? "bg-emerald-500" :
                report.sectionAverage >= 65 ? "bg-amber-500" : "bg-red-500"
                }`}
              style={{ width: `${Math.min(report.sectionAverage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-xs text-gray-400">০%</span>
            <span className="text-xs text-red-400 font-medium">সতর্কতা: ৬৫%</span>
            <span className="text-xs text-emerald-400 font-medium">ভালো: ৮৫%</span>
            <span className="text-xs text-gray-400">১০০%</span>
          </div>
        </div>
      )}

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <h3 className="font-bold text-gray-800">শিক্ষার্থী অনুযায়ী বিবরণ</h3>
          <p className="text-xs text-gray-400">কলামে ক্লিক করে সাজান</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <ThSortable field="rollNumber">রোল</ThSortable>
                <ThSortable field="studentName">শিক্ষার্থী</ThSortable>
                <ThSortable field="present">উপস্থিত</ThSortable>
                <ThSortable field="absent">অনুপস্থিত</ThSortable>
                <ThSortable field="late">লেট</ThSortable>
                <ThSortable field="percentage">শতাংশ</ThSortable>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">স্ট্যাটাস</th>
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading
                ? Array(5).fill(0).map((_, i) => <SkeletonRow key={i} />)
                : sorted.length === 0 && !isLoading
                  ? (
                    <tr>
                      <td colSpan={8} className="px-5 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center">
                            <BarChart2 size={22} className="text-violet-400" />
                          </div>
                          <p className="text-sm font-medium text-gray-500">এই সেকশনের কোনো রিপোর্ট নেই</p>
                        </div>
                      </td>
                    </tr>
                  )
                  : sorted.map((stu) => {
                    const c = statusColor(stu.status);
                    const pct = stu.percentage ?? 0;
                    const initials = stu.studentName?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) ?? "S";
                    return (
                      <tr key={stu.studentId} className="hover:bg-gray-50/50 transition-colors">
                        {/* Roll */}
                        <td className="px-5 py-4">
                          <span className="font-mono text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                            {stu.rollNumber}
                          </span>
                        </td>
                        {/* Name */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-violet-100 rounded-xl flex items-center justify-center text-violet-700 font-bold text-xs shrink-0">
                              {initials}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">{stu.studentName}</p>
                              <p className="text-xs text-gray-400">{stu.studentCode}</p>
                            </div>
                          </div>
                        </td>
                        {/* Present */}
                        <td className="px-5 py-4">
                          <span className="text-sm font-bold text-emerald-600">{stu.present}</span>
                          <span className="text-xs text-gray-400"> দিন</span>
                        </td>
                        {/* Absent */}
                        <td className="px-5 py-4">
                          <span className="text-sm font-bold text-red-500">{stu.absent}</span>
                          <span className="text-xs text-gray-400"> দিন</span>
                        </td>
                        {/* Late */}
                        <td className="px-5 py-4">
                          <span className="text-sm font-bold text-amber-600">{stu.late}</span>
                          <span className="text-xs text-gray-400"> দিন</span>
                        </td>
                        {/* Pct + bar */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${c.bar}`}
                                style={{ width: `${Math.min(pct, 100)}%` }}
                              />
                            </div>
                            <span className={`text-sm font-bold ${pctColor(pct)}`}>{pct}%</span>
                          </div>
                        </td>
                        {/* Status */}
                        <td className="px-5 py-4">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${c.bg} ${c.text}`}>
                            {stu.status}
                          </span>
                        </td>
                        {/* History button */}
                        <td className="px-5 py-4">
                          <button
                            onClick={() => setViewStudent(stu)}
                            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            <Eye size={12} /> হিস্টোরি
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

      {/* ── Student history modal ── */}
      {viewStudent && (
        <StudentHistoryModal
          student={viewStudent}
          onClose={() => setViewStudent(null)}
        />
      )}
    </div>
  );
}