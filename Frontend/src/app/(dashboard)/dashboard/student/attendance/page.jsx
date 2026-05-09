"use client";

import { useEffect, useState, useMemo } from "react";

import {
  ChevronLeft, ChevronRight,
  CalendarCheck, CalendarX, Clock, Umbrella,
} from "lucide-react";
import axiosInstance from "@/src/lib/axiosInstance";


// ------ constants ------

const WEEKDAYS_BN = ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহ", "শুক্র", "শনি"];
const MONTHS_BN = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];

const STATUS_CONFIG = {
  PRESENT: { label: "উপস্থিত", icon: CalendarCheck, bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500", cell: "bg-emerald-50 border-emerald-200 text-emerald-700" },
  ABSENT: { label: "অনুপস্থিত", icon: CalendarX, bg: "bg-red-100", text: "text-red-600", border: "border-red-200", dot: "bg-red-500", cell: "bg-red-50 border-red-200 text-red-600" },
  LATE: { label: "দেরি", icon: Clock, bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500", cell: "bg-amber-50 border-amber-200 text-amber-700" },
  LEAVE: { label: "ছুটি", icon: Umbrella, bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-400", cell: "bg-blue-50 border-blue-200 text-blue-700" },
};

function toDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

// ------- skeleton ------

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



const StudentAttendancePage = () => {

  const [studentId, setStudentId] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  // current calendar month
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  // ------ fetch data -------
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
  // console.log(studentId);

  useEffect(() => {
    if (!studentId) return;

    const fetch = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get(`/attendance/student/${studentId}`);
        // console.log(res);
        setAttendance(res.data?.data.records || []);
      } catch {
        setError("উপস্থিতির তথ্য লোড করতে সমস্যা হয়েছে।");
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [studentId]);


  // ------ build lookup map --------
  const attendanceMap = useMemo(() => {
    const map = {};
    attendance.forEach((a) => {
      const key = toDateKey(new Date(a.date));
      map[key] = a;
    });
    // console.log(map);
    return map;
  }, [attendance]);

  // -------- monthly stats --------
  const monthStats = useMemo(() => {
    const c = { PRESENT: 0, ABSENT: 0, LATE: 0, LEAVE: 0 };
    attendance.forEach((a) => {
      const d = new Date(a.date);
      if (d.getFullYear() === viewYear && d.getMonth() === viewMonth) {

        // console.log(d.getMonth()); 

        if (c[a.status] !== undefined) c[a.status]++;
        // console.log([a]);
      }
    });
    const total = c.PRESENT + c.ABSENT + c.LATE + c.LEAVE;
    const pct = total ? Math.round(((c.PRESENT + c.LATE) / total) * 100) : 0;
    return { ...c, total, pct };
  }, [attendance, viewYear, viewMonth]);

  // overall stats
  const overallStats = useMemo(() => {
    const c = { PRESENT: 0, ABSENT: 0, LATE: 0, LEAVE: 0 };
    attendance.forEach((a) => { if (c[a.status] !== undefined) c[a.status]++; });
    const total = attendance.length;
    const pct = total ? Math.round(((c.PRESENT + c.LATE) / total) * 100) : 0;
    return { ...c, total, pct };
  }, [attendance]);

  // ── calendar grid ─────────────────────────────────────────────────────────
  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [viewYear, viewMonth]);

  // ------ navigation -------
  const prevMonth = () => {
    setSelectedDay(null);
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    setSelectedDay(null);
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };
  const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth();
  const selectedRecord = selectedDay
    ? attendanceMap[toDateKey(new Date(viewYear, viewMonth, selectedDay))]
    : null;


  return (
    <div className="space-y-6 pb-8">

      {/* --- page header --- */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">উপস্থিতি</h2>
        <p className="text-xs text-gray-400 mt-1">মাসভিত্তিক উপস্থিতির বিবরণ</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>
      )}

      {/* -- overall stat cards -- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />) : (
          <>
            {/* Present rate */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <CalendarCheck size={17} className="text-emerald-600" />
                </div>
                <p className="text-sm font-bold text-gray-700">সামগ্রিক হার</p>
              </div>
              <p className="text-3xl font-bold text-emerald-600">{overallStats.pct}%</p>
              <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full transition-all" style={{ width: `${overallStats.pct}%` }} />
              </div>
              <p className="text-xs text-gray-400 mt-1">{overallStats.PRESENT} উপস্থিত · {overallStats.total} দিন</p>
            </div>

            {/* Absent */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center">
                  <CalendarX size={17} className="text-red-500" />
                </div>
                <p className="text-sm font-bold text-gray-700">অনুপস্থিতি</p>
              </div>
              <p className="text-3xl font-bold text-red-500">{overallStats.ABSENT}</p>
              <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-400 rounded-full transition-all" style={{ width: overallStats.total ? `${(overallStats.ABSENT / overallStats.total) * 100}%` : "0%" }} />
              </div>
              <p className="text-xs text-gray-400 mt-1">{overallStats.total ? Math.round((overallStats.ABSENT / overallStats.total) * 100) : 0}% মোট অনুপস্থিত</p>
            </div>

            {/* Late */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Clock size={17} className="text-amber-600" />
                </div>
                <p className="text-sm font-bold text-gray-700">দেরিতে উপস্থিতি</p>
              </div>
              <p className="text-3xl font-bold text-amber-600">{overallStats.LATE}</p>
              <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: overallStats.total ? `${(overallStats.LATE / overallStats.total) * 100}%` : "0%" }} />
              </div>
              <p className="text-xs text-gray-400 mt-1">{overallStats.total ? Math.round((overallStats.LATE / overallStats.total) * 100) : 0}% মোট দেরি</p>
            </div>

            {/* Leave */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Umbrella size={17} className="text-blue-600" />
                </div>
                <p className="text-sm font-bold text-gray-700">ছুটি</p>
              </div>
              <p className="text-3xl font-bold text-blue-600">{overallStats.LEAVE}</p>
              <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400 rounded-full transition-all" style={{ width: overallStats.total ? `${(overallStats.LEAVE / overallStats.total) * 100}%` : "0%" }} />
              </div>
              <p className="text-xs text-gray-400 mt-1">{overallStats.total ? Math.round((overallStats.LEAVE / overallStats.total) * 100) : 0}% মোট ছুটি</p>
            </div>
          </>
        )}
      </div>

      {/* --- calendar + detail --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          {/* month nav */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
              <ChevronLeft size={18} />
            </button>
            <div className="text-center">
              <p className="text-base font-bold text-gray-900">{MONTHS_BN[viewMonth]}</p>
              <p className="text-xs text-gray-400">{viewYear}</p>
            </div>
            <button
              onClick={nextMonth}
              disabled={isCurrentMonth}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* weekday headers */}
          <div className="grid grid-cols-7 mb-2">
            {WEEKDAYS_BN.map((d) => (
              <div key={d} className="text-center text-xs font-bold text-gray-400 py-1">{d}</div>
            ))}
          </div>

          {/* days grid */}
          {isLoading ? (
            <div className="grid grid-cols-7 gap-1.5">
              {Array(35).fill(0).map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1.5">
              {calendarDays.map((day, idx) => {
                if (!day) return <div key={`empty-${idx}`} />;
                const dateKey = toDateKey(new Date(viewYear, viewMonth, day));
                const record = attendanceMap[dateKey];
                const isToday = toDateKey(today) === dateKey;
                const isSelected = selectedDay === day;
                const cfg = record ? STATUS_CONFIG[record.status] : null;

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(isSelected ? null : day)}
                    className={`relative h-10 rounded-xl text-sm font-semibold transition-all border flex items-center justify-center
                      ${cfg
                        ? `${cfg.cell} hover:opacity-80`
                        : "bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100"}
                      ${isSelected ? "ring-2 ring-violet-400 ring-offset-1" : ""}
                      ${isToday && !cfg ? "border-violet-300 bg-violet-50 text-violet-600" : ""}
                    `}
                  >
                    {day}
                    {isToday && (
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-violet-500 rounded-full border border-white" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* legend */}
          <div className="flex flex-wrap gap-3 mt-6 py-6 border-t border-gray-100">
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <span key={key} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className={`w-2.5 h-2.5 rounded-sm ${cfg.dot.replace("bg-", "bg-")}`} style={{}} />
                {cfg.label}
              </span>
            ))}

            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className={`w-2.5 h-2.5 rounded-sm bg-violet-500`} style={{}} />
              আজ
            </span>

          </div>


          {/* Box Type Legend / Indicator */}

          {/* <div className="flex flex-wrap gap-3 mt-2"> */}
            {/* {Object.entries(STATUS_CONFIG).map(([, cfg]) => null)} */}
            {/* cleaner legend */}
            {/* <div className="flex flex-wrap gap-4">
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <span key={key} className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-lg border ${cfg.cell}`}>
                  <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                  {cfg.label}
                </span>
              ))}
              <span className="flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-lg border border-violet-200 bg-violet-50 text-violet-600">
                <span className="w-2 h-2 rounded-full bg-violet-500" />
                আজ
              </span>
            </div> */}
          {/* </div> */}
        </div>

        {/* Side panel: month summary + selected day */}
        <div className="space-y-4">

          {/* Month summary */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-4 pb-2 border-b border-gray-100">
              {MONTHS_BN[viewMonth]} মাসের সারসংক্ষেপ
            </h3>
            {isLoading ? (
              <div className="space-y-3">
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="h-8 bg-gray-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : monthStats.total === 0 ? (
              <div className="h-28 flex flex-col items-center justify-center text-gray-400 gap-2">
                <CalendarCheck size={24} className="text-gray-200" />
                <p className="text-xs">এই মাসে কোনো তথ্য নেই</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                  const count = monthStats[key] || 0;
                  const pct = monthStats.total ? Math.round((count / monthStats.total) * 100) : 0;
                  const Icon = cfg.icon;
                  return (
                    <div key={key} className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${cfg.bg}`}>
                        <Icon size={13} className={cfg.text} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-gray-700">{cfg.label}</span>
                          <span className={`text-xs font-bold ${cfg.text}`}>{count} দিন</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${cfg.dot}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="pt-2 mt-1 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">মোট উপস্থিতির হার</span>
                    <span className="font-bold text-emerald-600">{monthStats.pct}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Selected day detail */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-100">
              নির্বাচিত দিন
            </h3>
            {!selectedDay ? (
              <div className="h-28 flex flex-col items-center justify-center text-gray-400 gap-2">
                <CalendarCheck size={24} className="text-gray-200" />
                <p className="text-xs text-center">ক্যালেন্ডার থেকে একটি দিন নির্বাচন করুন</p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-bold text-gray-800 mb-3">
                  {new Date(viewYear, viewMonth, selectedDay).toLocaleDateString("bn-BD", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </p>
                {selectedRecord ? (() => {
                  const cfg = STATUS_CONFIG[selectedRecord.status];
                  const Icon = cfg.icon;
                  return (
                    <div className={`rounded-xl border p-4 ${cfg.bg} ${cfg.border}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon size={16} className={cfg.text} />
                        <span className={`text-sm font-bold ${cfg.text}`}>{cfg.label}</span>
                      </div>
                      {selectedRecord.remarks && (
                        <p className="text-xs text-gray-600 mt-1">
                          <span className="font-semibold">মন্তব্য:</span> {selectedRecord.remarks}
                        </p>
                      )}
                      {selectedRecord.checkInTime && (
                        <p className="text-xs text-gray-600 mt-1">
                          <span className="font-semibold">প্রবেশের সময়:</span> {selectedRecord.checkInTime}
                        </p>
                      )}
                    </div>
                  );
                })() : (
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-center">
                    <p className="text-xs text-gray-400">এই দিনের কোনো রেকর্ড নেই</p>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}


export default StudentAttendancePage;