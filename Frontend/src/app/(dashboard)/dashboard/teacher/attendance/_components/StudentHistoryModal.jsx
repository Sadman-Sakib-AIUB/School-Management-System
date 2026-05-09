import axiosInstance from '@/src/lib/axiosInstance';
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

// Percentage color helper
const pctColor = (pct) =>
  pct >= 85 ? "text-emerald-600" : pct >= 65 ? "text-amber-600" : "text-red-500";

const StudentHistoryModal = ({ student, onClose }) => {

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!student?.studentId) return;
    setIsLoading(true);
    axiosInstance.get(`/attendance/student/${student.studentId}`)
      .then((res) =>{
        setData(res.data?.data);
        setError(null);
      } )
      .catch(() => setError("ইতিহাস লোড করতে ব্যর্থ হয়েছে।"))
      .finally(() => setIsLoading(false));

    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [student?.studentId]);
 
  const STATUS_BN = { PRESENT: "উপস্থিত", ABSENT: "অনুপস্থিত", LATE: "লেট", LEAVE: "ছুটি" };
  const STATUS_STYLE = {
    PRESENT: "bg-emerald-100 text-emerald-700",
    ABSENT: "bg-red-100 text-red-600",
    LATE: "bg-amber-100 text-amber-700",
    LEAVE: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">
      <div className="bg-white w-full max-w-lg max-h-[88vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-white shrink-0">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{student?.studentName}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{student?.studentCode} · উপস্থিতির ইতিহাস</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading && (
            <div className="p-6 space-y-3">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <AlertCircle size={24} className="text-red-400 mb-3" />
              <p className="text-sm text-gray-600">{error}</p>
            </div>
          )}

          {data && !isLoading && (
            <div className="p-6 space-y-5">
              {/* Stats row */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "উপস্থিত", val: data.statistics?.present, color: "text-emerald-600", bg: "bg-emerald-50" },
                  { label: "অনুপস্থিত", val: data.statistics?.absent, color: "text-red-600", bg: "bg-red-50" },
                  { label: "লেট", val: data.statistics?.late, color: "text-amber-600", bg: "bg-amber-50" },
                  { label: "শতাংশ", val: `${data.statistics?.percentage ?? 0}%`, color: pctColor(data.statistics?.percentage ?? 0), bg: "bg-violet-50" },
                ].map((item, i) => (
                  <div key={i} className={`${item.bg} rounded-2xl p-3 text-center`}>
                    <p className={`text-xl font-bold ${item.color}`}>{item.val ?? 0}</p>
                    <p className={`text-xs font-medium ${item.color} opacity-80 mt-0.5`}>{item.label}</p>
                  </div>
                ))}
              </div>

              {/* Records */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  বিস্তারিত রেকর্ড ({data.records?.length ?? 0} দিন)
                </p>
                {data.records?.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6">কোনো রেকর্ড নেই।</p>
                ) : (
                  <div className="space-y-2">
                    {data.records?.map((rec, i) => (
                      <div key={i} className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl">
                        <div>
                          <p className="text-sm font-semibold text-gray-700">
                            {/* {new Date(rec.date).toLocaleDateString("bn-BD", { weekday: "short", month: "long", day: "numeric" }).replace(/,/, " ")} */}
                            {`${new Date(rec.date).toLocaleDateString("bn-BD", { weekday: "short" })}, ${new Date(rec.date).toLocaleDateString("bn-BD", { day: "numeric", month: "long" })}`}

                          </p>
                          {rec.remarks && <p className="text-xs text-gray-400 mt-0.5">{rec.remarks}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-gray-400">{rec.section}</p>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_STYLE[rec.status] ?? "bg-gray-100 text-gray-600"}`}>
                            {STATUS_BN[rec.status] ?? rec.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentHistoryModal;