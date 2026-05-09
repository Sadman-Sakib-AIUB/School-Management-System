"use client";
import React, { useMemo, useState } from "react";

/* ---------------- Demo Events ---------------- */
const EVENTS = [
  {
    date: "2026-01-01",
    title: "নববর্ষের ছুটি",
    type: "holiday",
    description:
      "শুভ নববর্ষ! স্কুল বন্ধ থাকবে। সবাই স্কুলে আসবে মঙ্গল শোভাযাত্রা হবে এবং পান্তা ইলিশ খাওয়া হবে",
  },
  // { date: "2026-01-01", title: "বই বিতরন কর্মসুচি", type: "event" },
  { date: "2026-01-10", title: "ক্লাস শুরু", type: "event" },
  { date: "2026-01-15", title: "মাসিক পরীক্ষা", type: "exam" },
  { date: "2026-01-26", title: "বার্ষিক মিলাদ", type: "event" },
  { date: "2026-02-21", title: "মাতৃভাষা দিবস", type: "holiday" },
  { date: "2026-03-21", title: "Eid ul fitr", type: "holiday" },
];

/* ---------------- Config ---------------- */
const typeStyles = {
  holiday: "bg-red-100 text-red-700 border-red-300",
  exam: "bg-amber-100 text-amber-700 border-amber-300",
  event: "bg-emerald-100 text-emerald-700 border-emerald-300",
};

const months = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
];

const weekdays = ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহস্পতি", "শুক্র", "শনি"];

/* ---------------- Component ---------------- */
const AcademicCalendarMonth = () => {
  const [month, setMonth] = useState(0); // January
  const [selectedDay, setSelectedDay] = useState(null); // for popup details
  const year = 2026;
  const yearBangla = "২০২৬";

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [firstDay, daysInMonth]);

  const eventsByDate = useMemo(() => {
    const map = {};
    EVENTS.forEach((e) => {
      const day = new Date(e.date).getDate();
      const m = new Date(e.date).getMonth();
      if (m === month) {
        if (!map[day]) map[day] = [];
        map[day].push(e);
      }
    });
    return map;
  }, [month]);

  return (
    <section className="py-36 bg-slate-50">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-2">
              একাডেমিক <span className="text-primary-600">ক্যালেন্ডার</span>{" "}
              <span>{yearBangla}</span>
            </h2>
            <p className="text-slate-500 font-medium">
              শিক্ষা বর্ষের সকল আপডেট এখানে দেখুন
            </p>
          </div>

          <div className=" relative group">

            <select
              className="bg-white px-8 py-3 rounded-2xl border-none shadow-sm ring-slate-200 transition-all font-bold text-slate-700 cursor-pointer"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {months.map((m, i) => (
                <option key={i} value={i}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7 text-center font-bold text-slate-600 mb-3">
          {weekdays.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-3">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              onClick={() => day && setSelectedDay(day)}
              className={`min-h-[60px] bg-white rounded-xl border border-slate-300 p-2 cursor-pointer ${
                day ? "" : "bg-transparent border-none"
              }`}
            >
              {day && (
                <>
                  <div className="font-bold text-slate-700 mb-1">{day}</div>

                  <div className="space-y-1">
                    {(eventsByDate[day] || []).map((event, i) => (
                      <div
                        key={i}
                        className={`text-xs px-2 py-1 rounded-md border ${typeStyles[event.type]}`}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Modal Overlay */}
        {selectedDay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-3xl font-black text-slate-900">
                      {selectedDay} {months[month]}
                    </h3>
                    <p className="text-slate-500 font-bold uppercase tracking-wider">
                      {yearBangla} শিক্ষাবর্ষ
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedDay(null)}
                    className="bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  {eventsByDate[selectedDay]?.length > 0 ? (
                    eventsByDate[selectedDay].map((event, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-2xl border-l-8 shadow-sm ${typeStyles[event.type]}`}
                      >
                        <h4 className="font-bold text-lg">{event.title}</h4>
                        <p className="text-sm opacity-80">
                          {event.description || "বিস্তারিত কোনো তথ্য নেই"}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                      <p className="font-bold text-slate-400 italic">
                        এই দিনে কোনো ইভেন্ট নেই
                      </p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setSelectedDay(null)}
                  className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-red-600 transition-colors shadow-lg shadow-slate-200"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="flex gap-6 justify-center mt-10 text-sm font-semibold">
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 bg-red-400 rounded"></span> ছুটি
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 bg-amber-400 rounded"></span> পরীক্ষা
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 bg-emerald-400 rounded"></span> অনুষ্ঠান
          </span>
        </div>
      </div>
    </section>
  );
};

export default AcademicCalendarMonth;
