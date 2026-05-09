"use client";
import { useState, useEffect } from "react";
import {
  Users, GraduationCap, BookOpen, LayoutGrid,
  TrendingUp, UserCheck, UserX, RefreshCw,
  Clock,
  Sun, CloudSun, Moon,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
  LineChart, Line, CartesianGrid,
} from "recharts";
import axiosInstance from "../../../../../lib/axiosInstance";
import CustomTooltip from "./CustomTooltip";
import PieTooltip from "./PieTooltip";
import SkeletonCard from "./SkeletonCard";
import StatCard from "./StatCard";

// ---------------- HELPERS -----------------
const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("bn-BD", { month: "short", day: "numeric" });
};

const GENDER_LABEL = { MALE: "পুরুষ", FEMALE: "মহিলা", OTHER: "অন্যান্য" };

const SHIFT_CONFIG = {
  MORNING: { label: "সকাল", icon: Sun, color: "#f59e0b", bg: "bg-amber-50", text: "text-amber-700", bar: "#fbbf24" },
  DAY: { label: "দিন", icon: CloudSun, color: "#3b82f6", bg: "bg-blue-50", text: "text-blue-700", bar: "#60a5fa" },
  EVENING: { label: "বিকাল", icon: Moon, color: "#8b5cf6", bg: "bg-violet-50", text: "text-violet-700", bar: "#a78bfa" },
};

const ENROLL_STATUS_CONFIG = {
  ACTIVE: { label: "সক্রিয়", color: "#10b981", fill: "#d1fae5" },
  TRANSFERRED: { label: "স্থানান্তর", color: "#3b82f6", fill: "#dbeafe" },
  PASSED: { label: "পাশ", color: "#8b5cf6", fill: "#ede9fe" },
  DROPPED: { label: "ঝরে পড়া", color: "#ef4444", fill: "#fee2e2" },
};


const AdminOverviewPage = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const [teachersRes, studentsRes, classesRes, sectionsRes] = await Promise.all([
        axiosInstance.get("/teachers", { params: { limit: 100 } }),
        axiosInstance.get("/students", { params: { limit: 10, page: 1 } }),
        axiosInstance.get("/academic-classes", { params: { limit: 100 } }),
        axiosInstance.get("/sections", { params: { limit: 100 } }),
      ]);

      const teachers = teachersRes.data?.data || [];
      const teacherMeta = teachersRes.data?.meta;
      const students = studentsRes.data?.data || [];
      const studentMeta = studentsRes.data?.meta;
      const classes = classesRes.data?.data || [];
      const sections = sectionsRes.data?.data || [];

      // --------------- Teacher stats ---------------
      const activeTeachers = teachers.filter((t) => t.user?.isActive === "ACTIVE").length;
      const inactiveTeachers = teachers.length - activeTeachers;

      // Dept breakdown for bar chart
      const deptMap = {};
      teachers.forEach((t) => {
        const d = t.department || "অন্যান্য";
        deptMap[d] = (deptMap[d] || 0) + 1;
      });
      const deptData = Object.entries(deptMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([name, count]) => ({ name, count }));

      // --------------- Student stats ---------------
      const enrolled = students.filter((s) => s.currentEnrollment).length;
      const notEnrolled = students.length - enrolled;

      // Enrollment status breakdown
      const statusMap = { ACTIVE: 0, TRANSFERRED: 0, PASSED: 0, DROPPED: 0 };
      students.forEach((s) => {
        const st = s.currentEnrollment?.status;
        if (st && statusMap[st] !== undefined) statusMap[st]++;
      });
      const enrollStatusData = Object.entries(statusMap)
        .filter(([, v]) => v > 0)
        .map(([key, value]) => ({
          name: ENROLL_STATUS_CONFIG[key]?.label || key,
          value,
          color: ENROLL_STATUS_CONFIG[key]?.color || "#6b7280",
          fill: ENROLL_STATUS_CONFIG[key]?.fill || "#f3f4f6",
        }));

      // Monthly admissions (last 6 months from available data)
      const monthMap = {};
      students.forEach((s) => {
        if (!s.createdAt) return;
        const key = new Date(s.createdAt).toLocaleDateString("bn-BD", { month: "short", year: "numeric" });
        monthMap[key] = (monthMap[key] || 0) + 1;
      });
      const admissionTrend = Object.entries(monthMap)
        .slice(-6)
        .map(([month, count]) => ({ month, count }));

      // --------------- Section stats ---------------
      const shiftMap = { MORNING: 0, DAY: 0, EVENING: 0 };
      sections.forEach((s) => {
        if (s.shift && shiftMap[s.shift] !== undefined) shiftMap[s.shift]++;
      });
      const shiftData = Object.entries(shiftMap)
        .filter(([, v]) => v > 0)
        .map(([key, value]) => ({
          name: SHIFT_CONFIG[key]?.label || key,
          value,
          color: SHIFT_CONFIG[key]?.color || "#6b7280",
        }));

      const totalCapacity = sections.reduce((a, s) => a + (s.capacity || 0), 0);
      const totalEnrolled = sections.reduce((a, s) => a + (s.enrolledStudents || 0), 0);

      setData({
        teachers: { total: teacherMeta?.total || teachers.length, active: activeTeachers, inactive: inactiveTeachers, deptData },
        students: { total: studentMeta?.total || students.length, enrolled, notEnrolled, enrollStatusData, admissionTrend, recent: students.slice(0, 6) },
        classes: { total: classesRes.data?.meta?.total || classes.length },
        sections: { total: sectionsRes.data?.meta?.total || sections.length, shiftData, totalCapacity, totalEnrolled },
      });
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const d = data;

  return (
    <div className="space-y-6 pb-8">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">ড্যাশবোর্ড ওভারভিউ</h2>
          {lastUpdated && (
            <p className="text-xs text-gray-400 mt-1">
              সর্বশেষ আপডেট: {lastUpdated.toLocaleTimeString("bn-BD")}
            </p>
          )}
        </div>
        <button
          onClick={fetchAll}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 disabled:opacity-40 transition-colors"
        >
          <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />
          রিফ্রেশ
        </button>
      </div>

      {/* -- Stat cards -- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard
              icon={Users} label="মোট শিক্ষক"
              value={d?.teachers.total}
              sub={`এক্টিভ: ${d?.teachers.active} · ইনএক্টিভ: ${d?.teachers.inactive}`}
              iconBg="bg-emerald-100" iconColor="text-emerald-600" accent="bg-emerald-400"
            />
            <StatCard
              icon={GraduationCap} label="মোট শিক্ষার্থী"
              value={d?.students.total}
              sub={`ভর্তি: ${d?.students.enrolled} · অপেক্ষমান: ${d?.students.notEnrolled}`}
              iconBg="bg-violet-100" iconColor="text-violet-600" accent="bg-violet-400"
            />
            <StatCard
              icon={BookOpen} label="একাডেমিক ক্লাস"
              value={d?.classes.total}
              sub="মোট নিবন্ধিত ক্লাস"
              iconBg="bg-blue-100" iconColor="text-blue-600" accent="bg-blue-400"
            />
            <StatCard
              icon={LayoutGrid} label="মোট সেকশন"
              value={d?.sections.total}
              sub={`ধারণক্ষমতা: ${d?.sections.totalCapacity} · ভর্তি: ${d?.sections.totalEnrolled}`}
              iconBg="bg-amber-100" iconColor="text-amber-600" accent="bg-amber-400"
            />
          </>
        )}
      </div>

      {/* -- Charts row 1: Teacher dept bar + Section shift pie -- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Teacher by department — Bar chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-gray-900">বিভাগ অনুযায়ী শিক্ষক</h3>
              <p className="text-xs text-gray-400 mt-0.5">প্রতিটি বিভাগে শিক্ষকের সংখ্যা</p>
            </div>
            <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Users size={16} className="text-emerald-600" />
            </div>
          </div>
          {isLoading ? (
            <div className="h-52 bg-gray-50 rounded-xl animate-pulse" />
          ) : d?.teachers.deptData.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-sm text-gray-400">তথ্য নেই</div>
          ) : (
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={d.teachers.deptData} barSize={28} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f9fafb" }} />
                <Bar dataKey="count" name="শিক্ষক" radius={[6, 6, 0, 0]}>
                  {d.teachers.deptData.map((_, i) => (
                    <Cell key={i} fill={["#34d399", "#60a5fa", "#a78bfa", "#fb923c", "#f472b6", "#2dd4bf"][i % 6]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Section shift — Pie/Donut chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-gray-900">শিফট অনুযায়ী সেকশন</h3>
              <p className="text-xs text-gray-400 mt-0.5">সকাল / দিন / বিকাল বিভাজন</p>
            </div>
            <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center">
              <LayoutGrid size={16} className="text-amber-600" />
            </div>
          </div>
          {isLoading ? (
            <div className="h-52 bg-gray-50 rounded-xl animate-pulse" />
          ) : d?.sections.shiftData.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-sm text-gray-400">তথ্য নেই</div>
          ) : (
            <ResponsiveContainer width="100%" height={210}>
              <PieChart>
                <Pie
                  data={d.sections.shiftData}
                  cx="50%" cy="50%"
                  innerRadius={55} outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {d.sections.shiftData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend
                  formatter={(value) => <span className="text-xs font-semibold text-gray-600">{value}</span>}
                  iconType="circle" iconSize={8}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── Charts row 2: Enrollment status donut + Admission trend line ── */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-4"> */}

      {/* Enrollment status — Donut */}
      {/* <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-gray-900">ভর্তির স্ট্যাটাস বিভাজন</h3>
              <p className="text-xs text-gray-400 mt-0.5">সক্রিয়, পাশ, ঝরে পড়া ইত্যাদি</p>
            </div>
            <div className="w-8 h-8 bg-violet-100 rounded-xl flex items-center justify-center">
              <GraduationCap size={16} className="text-violet-600" />
            </div>
          </div>
          {isLoading ? (
            <div className="h-52 bg-gray-50 rounded-xl animate-pulse" />
          ) : !d?.students.enrollStatusData.length ? (
            <div className="h-52 flex items-center justify-center text-sm text-gray-400">ভর্তি তথ্য নেই</div>
          ) : (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="55%" height={200}>
                <PieChart>
                  <Pie data={d.students.enrollStatusData} cx="50%" cy="50%"
                    innerRadius={50} outerRadius={78} paddingAngle={3} dataKey="value">
                    {d.students.enrollStatusData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2.5">
                {d.students.enrollStatusData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }} />
                      <span className="text-xs font-medium text-gray-600">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div> */}

      {/* Admission trend — Line chart */}
      {/* <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-gray-900">ভর্তির ট্রেন্ড</h3>
              <p className="text-xs text-gray-400 mt-0.5">সাম্প্রতিক ভর্তির ইতিহাস</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
              <TrendingUp size={16} className="text-blue-600" />
            </div>
          </div>
          {isLoading ? (
            <div className="h-52 bg-gray-50 rounded-xl animate-pulse" />
          ) : !d?.students.admissionTrend.length ? (
            <div className="h-52 flex items-center justify-center text-sm text-gray-400">তথ্য নেই</div>
          ) : (
            <ResponsiveContainer width="100%" height={210}>
              <LineChart data={d.students.admissionTrend} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone" dataKey="count" name="ভর্তি"
                  stroke="#8b5cf6" strokeWidth={2.5}
                  dot={{ fill: "#8b5cf6", r: 4, strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 6, stroke: "#8b5cf6", strokeWidth: 2, fill: "#fff" }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div> */}

      {/* -- Recent admissions table -- */}
      {/* <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
          <div>
            <h3 className="font-bold text-gray-900">সাম্প্রতিক ভর্তি</h3>
            <p className="text-xs text-gray-400 mt-0.5">সর্বশেষ ভর্তি হওয়া শিক্ষার্থীরা</p>
          </div>
          <div className="w-8 h-8 bg-violet-100 rounded-xl flex items-center justify-center">
            <Clock size={16} className="text-violet-600" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {["শিক্ষার্থী", "কোড", "লিঙ্গ", "বর্তমান ভর্তি", "যোগ দিয়েছে"].map((h, i) => (
                  <th key={i} className="px-5 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading
                ? Array(5).fill(0).map((_, i) => (
                  <tr key={i}>{[1, 2, 3, 4, 5].map((j) => (
                    <td key={j} className="px-5 py-3.5">
                      <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    </td>
                  ))}</tr>
                ))
                : d?.students.recent.length === 0
                  ? (
                    <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-gray-400">কোনো শিক্ষার্থী নেই</td></tr>
                  )
                  : d.students.recent.map((s) => {
                    const initials = s.fullNameEnglish?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "S";
                    const enrollment = s.currentEnrollment;
                    return (
                      <tr key={s.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-xs shrink-0">
                              {initials}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 text-sm">{s.fullNameEnglish}</p>
                              <p className="text-xs text-gray-400">{s.fullNameBangla}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">{s.studentCode}</span>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-gray-600">{GENDER_LABEL[s.gender] || "—"}</td>
                        <td className="px-5 py-3.5">
                          {enrollment
                            ? <div>
                              <p className="text-sm font-semibold text-gray-800">{enrollment.section?.class?.name} — সেকশন {enrollment.section?.name}</p>
                              <p className="text-xs text-gray-400">রোল: {enrollment.rollNumber}</p>
                            </div>
                            : <span className="text-xs text-gray-400 italic">ভর্তি হয়নি</span>
                          }
                        </td>
                        <td className="px-5 py-3.5 text-sm text-gray-500">{formatDate(s.createdAt)}</td>
                      </tr>
                    );
                  })
              }
            </tbody>
          </table>
        </div>
      </div> */}

      {/* -- Teacher active/inactive + Section shift summary cards -- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Teacher active */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
              <UserCheck size={17} className="text-emerald-600" />
            </div>
            <p className="text-sm font-bold text-gray-700">এক্টিভ শিক্ষক</p>
          </div>
          {isLoading ? <div className="h-8 bg-gray-100 rounded animate-pulse" /> : (
            <>
              <p className="text-3xl font-bold text-emerald-600">{d?.teachers.active ?? "—"}</p>
              <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full transition-all"
                  style={{ width: d?.teachers.total ? `${(d.teachers.active / d.teachers.total) * 100}%` : "0%" }} />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {d?.teachers.total ? Math.round((d.teachers.active / d.teachers.total) * 100) : 0}% এক্টিভ
              </p>
            </>
          )}
        </div>

        {/* Teacher inactive */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center">
              <UserX size={17} className="text-red-500" />
            </div>
            <p className="text-sm font-bold text-gray-700">ইনএক্টিভ শিক্ষক</p>
          </div>
          {isLoading ? <div className="h-8 bg-gray-100 rounded animate-pulse" /> : (
            <>
              <p className="text-3xl font-bold text-red-500">{d?.teachers.inactive ?? "—"}</p>
              <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-400 rounded-full transition-all"
                  style={{ width: d?.teachers.total ? `${(d.teachers.inactive / d.teachers.total) * 100}%` : "0%" }} />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {d?.teachers.total ? Math.round((d.teachers.inactive / d.teachers.total) * 100) : 0}% ইনএক্টিভ
              </p>
            </>
          )}
        </div>

        {/* Shift breakdown cards */}
        {isLoading
          ? [1, 2].map((i) => <SkeletonCard key={i} h="h-auto" />)
          : (d?.sections.shiftData || []).slice(0, 2).map((shift, i) => {
            const cfg = Object.values(SHIFT_CONFIG).find((c) => c.label === shift.name);
            const Icon = cfg?.icon || LayoutGrid;
            return (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${cfg?.bg || "bg-gray-100"}`}>
                    <Icon size={17} className={cfg?.text || "text-gray-500"} />
                  </div>
                  <p className="text-sm font-bold text-gray-700">{shift.name} শিফট</p>
                </div>
                <p className="text-3xl font-bold" style={{ color: shift.color }}>{shift.value}</p>
                <p className="text-xs text-gray-400 mt-1">টি সেকশন</p>
              </div>
            );
          })
        }
      </div>

    </div>
  );
}

export default AdminOverviewPage;