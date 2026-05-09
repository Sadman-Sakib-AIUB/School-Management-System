"use client";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/src/store/slices/authSlice";
import {
  BookOpen, Users, ClipboardList, CalendarDays,
  CheckCircle2, XCircle, Bell, Clock, TrendingUp,
  ChevronRight, MapPin, BookMarked, Award,
  RefreshCw,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell,
  LineChart, Line,
  PieChart, Pie, Legend,
} from "recharts";
import StatCard from "./StatCard";
import SectionHeader from "./SectionHeader";

// ------------------ DEMO DATA ------------------

const STAT_CARDS = [
  {
    id: "classes",
    label: "নির্ধারিত ক্লাস",
    value: "12",
    sub: "৩টি ভিন্ন সেকশনে",
    icon: BookOpen,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    accent: "bg-violet-500",
    trend: "+2 এই মাসে",
    trendUp: true,
  },
  {
    id: "students",
    label: "মোট শিক্ষার্থী",
    value: "138",
    sub: "৩টি সেকশন মিলিয়ে",
    icon: Users,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    accent: "bg-emerald-500",
    trend: "+6 নতুন ভর্তি",
    trendUp: true,
  },
  {
    id: "exams",
    label: "আসন্ন পরীক্ষা",
    value: "4",
    sub: "পরবর্তী ৩০ দিনে",
    icon: ClipboardList,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    accent: "bg-amber-500",
    trend: "২টি এই সপ্তাহে",
    trendUp: null,
  },
  {
    id: "attendance",
    label: "উপস্থিতি হার",
    value: "87%",
    sub: "এই মাসে",
    icon: TrendingUp,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    accent: "bg-blue-500",
    trend: "+3% গত মাসের তুলনায়",
    trendUp: true,
  },
];

const MONTHLY_CLASSES = [
  { month: "সেপ্টেম্বর", taken: 18, missed: 2 },
  { month: "অক্টোবর", taken: 22, missed: 1 },
  { month: "নভেম্বর", taken: 19, missed: 3 },
  { month: "ডিসেম্বর", taken: 24, missed: 0 },
  { month: "জানুয়ারি", taken: 20, missed: 2 },
  { month: "ফেব্রুয়ারি", taken: 21, missed: 1 },
];

const ATTENDANCE_TREND = [
  { week: "সপ্তাহ ১", rate: 82 },
  { week: "সপ্তাহ ২", rate: 85 },
  { week: "সপ্তাহ ৩", rate: 79 },
  { week: "সপ্তাহ ৪", rate: 88 },
  { week: "সপ্তাহ ৫", rate: 91 },
  { week: "সপ্তাহ ৬", rate: 87 },
  { week: "সপ্তাহ ৭", rate: 93 },
  { week: "সপ্তাহ ৮", rate: 89 },
];

const EXAM_STATUS = [
  { name: "সম্পন্ন", value: 8, color: "#10b981" },
  { name: "আসন্ন", value: 4, color: "#8b5cf6" },
  { name: "মূল্যায়ন বাকি", value: 3, color: "#f59e0b" },
];

const TODAY_SCHEDULE = [
  { time: "৮:০০ AM", subject: "গণিত", class: "ক্লাস ৭ — সেকশন A", room: "কক্ষ ২০১", done: true },
  { time: "১০:০০ AM", subject: "পদার্থবিজ্ঞান", class: "ক্লাস ৮ — সেকশন B", room: "কক্ষ ১০৫", done: true },
  { time: "১২:০০ PM", subject: "গণিত", class: "ক্লাস ৯ — সেকশন A", room: "কক্ষ ৩০৩", done: false },
  { time: "২:০০ PM", subject: "পদার্থবিজ্ঞান", class: "ক্লাস ৭ — সেকশন B", room: "কক্ষ ২০২", done: false },
];

const NOTICES = [
  {
    id: 1,
    title: "বার্ষিক পরীক্ষার রুটিন প্রকাশিত হয়েছে",
    time: "আজ, ৯:১৫ AM",
    tag: "পরীক্ষা",
    tagColor: "bg-violet-100 text-violet-700",
    isNew: true,
  },
  {
    id: 2,
    title: "শিক্ষক সভা — ১৫ মার্চ বিকাল ৩টায়",
    time: "গতকাল",
    tag: "সভা",
    tagColor: "bg-blue-100 text-blue-700",
    isNew: true,
  },
  {
    id: 3,
    title: "মার্চ মাসের বেতন বিতরণ শুরু হয়েছে",
    time: "২ দিন আগে",
    tag: "সাধারণ",
    tagColor: "bg-gray-100 text-gray-600",
    isNew: false,
  },
  {
    id: 4,
    title: "নতুন পাঠ্যক্রম নির্দেশিকা আপলোড করা হয়েছে",
    time: "৩ দিন আগে",
    tag: "শিক্ষা",
    tagColor: "bg-emerald-100 text-emerald-700",
    isNew: false,
  },
];

// ------------------ SUB-COMPONENTS ------------------

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 shadow-xl rounded-xl px-4 py-3">
      <p className="text-xs font-bold text-gray-500 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-semibold" style={{ color: p.color || p.fill }}>
          {p.name}: {p.value}{p.name === "উপস্থিতি হার" ? "%" : " টি"}
        </p>
      ))}
    </div>
  );
};

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 shadow-xl rounded-xl px-4 py-3">
      <p className="text-sm font-bold" style={{ color: payload[0].payload.color }}>{payload[0].name}</p>
      <p className="text-xs text-gray-500">{payload[0].value} টি পরীক্ষা</p>
    </div>
  );
};


const TeacherOverviewPage = () => {
  const user = useSelector(selectCurrentUser);
  const firstName = user?.fullNameEnglish?.split(" ")[0] || user?.username || "শিক্ষক";

  // Get current time greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "শুভ সকাল" : hour < 17 ? "শুভ অপরাহ্ন" : "শুভ সন্ধ্যা";

  const now = new Date();
  const todayLabel = now.toLocaleDateString("bn-BD", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="space-y-6 pb-8">

      {/* -- Welcome banner -- */}
      {/* <div className="bg-linear-to-r from-primary-600 to-primary-500 rounded-2xl px-7 py-6 text-white shadow-lg shadow-violet-200/60 relative overflow-hidden"> */}
      {/* decorative circles */}
      {/* <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute -bottom-8 right-16 w-20 h-20 bg-white/10 rounded-full" />
        <div className="relative">
          <p className="text-violet-200 text-sm font-medium mb-1">{greeting}, {firstName}!</p>
          <h2 className="text-2xl font-bold mb-1">আপনার ড্যাশবোর্ড</h2>
          <p className="text-violet-200 text-sm">{todayLabel}</p>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2 bg-white/15 rounded-xl px-4 py-2">
              <CalendarDays size={15} className="text-violet-200" />
              <span className="text-sm font-semibold">আজ {TODAY_SCHEDULE.filter(s => !s.done).length}টি ক্লাস বাকি</span>
            </div>
            <div className="flex items-center gap-2 bg-white/15 rounded-xl px-4 py-2">
              <ClipboardList size={15} className="text-violet-200" />
              <span className="text-sm font-semibold">৪টি আসন্ন পরীক্ষা</span>
            </div>
          </div>
        </div>
      </div> */}

      <div className=" flex justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">ড্যাশবোর্ড ওভারভিউ</h2>
          <p className="text-sm text-gray-400 mt-0.5">আপনার ক্লাস, পরীক্ষার সারসংক্ষেপ এবং অন্যান্য তথ্যের দ্রুত ওভারভিউ।</p>
        </div>

        <button
          // onClick={fetchAll}
          // disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 disabled:opacity-40 transition-colors"
        >
          <RefreshCw size={15} />
          রিফ্রেশ
        </button>
      </div>

      {/* -- Stat cards -- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card) => <StatCard key={card.id} {...card} />)}
      </div>

      {/* -- Charts row: Bar + Pie -- */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Bar chart — monthly classes (spans 3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <SectionHeader
            title="মাসিক ক্লাস সারসংক্ষেপ"
            sub="নেওয়া ও মিস করা ক্লাস"
            icon={BookOpen}
            iconBg="bg-violet-100"
            iconColor="text-violet-600"
          />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY_CLASSES} barSize={18} barGap={4} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f9fafb" }} />
              <Bar dataKey="taken" name="নেওয়া হয়েছে" fill="#8b5cf6" radius={[5, 5, 0, 0]} />
              <Bar dataKey="missed" name="মিস হয়েছে" fill="#e9d5ff" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="flex items-center gap-5 mt-3 px-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-violet-500" />
              <span className="text-xs text-gray-500 font-medium">নেওয়া হয়েছে</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-violet-200" />
              <span className="text-xs text-gray-500 font-medium">মিস হয়েছে</span>
            </div>
          </div>
        </div>

        {/* Donut — exam status (spans 2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <SectionHeader
            title="পরীক্ষার অবস্থা"
            sub="মোট ১৫টি পরীক্ষা"
            icon={ClipboardList}
            iconBg="bg-amber-100"
            iconColor="text-amber-600"
          />
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie
                data={EXAM_STATUS}
                cx="50%" cy="50%"
                innerRadius={45} outerRadius={68}
                paddingAngle={4}
                dataKey="value"
              >
                {EXAM_STATUS.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2.5 mt-1">
            {EXAM_STATUS.map((item, i) => (
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
      </div>

      {/* -- Line chart — attendance trend, full width -- */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <SectionHeader
          title="শিক্ষার্থীদের উপস্থিতির ধারা"
          sub="সাপ্তাহিক উপস্থিতির হার (%)"
          icon={TrendingUp}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={ATTENDANCE_TREND} margin={{ left: -15, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis
              domain={[70, 100]}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone" dataKey="rate" name="উপস্থিতি হার"
              stroke="#10b981" strokeWidth={2.5}
              dot={{ fill: "#10b981", r: 4, strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2, fill: "#fff" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* -- Bottom row: Today's schedule + Notices -- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Today's schedule */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <SectionHeader
            title="আজকের সময়সূচি"
            sub={`${TODAY_SCHEDULE.filter(s => s.done).length}/${TODAY_SCHEDULE.length} ক্লাস সম্পন্ন`}
            icon={CalendarDays}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
            action
          />
          <div className="space-y-3">
            {TODAY_SCHEDULE.map((item, i) => (
              <div
                key={i}
                className={`flex items-start gap-4 p-3.5 rounded-xl border transition-colors ${item.done
                  ? "bg-gray-50/70 border-gray-100 opacity-60"
                  : "bg-violet-50/50 border-violet-100"
                  }`}
              >
                {/* Status icon */}
                <div className="mt-0.5 shrink-0">
                  {item.done
                    ? <CheckCircle2 size={18} className="text-emerald-500" />
                    : <Clock size={18} className="text-violet-500" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm font-bold ${item.done ? "text-gray-500 line-through" : "text-gray-800"}`}>
                      {item.subject}
                    </p>
                    <span className="text-xs font-mono font-semibold text-gray-500 shrink-0">{item.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{item.class}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin size={11} className="text-gray-400 shrink-0" />
                    <span className="text-xs text-gray-400">{item.room}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notices */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <SectionHeader
            title="সাম্প্রতিক নোটিশ"
            sub={`${NOTICES.filter(n => n.isNew).length}টি নতুন বিজ্ঞপ্তি`}
            icon={Bell}
            iconBg="bg-amber-100"
            iconColor="text-amber-600"
            action
          />
          <div className="space-y-3">
            {NOTICES.map((notice) => (
              <div key={notice.id}
                className="flex items-start gap-3 p-3.5 rounded-xl border border-gray-100 hover:border-violet-100 hover:bg-violet-50/30 transition-colors cursor-pointer group"
              >
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${notice.isNew ? "bg-violet-500" : "bg-gray-300"}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-800 leading-snug group-hover:text-violet-700 transition-colors">
                      {notice.title}
                    </p>
                    {notice.isNew && (
                      <span className="text-xs font-bold bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full shrink-0">নতুন</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${notice.tagColor}`}>
                      {notice.tag}
                    </span>
                    <span className="text-xs text-gray-400">{notice.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default TeacherOverviewPage;