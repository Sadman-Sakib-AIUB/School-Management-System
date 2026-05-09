"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Plus, Search, RefreshCw, AlertCircle, ClipboardList,
  ChevronLeft, ChevronRight, Eye, Pencil, Trash2,
  Filter, Calendar, BookOpen, Clock, CheckCircle2,
} from "lucide-react";
import Swal from "sweetalert2";

import axiosInstance from "@/src/lib/axiosInstance";
import SkeletonRow from "./_components/SkeletonRow";
import CreateExamModal from "./_components/CreateExamModal";
import ViewExamModal from "./_components/ViewExamModal";
import { set } from "react-hook-form";
import EditExamModal from "./_components/EditExamModal";


// ---- CONSTANTS ----
export const EXAM_TYPE_BN = {
  MIDTERM: "অর্ধ-বার্ষিক",
  FINAL: "বার্ষিক",  
  CLASS_TEST: "ক্লাস টেস্ট", 
  WEEKLY_TEST: "সাপ্তাহিক টেস্ট",
};

const TYPE_COLORS = {
  MIDTERM: "bg-violet-100 text-violet-700",
  FINAL: "bg-rose-100 text-rose-700",
  CLASS_TEST: "bg-blue-100 text-blue-700",
  WEEKLY_TEST: "bg-emerald-100 text-emerald-700",
};

const getStatus = (exam) => {
  const today = new Date();
  const start = new Date(exam.startDate);
  const end = new Date(exam.endDate);

  if (today < start) return "UPCOMING";
  if (today > end) return "COMPLETED";

  return "ONGOING";
};

const STATUS_CONFIG = {
  UPCOMING: { label: "আসন্ন", cls: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
  ONGOING: { label: "চলমান", cls: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  COMPLETED: { label: "সম্পন্ন", cls: "bg-gray-100 text-gray-600", dot: "bg-gray-400" },
};

export const fmtDate = (iso) => iso
  ? new Date(iso).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" })
  : "—";

const ITEMS_PER_PAGE = 10;


const ExamsPage = () => {
  const [allExams, setAllExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalFromServer, setTotalFromServer] = useState(0);
  const [page, setPage] = useState(1);

  // Filters
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterClassId, setFilterClassId] = useState("");
  const [filterYear, setFilterYear] = useState("");

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewExam, setViewExam] = useState(null);
  const [editExam, setEditExam] = useState(null);

  // ---- Load classes for filter ----
  useEffect(() => {
    axiosInstance.get("/academic-classes", { params: { limit: 100 } })
      .then(res => setClasses(res.data?.data ?? []))
      .catch(() => { });
  }, []);

  // ------- Fetch exams -------
  const fetchExams = useCallback(async () => {
    setIsLoading(true); 
    setError(null);
    try {
      const res = await axiosInstance.get("/results/exams", { params: { limit: 200 } });
      // console.log(res);
      const data = res.data?.data ?? [];
      setAllExams(data);
      setTotalFromServer(data.length);
    } catch {
      setError("পরীক্ষার তথ্য লোড করতে ব্যর্থ হয়েছে।");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { 
    fetchExams(); 
  }, [fetchExams]);

  // console.log(totalFromServer);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { 
      setSearch(searchInput); 
      setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  // ------- Client-side filter --------
  const filtered = useMemo(() => {
    let list = allExams;
    // console.log(list);

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(e =>
        e.name?.toLowerCase().includes(q) ||
        e.section?.class?.name?.toLowerCase().includes(q) ||
        e.section?.name?.toLowerCase().includes(q)
      );
      
    }
    // Exam-Type Based filter
    if (filterType) list = list.filter(e => e.type === filterType);

    // Status based filter
    if (filterStatus) list = list.filter(e => getStatus(e) === filterStatus);

    // Class based filter
    if (filterClassId) list = list.filter(e => {
      // console.log(filterClassId);
      // console.log(e);
      return e.section?.class?.id === filterClassId || e.section?.classId === filterClassId;
    });

    // Academic Year based filter
    if (filterYear) list = list.filter(e => String(e.academicYear) === filterYear);

    return list;

  }, [allExams, search, filterType, filterStatus, filterClassId, filterYear]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);
  const hasFilter = !!(search || filterType || filterStatus || filterClassId || filterYear);

  const clearFilters = () => {
    setSearchInput(""); 
    setSearch(""); 
    setFilterType(""); 
    setFilterStatus("");
    setFilterClassId(""); 
    setFilterYear(""); 
    setPage(1);
  };

  // ------- Delete exam --------
  const handleDelete = async (exam) => {
    const { isConfirmed } = await Swal.fire({
      title: "পরীক্ষা ডিলিট করতে চান?",
      html: `<strong>${exam.name}</strong> সম্পূর্ণরূপে ডিলিট হয়ে যাবে।<br/><span class="text-sm text-gray-500">এই কাজ পূর্বাবস্থায় ফেরানো যাবে না।</span>`,
      icon: "warning", showCancelButton: true,
      confirmButtonText: "হ্যাঁ, ডিলিট",
      cancelButtonText: "বাতিল",
      confirmButtonColor: "#ef4444", cancelButtonColor: "#6b7280",
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-xl px-5 py-2.5 font-semibold",
        cancelButton: "rounded-xl px-5 py-2.5 font-semibold",
      },
    });
    if (!isConfirmed) return;

    // console.log(exam.id);

    try {
      await axiosInstance.delete(`/results/exams/delete/${exam.id}`);
      setAllExams(prev => prev.filter(e => e.id !== exam.id));
      Swal.fire({
        icon: "success", title: "ডিলিট করা হয়েছে!",
        timer: 2000, timerProgressBar: true, showConfirmButton: false,
        customClass: { popup: "rounded-2xl" },
      });
    } catch (err) {
      Swal.fire({
        icon: "error", title: "ব্যর্থ!",
        text: err.response?.data?.message ?? "ডিলিট করতে ব্যর্থ হয়েছে।",
        confirmButtonText: "ঠিক আছে", confirmButtonColor: "#7c3aed",
        customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl px-5 py-2.5 font-semibold" },
      });
    }
  };

  // Unique years from data
  const years = [...new Set(allExams.map(e => e.academicYear))].sort((a, b) => b - a);
  // console.log(years);

  return (
    <div className="space-y-5">

      {/* -- Header -- */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">পরীক্ষা ব্যবস্থাপনা</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {hasFilter
              ? `${filtered.length}টি পাওয়া গেছে (মোট ${totalFromServer}টি)`
              : `মোট ${totalFromServer}টি পরীক্ষা`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchExams} disabled={isLoading}
            className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500 disabled:opacity-40">
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          </button>
          <button onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-all shadow-lg shadow-violet-200/60 active:scale-95">
            <Plus size={16} /> নতুন পরীক্ষা
          </button>
        </div>
      </div>

      {/* --- Filters --- */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={searchInput} onChange={(e) => {setSearchInput(e.target.value);}}
            placeholder="নাম বা ক্লাস দিয়ে খুঁজুন..."
            className="pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-violet-400 w-56" />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={14} className="text-gray-400 shrink-0" />
          <select value={filterClassId} onChange={e => { setFilterClassId(e.target.value); setPage(1); }}
            className="py-2.5 px-3 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-violet-400 text-gray-700">
            <option value="">সকল ক্লাস</option>

            {classes.map(c => {
               return <option key={c.id} value={c.id}> {c.name} ({c.academicYear}) </option>; 
              })}

          </select>
        </div>

        <select value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1); }}
          className="py-2.5 px-3 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-violet-400 text-gray-700">
          <option value="">সকল ধরন</option>
          {Object.entries(EXAM_TYPE_BN).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>

        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
          className="py-2.5 px-3 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-violet-400 text-gray-700">
          <option value="">সকল স্ট্যাটাস</option>
          <option value="UPCOMING">আসন্ন</option>
          <option value="ONGOING">চলমান</option>
          <option value="COMPLETED">সম্পন্ন</option>
        </select>

        {years.length > 0 && (
          <select value={filterYear} onChange={e => { setFilterYear(e.target.value); setPage(1); }}
            className="py-2.5 px-3 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-violet-400 text-gray-700">
            <option value="">সকল বছর</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        )}

        {hasFilter && (
          <button onClick={clearFilters}
            className="text-xs font-semibold text-violet-600 hover:underline underline-offset-2">
            ✕ ফিল্টার বাতিল
          </button>
        )}
      </div>

      {/* --- Error --- */}
      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
            <AlertCircle size={24} className="text-red-400" />
          </div>
          <p className="text-sm font-medium text-gray-700 mb-3">{error}</p>
          <button onClick={fetchExams} className="text-sm text-violet-600 hover:underline font-semibold">
            আবার চেষ্টা করুন
          </button>
        </div>
      )}

      {/* --- Table --- */}
      {!error && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["পরীক্ষার নাম", "ক্লাস / সেকশন", "ধরন", "তারিখ", "বিষয়", "স্ট্যাটাস", "একশন"].map((h, i) => (
                    <th key={i} className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
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
                          {!hasFilter && (
                            <button onClick={() => setIsCreateOpen(true)}
                              className="flex items-center gap-1.5 text-sm font-semibold text-violet-600 hover:underline">
                              <Plus size={14} /> প্রথম পরীক্ষা তৈরি করুন
                            </button>
                          )}
                        </div>
                      </td></tr>
                    )
                    : paginated.map((exam) => {
                      const status = getStatus(exam);
                      const sc = STATUS_CONFIG[status];
                      const tc = TYPE_COLORS[exam.type] ?? "bg-gray-100 text-gray-600";
                      const subjectCount = exam._count?.examSubjects ?? exam.examSubjects?.length ?? 0;
                      // console.log(subjectCount);

                      return (
                        <tr key={exam.id} className="hover:bg-gray-50/50 transition-colors">

                          {/* Name */}
                          <td className="px-5 py-4">
                            <p className="font-semibold text-gray-800 max-w-xs truncate">{exam.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{exam.academicYear}</p>
                          </td>

                          {/* Class/Section */}
                          <td className="px-5 py-4">
                            <p className="text-sm font-semibold text-gray-700">{exam.section?.class?.name}</p>
                            <p className="text-xs text-gray-400">সেকশন {exam.section?.name}</p>
                          </td>

                          {/* Type */}
                          <td className="px-5 py-4">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${tc}`}>
                              {EXAM_TYPE_BN[exam.type] ?? exam.type}
                            </span>
                          </td>

                          {/* Dates */}
                          <td className="px-5 py-4">
                            <p className="text-sm text-gray-700">{fmtDate(exam.startDate)}</p>
                            <p className="text-xs text-gray-400"> শেষঃ {fmtDate(exam.endDate)}</p>
                          </td>

                          {/* Subject count */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-full w-fit">
                              <BookOpen size={11} />
                              {subjectCount}টি বিষয়
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-4">
                            <span className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full w-fit ${sc.cls}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                              {sc.label}
                            </span>
                          </td>

                          {/* Actions */}

                          {/* View */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5">
                              <button onClick={() => setViewExam(exam)}
                                className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                                <Eye size={11} /> বিস্তারিত
                              </button>

                            {/* Edit */}
                              <button
                                onClick={() => setEditExam(exam)}
                                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 border border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                              >
                                <Pencil size={12} /> এডিট
                              </button>

                              {/* Delete  */}
                              <button onClick={() => handleDelete(exam)}
                                className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                                <Trash2 size={11} /> ডিলিট
                              </button>
                            </div>
                          </td>

                        </tr>
                      );
                    })
                }
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-50">
              <p className="text-sm text-gray-400">পৃষ্ঠা {safePage} / {totalPages} · মোট {filtered.length}টি</p>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage <= 1}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                  <ChevronLeft size={15} /> পূর্ববর্তী
                </button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                  পরবর্তী <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- Modals --- */}
      <CreateExamModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => { setIsCreateOpen(false); fetchExams(); }}
      />
      <ViewExamModal
        isOpen={!!viewExam}
        onClose={() => setViewExam(null)}
        exam={viewExam}
      />

      <EditExamModal
        isOpen={!!editExam}
        onClose={() => setEditExam(null)}
        onSuccess={() => { setEditExam(null); fetchExams(); }}
        exam={editExam}
      />

    </div>
  );
}

export default ExamsPage;