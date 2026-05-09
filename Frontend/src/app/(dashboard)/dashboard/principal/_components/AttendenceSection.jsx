"use client";
import { UserCheck, UserX, TrendingUp } from "lucide-react";


const CLASS_DATA = [
  { class: "ষষ্ঠ শ্রেণি",   total: 45, present: 41, absent: 4 },
  { class: "সপ্তম শ্রেণি",  total: 48, present: 45, absent: 3 },
  { class: "অষ্টম শ্রেণি",  total: 50, present: 43, absent: 7 },
  { class: "নবম শ্রেণি",    total: 52, present: 50, absent: 2 },
  { class: "দশম শ্রেণি",    total: 55, present: 49, absent: 6 },
];


const AttendanceSection = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* <h2 className="text-xl font-bold text-gray-900">উপস্থিতি পর্যালোচনা</h2> */}
        <span className="text-sm text-gray-500">আজকের তারিখ: <span className="font-bold"> {new Date().toLocaleDateString("bn-BD")}</span> </span>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { label: "মোট উপস্থিত",  value: "228", icon: UserCheck, color: "bg-emerald-100 text-emerald-700" },
          { label: "মোট অনুপস্থিত", value: "22",  icon: UserX,    color: "bg-red-100 text-red-600" },
          { label: "গড় উপস্থিতি",  value: "91%", icon: TrendingUp, color: "bg-violet-100 text-violet-700" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div> 
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h3 className="font-semibold text-gray-800">শ্রেণিভিত্তিক উপস্থিতি</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {CLASS_DATA.map((row, i) => {
            const pct = Math.round((row.present / row.total) * 100);
            return (
              <div key={i} className="px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-800">{row.class}</span>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="text-emerald-600 font-semibold">{row.present} উপস্থিত</span>
                    <span className="text-red-500 font-semibold">{row.absent} অনুপস্থিত</span>
                    <span className="font-bold text-gray-700">{pct}%</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AttendanceSection;