"use client";
import { useState, useEffect, useCallback } from "react";
import { UserPlus, Users2, Search, MoreVertical, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import axiosInstance from "../../../../../../lib/axiosInstance";
import AddTeacherModal from "../../_components/AddTeacherModal";
import ViewTeacherModal from "../../../admin/teachers/_components/ViewTeacherModal.Admin";

// ------------------------------- SKELETON ROW -------------------------
const SkeletonRow = () => (
  <tr>
    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
      <td key={i} className="px-6 py-4">
        <div className="h-4 bg-gray-100 rounded-lg animate-pulse" />
      </td>
    ))}
  </tr>
);

// ---------------------------- GENDER DISPLAY -----------------------------
const GENDER_LABEL = { MALE: "পুরুষ", FEMALE: "মহিলা", OTHER: "অন্যান্য" };

const TeachersSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewTeacherId, setViewTeacherId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, limit: 10 });

  // ----------------------------- Fetch teachers -----------------------------
  const fetchTeachers = useCallback(async (currentPage = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get("/teachers", {
        params: { page: currentPage, limit: 10 },
      });
      setTeachers(res.data?.data || []);
      // console.log(teachers);
      setMeta(res.data?.meta || { total: 0, totalPages: 1, limit: 10 });
    } catch (err) {
      setError("শিক্ষকদের তথ্য লোড করতে ব্যর্থ হয়েছে।");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeachers(page);
  }, [page, fetchTeachers]);

  // ----------------------------- Client-side search filter -----------------------------
  const filtered = teachers.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.fullNameEnglish?.toLowerCase().includes(q) ||
      t.fullNameBangla?.toLowerCase().includes(q) ||
      t.teacherCode?.toLowerCase().includes(q) ||
      t.department?.toLowerCase().includes(q) ||
      t.subject?.toLowerCase().includes(q) ||
      t.phone?.includes(q)
    );
  });

  const handleSuccess = () => {
    setPage(1);
    fetchTeachers(1);
  };

  const handleView = (teacherId) => {
    setViewTeacherId(teacherId);
    setIsViewModalOpen(true);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchTeachers(newPage);
  };

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">শিক্ষকগণ</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            মোট {meta.total} জন শিক্ষক নিবন্ধিত
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchTeachers(page)}
            disabled={isLoading}
            className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500 transition-colors disabled:opacity-40"
            title="রিফ্রেশ"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200/60 active:scale-95"
          >
            <UserPlus size={16} />
            নতুন শিক্ষক যোগ করুন
          </button>
        </div>
      </div>

      {/* ── Search bar ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="নাম, কোড, বিষয় বা বিভাগ দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* -- Table -- */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Error state */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
              <Users2 size={24} className="text-red-400" />
            </div>
            <p className="text-sm font-medium text-gray-700 mb-1">{error}</p>
            <button
              onClick={() => fetchTeachers(page)}
              className="mt-3 text-sm text-primary-600 hover:underline font-semibold"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-4">
              <Users2 size={28} className="text-primary-400" />
            </div>
            <h3 className="font-semibold text-gray-700 mb-1">
              {searchQuery ? "কোনো ফলাফল পাওয়া যায়নি" : "কোনো শিক্ষক পাওয়া যায়নি"}
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              {searchQuery
                ? `"${searchQuery}" এর জন্য কোনো শিক্ষক খুঁজে পাওয়া যায়নি।`
                : "এখনো কোনো শিক্ষক যোগ করা হয়নি।"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-all"
              >
                <UserPlus size={15} />
                প্রথম শিক্ষক যোগ করুন
              </button>
            )}
          </div>
        )}

        {/* Table — shown when data exists or loading */}
        {(isLoading || (!error && filtered.length > 0)) && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["শিক্ষক", "কোড", "বিভাগ / বিষয়", "যোগাযোগ", "যোগদান-সময়", "অবস্থা", "একশন"].map((h, i) => (
                    <th key={i} className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading
                  ? Array(5).fill(0).map((_, i) => <SkeletonRow key={i} />)
                  : filtered.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-gray-50/80 transition-colors">

                      {/* Name + avatar */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm shrink-0">
                            {teacher.fullNameEnglish?.[0]?.toUpperCase() || "T"}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800 leading-tight">
                              {teacher.fullNameEnglish}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">{teacher.fullNameBangla}</p>
                          </div>
                        </div>
                      </td>

                      {/* Code */}
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg">
                          {teacher.teacherCode}
                        </span>
                      </td>

                      {/* Dept / Subject */}
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-700">{teacher.department}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{teacher.subject}</p>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">{teacher.phone}</p>
                        <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[160px]">
                          {teacher.user?.email}
                        </p>
                      </td>

                      {/* Joining date */}
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {teacher.joiningDate
                          ? new Date(teacher.joiningDate).toLocaleDateString("bn-BD", {
                            year: "numeric", month: "short", day: "numeric",
                          })
                          : "—"}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${teacher.user?.isActive === "ACTIVE"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-600"
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${teacher.user?.isActive === "ACTIVE" ? "bg-emerald-500" : "bg-red-500"
                            }`} />
                          {teacher.user?.isActive === "ACTIVE" ? "সক্রিয়" : "নিষ্ক্রিয়"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <button
                            onClick={() => handleView(teacher.id)}
                            className="text-xs font-semibold px-3 py-1.5 border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            দেখুন
                          </button>
                        {/* <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreVertical size={16} />
                        </button> */}
                      </td>

                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        )}

        {/* ── Pagination ── */}
        {!isLoading && !error && meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-50">
            <p className="text-sm text-gray-400">
              পৃষ্ঠা {page} / {meta.totalPages} — মোট {meta.total} জন
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} className="text-gray-600" />
              </button>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= meta.totalPages}
                className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} className="text-gray-600" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* -- Modal -- */}
      <AddTeacherModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />

      {/* -- View teacher modal --  */}
      <ViewTeacherModal
        isOpen={isViewModalOpen}
        onClose={() => { setIsViewModalOpen(false); setViewTeacherId(null); }}
        teacherId={viewTeacherId}
      />

    </div>

  );
}

export default TeachersSection;