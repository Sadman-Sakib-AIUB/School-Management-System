"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Plus, Search, RefreshCw, AlertCircle,
  ChevronLeft, ChevronRight, GraduationCap, Users, Eye,
} from "lucide-react";

import Swal from "sweetalert2";
import AdmissionModal from "./_components/AdmissionModal";
import ViewStudentModal from "./_components/ViewStudentModal";
import EnrollModal from "./_components/EnrollModal";
import axiosInstance from "@/src/lib/axiosInstance";
import SkeletonRow from "./_components/SkeletonRow";

const SHIFT_LABEL = { MORNING: "সকাল", DAY: "দিন", EVENING: "বিকাল" };

// Enrollment status options for the toggle dropdown
const STATUS_OPTIONS = [
  { value: "SELECT", label: "সিলেক্ট করুন", color: "text-emerald-700 bg-emerald-100" },
  { value: "ACTIVE", label: "এক্টিভ", color: "text-emerald-700 bg-emerald-100" },
  { value: "INACTIVE", label: "ইনএক্টিভ", color: "text-blue-700 bg-blue-100" },
  { value: "SUSPENDED", label: "সাসপেন্ড", color: "text-violet-700 bg-violet-100" },
  { value: "BLOCKED", label: "ব্লকড", color: "text-red-700 bg-red-100" },
];

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("bn-BD", { year: "numeric", month: "short", day: "numeric" });
};

const EnrollmentCell = ({ enrollment }) => {
  if (!enrollment) return <span className="text-xs text-gray-400 italic">ভর্তি হয়নি</span>;
  return (
    <div>
      <p className="text-sm font-semibold text-gray-800">
        {enrollment.section?.class?.name} — সেকশন {enrollment.section?.name}
      </p>
      <p className="text-xs text-gray-400 mt-0.5">
        রোল: {enrollment.rollNumber} · {SHIFT_LABEL[enrollment.section?.shift]} · {enrollment.academicYear}
      </p>
    </div>
  );
};

export default function AdmissionPage() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewStudentId, setViewStudentId] = useState(null);
  const [enrollStudent, setEnrollStudent] = useState(null);

  // ------------ Fetch classes for enroll modal -------------
  useEffect(() => {
    axiosInstance.get("/academic-classes", { params: { limit: 100 } })
      .then((res) => setClasses(res.data?.data || []))
      .catch(() => { });
  }, []);

  // -------------------- Fetch students --------------------
  const fetchStudents = useCallback(async (p = 1, q = "") => {
    setIsLoading(true); setError(null);
    try {
      const params = { page: p, limit: 10 };
      if (q) params.search = q;
      const res = await axiosInstance.get("/students", { params });
      setStudents(res.data?.data || []);
      setMeta(res.data?.meta || { total: 0, totalPages: 1 });
    } catch {
      setError("শিক্ষার্থীদের তথ্য লোড করতে ব্যর্থ হয়েছে।");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents(page, search);
  }, [page, search, fetchStudents]);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setSearch(searchInput);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // -------------------- Status change --------------------
  const handleStatusChange = async (student, newStatus) => {
    const opt = STATUS_OPTIONS.find((s) => s.value === newStatus);
    // console.log(opt);
    const result = await Swal.fire({
      title: "স্ট্যাটাস পরিবর্তন করবেন?",
      html: `<strong>${student.fullNameEnglish}</strong>-এর স্ট্যাটাস <strong>${opt?.label}</strong> করা হবে।`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, পরিবর্তন করুন",
      cancelButtonText: "বাতিল",
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: "#6b7280",
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-xl px-5 py-2.5 font-semibold",
        cancelButton: "rounded-xl px-5 py-2.5 font-semibold",
      },
    });

    if (!result.isConfirmed) return;

    try {
      await axiosInstance.patch(`/students/${student.id}/status`, { status: newStatus });
      setStudents((prev) => prev.map((s) =>
        s.id === student.id
          ? { ...s, currentEnrollment: s.currentEnrollment ? { ...s.currentEnrollment, status: newStatus } : null }
          : s
      ));
      Swal.fire({
        icon: "success", title: "সফল!",
        html: `স্ট্যাটাস <strong>${opt?.label}</strong> করা হয়েছে।`,
        confirmButtonText: "ঠিক আছে", confirmButtonColor: "#7c3aed",
        customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl px-5 py-2.5 font-semibold" },
      });
    } catch (err) {
      Swal.fire({
        icon: "error", title: "ব্যর্থ!",
        text: err.response?.data?.message || "স্ট্যাটাস পরিবর্তন করতে ব্যর্থ হয়েছে।",
        confirmButtonText: "ঠিক আছে", confirmButtonColor: "#7c3aed",
        customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl px-5 py-2.5 font-semibold" },
      });
    }
  };

  const handleSuccess = () => {
    setPage(1);
    fetchStudents(1, search);
  };

  return (
    <div className="space-y-5">

      {/* -- Header -- */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">ভর্তি ব্যবস্থাপনা</h2>
          <p className="text-sm text-gray-400 mt-0.5">মোট {meta.total} জন শিক্ষার্থী নিবন্ধিত</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => fetchStudents(page, search)} disabled={isLoading}
            className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500 disabled:opacity-40">
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          </button>
          <button onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-all shadow-lg shadow-violet-200/60 active:scale-95">
            <Plus size={16} /> নতুন ভর্তি
          </button>
        </div>
      </div>

      {/* -- Search -- */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
          placeholder="নাম, কোড বা ফোন দিয়ে খুঁজুন..."
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent" />
      </div>

      {/* -- Error -- */}
      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
            <AlertCircle size={24} className="text-red-400" />
          </div>
          <p className="text-sm font-medium text-gray-700 mb-3">{error}</p>
          <button onClick={() => fetchStudents(page, search)} className="text-sm text-violet-600 hover:underline font-semibold">
            আবার চেষ্টা করুন
          </button>
        </div>
      )}

      {/* -- Table -- */}
      {!error && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["শিক্ষার্থী", "কোড", "যোগাযোগ", "বর্তমান ভর্তি", "এনরোলমেন্ট স্ট্যাটাস", "যোগ দিয়েছে", ""].map((h, i) => (
                    <th key={i} className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading
                  ? Array(5).fill(0).map((_, i) => <SkeletonRow key={i} />)
                  : students.length === 0
                    ? (
                      <tr><td colSpan={7} className="px-5 py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center">
                            <Users size={24} className="text-violet-400" />
                          </div>
                          <p className="font-semibold text-gray-600">
                            {searchInput ? `"${searchInput}" খুঁজে পাওয়া যায়নি` : "কোনো শিক্ষার্থী নেই"}
                          </p>
                          {!searchInput && (
                            <button onClick={() => setIsModalOpen(true)}
                              className="flex items-center gap-1.5 text-sm font-semibold text-violet-600 hover:underline">
                              <Plus size={14} /> প্রথম ভর্তি করুন
                            </button>
                          )}
                        </div>
                      </td></tr>
                    )
                    : students.map((student) => {
                      const initials = student.fullNameEnglish?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "S";
                      const enrollment = student.currentEnrollment;
                      const enrollStatus = enrollment?.status;
                      const statusOpt = STATUS_OPTIONS.find((s) => s.value === enrollStatus);
                      const isUserActive = student.user?.isActive === "ACTIVE";

                      return (
                        <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">

                          {/* Student */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-sm shrink-0">
                                {
                                  student.profilePhotoUrl
                                    ? <img src={student.profilePhotoUrl} alt={student.fullNameEnglish} className="w-full h-full object-cover rounded-lg" />
                                    : initials
                                }
                                
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800">{student.fullNameEnglish}</p>
                                <p className="text-xs text-gray-400">{student.fullNameBangla}</p>
                              </div>
                            </div>
                          </td>

                          {/* Code */}
                          <td className="px-5 py-4">
                            <span className="font-mono text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                              {student.studentCode}
                            </span>
                          </td>

                          {/* Contact */}
                          <td className="px-5 py-4">
                            <p className="text-sm text-gray-700">{student.phone || "—"}</p>
                            <p className="text-xs text-gray-400">{student.user?.email || "—"}</p>
                          </td>

                          {/* Enrollment */}
                          <td className="px-5 py-4">
                            <EnrollmentCell enrollment={enrollment} />
                          </td>

                          {/* Enrollment status dropdown */}
                          <td className="px-5 py-4">
                            {enrollment ? (
                              <select
                                value={enrollStatus || ""}
                                onChange={(e) => handleStatusChange(student, e.target.value)}
                                className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border-0 outline-none cursor-pointer ${statusOpt?.color || "bg-gray-100 text-gray-600"
                                  }`}
                              >
                                {STATUS_OPTIONS.map((s) => (
                                  <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                              </select>
                            ) : (
                              <span className="text-xs text-gray-300 italic">—</span>
                            )}
                          </td>

                          {/* Joined */}
                          <td className="px-5 py-4">
                            <p className="text-sm text-gray-600">{formatDate(student.createdAt)}</p>
                            <span className={`inline-flex items-center gap-1 text-xs font-semibold mt-1 px-2 py-0.5 rounded-full ${isUserActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
                              }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${isUserActive ? "bg-emerald-500" : "bg-red-500"}`} />
                              {isUserActive ? "এক্টিভ" : "ইনএক্টিভ"}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setViewStudentId(student.id)}
                                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                              >
                                <Eye size={12} /> দেখুন
                              </button>
                              {!enrollment && (
                                <button
                                  onClick={() => setEnrollStudent(student)}
                                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 border border-violet-200 text-violet-700 bg-violet-50 hover:bg-violet-100 rounded-lg transition-colors"
                                >
                                  <GraduationCap size={12} /> ভর্তি করুন
                                </button>
                              )}
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
          {!isLoading && meta.totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-50">
              <p className="text-sm text-gray-400">পৃষ্ঠা {page} / {meta.totalPages} · মোট {meta.total} জন</p>
              <div className="flex gap-2">
                <button onClick={() => setPage((p) => p - 1)} disabled={page <= 1}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                  <ChevronLeft size={15} /> পূর্ববর্তী
                </button>
                <button onClick={() => setPage((p) => p + 1)} disabled={page >= meta.totalPages}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                  পরবর্তী <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* -- Modals -- */}
      <AdmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
        classes={classes}
      />

      <ViewStudentModal
        isOpen={!!viewStudentId}
        onClose={() => setViewStudentId(null)}
        studentId={viewStudentId}
      />

      <EnrollModal
        isOpen={!!enrollStudent}
        onClose={() => setEnrollStudent(null)}
        onSuccess={() => { setEnrollStudent(null); handleSuccess(); }}
        student={enrollStudent}
        classes={classes}
      />

    </div>
  );
}