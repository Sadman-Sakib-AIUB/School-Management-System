"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ClipboardList, Search, Filter, RefreshCw, AlertCircle,
  ChevronLeft, ChevronRight, BookOpen, Plus,
  BarChart2,
} from "lucide-react";
import axiosInstance from "@/src/lib/axiosInstance";


// --------- CONSTANTS ----------
export const EXAM_TYPE_BN = {
  MIDTERM: "মিডটার্ম",
  FINAL: "ফাইনাল",
  WEEKLY_TEST: "সাপ্তাহিক টেস্ট",
  CLASS_TEST: "ক্লাস টেস্ট",

};
const TYPE_COLORS = {
  MIDTERM: "bg-violet-100 text-violet-700",
  FINAL: "bg-red-100 text-red-700",
  CLASS_TEST: "bg-blue-100 text-blue-700",
  WEEKLY_TEST: "bg-emerald-100 text-emerald-700",
};
const getStatus = (exam) => {
  const t = new Date()
  const s = new Date(exam.startDate)
  const e = new Date(exam.endDate);
  return t < s ? "UPCOMING" : t > e ? "COMPLETED" : "ONGOING";
};
const STATUS_CFG = {
  UPCOMING: { 
    label: "আসন্ন", 
    cls: "bg-blue-50 text-blue-700", 
    dot: "bg-blue-400" 
  },
  ONGOING: { 
    label: "চলমান", 
    cls: "bg-emerald-50 text-emerald-700", 
    dot: "bg-emerald-500" 
  },
  COMPLETED: { 
    label: "সম্পন্ন", 
    cls: "bg-gray-100 text-gray-600", 
    dot: "bg-gray-400" 
  },
};
const fmtDate = (iso) => iso
  ? new Date(iso).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" })
  : "—";

const ITEMS = 10;

const SkeletonRow = () => (
  <tr className="border-b border-gray-50">
    {[52, 28, 24, 36, 20, 22].map((w, i) => (
      <td key={i} className="px-5 py-4">
        <div className="h-4 bg-gray-100 rounded-lg animate-pulse" style={{ width: w * 3 }} />
      </td>
    ))}
  </tr>
);



const ResultsPage = () => {
  const router = useRouter();
  const [exams, setExams]           = useState([]);
  const [classes, setClasses]       = useState([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [error, setError]           = useState(null);
  const [page, setPage]             = useState(1);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch]           = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterType, setFilterType]   = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const fetchExams = useCallback(async () => {
    setIsLoading(true); setError(null);
    try {
      const res = await axiosInstance.get("/results/exams", { params: { limit: 200 } });
      setExams(res.data?.data ?? []);
    } catch { setError("পরীক্ষার তথ্য লোড করতে ব্যর্থ হয়েছে।"); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { fetchExams(); }, [fetchExams]);
  useEffect(() => {
    axiosInstance.get("/academic-classes", { params: { limit: 100 } })
      .then(r => setClasses(r.data?.data ?? [])).catch(() => {});
  }, []);
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const filtered = useMemo(() => {
    let list = exams;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(e => e.name?.toLowerCase().includes(q) ||
        e.section?.class?.name?.toLowerCase().includes(q));
    }
    if (filterClass)  list = list.filter(e => e.section?.class?.id === filterClass);
    if (filterType)   list = list.filter(e => e.type === filterType);
    if (filterStatus) list = list.filter(e => getStatus(e) === filterStatus);
    return list;
  }, [exams, search, filterClass, filterType, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS));
  const safePage   = Math.min(page, totalPages);
  const paginated  = filtered.slice((safePage - 1) * ITEMS, safePage * ITEMS);
  const hasFilter  = !!(search || filterClass || filterType || filterStatus);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">ফলাফল ব্যবস্থাপনা</h2>
          <p className="text-sm text-gray-400 mt-0.5">একটি পরীক্ষা নির্বাচন করে ফলাফল প্রদান করুন</p>
        </div>
        <button onClick={fetchExams} disabled={isLoading}
          className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500 disabled:opacity-40">
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={searchInput} onChange={e => setSearchInput(e.target.value)}
            placeholder="পরীক্ষার নাম বা ক্লাস..."
            className="pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-violet-400 w-52" />
        </div>
        <div className="flex items-center gap-1.5">
          <Filter size={13} className="text-gray-400" />
          <select value={filterClass} onChange={e => { setFilterClass(e.target.value); setPage(1); }}
            className="py-2.5 px-3 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-violet-400 text-gray-700">
            <option value="">সকল ক্লাস</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <select value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1); }}
          className="py-2.5 px-3 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-violet-400 text-gray-700">
          <option value="">সকল ধরন</option>
          {Object.entries(EXAM_TYPE_BN).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
          className="py-2.5 px-3 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-violet-400 text-gray-700">
          <option value="">সকল স্ট্যাটাস</option>
          <option value="UPCOMING">আসন্ন</option>
          <option value="ONGOING">চলমান</option>
          <option value="COMPLETED">সম্পন্ন</option>
        </select>
        {hasFilter && (
          <button onClick={() => { setSearchInput(""); setSearch(""); setFilterClass(""); setFilterType(""); setFilterStatus(""); setPage(1); }}
            className="text-xs font-semibold text-violet-600 hover:underline">✕ ফিল্টার বাতিল</button>
        )}
      </div>

      {/* Error */}
      {error && !isLoading && (
        <div className="flex flex-col items-center py-16 text-center">
          <AlertCircle size={28} className="text-red-400 mb-3" />
          <p className="text-sm text-gray-600 mb-3">{error}</p>
          <button onClick={fetchExams} className="text-sm text-violet-600 hover:underline font-semibold">আবার চেষ্টা করুন</button>
        </div>
      )}

      {/* Table */}
      {!error && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["পরীক্ষার নাম", "ক্লাস / সেকশন", "ধরন", "তারিখ", "বিষয়", "স্ট্যাটাস", ""].map((h, i) => (
                    <th key={i} className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading
                  ? Array(5).fill(0).map((_, i) => <SkeletonRow key={i} />)
                  : paginated.length === 0
                    ? (
                      <tr><td colSpan={7} className="px-5 py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center">
                            <ClipboardList size={24} className="text-violet-400" />
                          </div>
                          <p className="font-semibold text-gray-600">
                            {hasFilter ? "এই ফিল্টারে কোনো পরীক্ষা পাওয়া যায়নি" : "কোনো পরীক্ষা নেই"}
                          </p>
                        </div>
                      </td></tr>
                    )
                    : paginated.map(exam => {
                      const st = getStatus(exam);
                      const sc = STATUS_CFG[st];
                      const tc = TYPE_COLORS[exam.type] ?? "bg-gray-100 text-gray-600";
                      return (
                        <tr key={exam.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-5 py-4">
                            <p className="font-semibold text-gray-800 max-w-xs">{exam.name}</p>
                            <p className="text-xs text-gray-400">{exam.academicYear}</p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-sm font-semibold text-gray-700">{exam.section?.class?.name}</p>
                            <p className="text-xs text-gray-400">সেকশন {exam.section?.name}</p>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${tc}`}>
                              {EXAM_TYPE_BN[exam.type] ?? exam.type}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-sm text-gray-700">{fmtDate(exam.startDate)}</p>
                            <p className="text-xs text-gray-400">— {fmtDate(exam.endDate)}</p>
                          </td>
                          <td className="px-5 py-4">
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-full w-fit">
                              <BookOpen size={11} />{exam._count?.examSubjects ?? exam.examSubjects?.length ?? 0}টি
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full w-fit ${sc.cls}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{sc.label}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <button
                              onClick={() => router.push(`/dashboard/admin/results/${exam.id}`)}
                              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 border border-violet-200 text-violet-700 bg-violet-50 hover:bg-violet-100 rounded-lg transition-colors"
                            >
                              <Plus size={12} /> ফলাফল
                            </button>
                            <button
                              onClick={() => router.push(`/dashboard/admin/results/${exam.id}/summary`)}
                              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                            >
                              <BarChart2 size={12} /> সারসংক্ষেপ
                            </button>
                          </td>
                        </tr>
                      );
                    })
                }
              </tbody>
            </table>
          </div>
          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-50">
              <p className="text-sm text-gray-400">পৃষ্ঠা {safePage} / {totalPages} · মোট {filtered.length}টি</p>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage <= 1}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40">
                  <ChevronLeft size={15} /> পূর্ববর্তী
                </button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40">
                  পরবর্তী <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ResultsPage;