"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search, RefreshCw, AlertCircle, Users,
  ChevronLeft, ChevronRight, Eye, Pencil, Filter,
} from "lucide-react";

import Swal from "sweetalert2";

import axiosInstance from "@/src/lib/axiosInstance";
import ViewStudentModal from "../../admission/_components/ViewStudentModal";
import EditStudentModal from "./EditStudentModal";

// -------------- CONSTANTS --------------
const GENDER_LABEL = { MALE: "পুরুষ", FEMALE: "মহিলা", OTHER: "অন্যান্য" };
const SHIFT_LABEL = { MORNING: "সকাল", DAY: "দিন", EVENING: "বিকাল" };

const USER_STATUS_OPTIONS = [
  { value: "ACTIVE", label: "এক্টিভ" },
  { value: "INACTIVE", label: "ইন্যাক্টিভ" },
  { value: "SUSPENDED", label: "সাস্পেন্ডেড" },
  { value: "BLOCKED", label: "ব্লকড" },
];

const statusCls = (s) => ({
  ACTIVE: "bg-emerald-100 text-emerald-700",
  INACTIVE: "bg-gray-100 text-gray-600",
  SUSPENDED: "bg-amber-100 text-amber-700",
  BLOCKED: "bg-red-100 text-red-600",
}[s] ?? "bg-gray-100 text-gray-600");

const ITEMS_PER_PAGE = 10;


// ----------------- SKELETON -----------------
const SkeletonRow = () => (
  <tr className="border-b border-gray-50">
    {[40, 28, 20, 22, 36, 48, 24, 32].map((w, i) => (
      <td key={i} className="px-5 py-4">
        <div className="h-4 bg-gray-100 rounded-lg animate-pulse" style={{ width: `${w * 3}px` }} />
      </td>
    ))}
  </tr>
);

const StudentsPage = () => {
  const [allStudents, setAllStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sectionsLoading, setSectionsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalFromServer, setTotalFromServer] = useState(0);
  const [page, setPage] = useState(1);

  // Filters
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [filterClassId, setFilterClassId] = useState("");
  const [filterSectionId, setFilterSectionId] = useState("");

  // Modals
  const [viewStudentId, setViewStudentId] = useState(null);
  const [editStudent, setEditStudent] = useState(null);

  // ----------------- Load classes -----------------
  useEffect(() => {
    axiosInstance.get("/academic-classes", { params: { limit: 100 } })
      .then((res) => setClasses(res.data?.data ?? []))
      .catch(() => { });
  }, []);

  // ----------------- Load sections when class selected -----------------
  useEffect(() => {
    setSections([]);
    setFilterSectionId("");
    if (!filterClassId) return;
    setSectionsLoading(true);
    axiosInstance
      .get("/sections", { params: { classId: filterClassId, limit: 100 } })
      .then((res) => setSections(res.data?.data ?? []))
      .catch(() => setSections([]))
      .finally(() => setSectionsLoading(false));
  }, [filterClassId]);

  // ---------- Fetch all students (large limit -> client-side filter) ------------
  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get("/students",
        {
          params: {
            limit: 200,
            page: 1
          }
        });
      setAllStudents(res.data?.data ?? []);

      setTotalFromServer(res.data?.meta?.total ?? 0);

    } catch {
      setError("শিক্ষার্থীদের তথ্য লোড করতে ব্যর্থ হয়েছে।");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // console.log(allStudents);

  // ----------------- Debounce search ---------
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // --------- Client-side filter ------------
  // NOTE: GET /students list response includes:
  // currentEnrollment.section.id ------> matches section dropdown value
  // currentEnrollment.section.class.id ------> matches class dropdown value

  const filtered = useMemo(() => {
    let list = allStudents;
    // console.log(list);

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((s) =>
        s.fullNameEnglish?.toLowerCase().includes(q) ||
        s.fullNameBangla?.toLowerCase().includes(q) ||
        s.studentCode?.toLowerCase().includes(q) ||
        s.phone?.includes(q) ||
        s.user?.email?.toLowerCase().includes(q)
      );
    }

    if (filterClassId) {
      list = list.filter((s) => {
        const classId = s.currentEnrollment?.section?.class?.id
          ?? s.currentEnrollment?.section?.classId;
        return classId === filterClassId;
      });
      // console.log(list);
    }

    if (filterSectionId) {
      list = list.filter((s) => {
        const secId = s.currentEnrollment?.section?.id
          ?? s.currentEnrollment?.sectionId;
        return secId === filterSectionId;
      });
      // console.log(list);
    }

    return list;
  }, [allStudents, search, filterClassId, filterSectionId]);
  // console.log(filtered);

  // ------------------- Client-side pagination -------------------
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);
  const hasFilter = !!(search || filterClassId || filterSectionId);

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setFilterClassId("");
    setFilterSectionId("");
    setPage(1);
  };

  // ------------------- Status change -------------------
  const handleStatusChange = async (student, newStatus) => {
    if (student.user?.isActive === newStatus) return;
    const opt = USER_STATUS_OPTIONS.find((o) => o.value === newStatus);
    // console.log(opt);

    const { isConfirmed } = await Swal.fire({
      title: "স্ট্যাটাস পরিবর্তন করবেন?",
      html: `<strong>${student.fullNameEnglish}</strong>-এর অ্যাকাউন্ট <strong>${opt?.label}</strong> করা হবে।`,
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
    if (!isConfirmed) return;

    try {
      await axiosInstance.patch(`/students/${student.id}/status`, { status: newStatus });
      // update
      setAllStudents((prev) =>
        prev.map((s) =>
          s.id === student.id ? { ...s, user: { ...s.user, isActive: newStatus } } : s
        )
      );
      Swal.fire({
        icon: "success", title: "সফল!",
        html: `অ্যাকাউন্ট <strong>${opt?.label}</strong> করা হয়েছে।`,
        confirmButtonText: "ঠিক আছে", confirmButtonColor: "#7c3aed",
        timer: 2000, timerProgressBar: true,
        customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl px-5 py-2.5 font-semibold" },
      });
    } catch (err) {
      Swal.fire({
        icon: "error", title: "ব্যর্থ!",
        text: err.response?.data?.message ?? "স্ট্যাটাস পরিবর্তন করতে ব্যর্থ হয়েছে।",
        confirmButtonText: "ঠিক আছে", confirmButtonColor: "#7c3aed",
        customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl px-5 py-2.5 font-semibold" },
      });
    }
  };

  // console.log(allStudents);

  return (
    <div className="space-y-5">

      {/* -- Header -- */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">শিক্ষার্থী তালিকা</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {hasFilter
              ? `${filtered.length} জন পাওয়া গেছে (মোট ${totalFromServer} জন)`
              : `মোট ${totalFromServer} জন শিক্ষার্থী`}
          </p>
        </div>
        <button onClick={fetchStudents} disabled={isLoading}
          className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500 disabled:opacity-40">
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* -- Filters -- */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="নাম, কোড, ফোন বা ইমেইল..."
            className="pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-violet-400 w-64"
          />
        </div>

        {/* Class filter */}
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-gray-400 shrink-0" />
          <select
            value={filterClassId}
            onChange={(e) => { setFilterClassId(e.target.value); setPage(1); }}
            className="py-2.5 px-3 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-violet-400 text-gray-700"
          >
            <option value="">সকল ক্লাস</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>{c.name} ({c.academicYear})</option>
            ))}
          </select>
        </div>

        {/* Section filter — appears after class selected */}
        {filterClassId && (
          <select
            value={filterSectionId}
            onChange={(e) => { setFilterSectionId(e.target.value); setPage(1); }}
            disabled={sectionsLoading}
            className="py-2.5 px-3 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-violet-400 text-gray-700 disabled:opacity-50"
          >
            <option value="">
              {sectionsLoading ? "লোড হচ্ছে..." : "সকল সেকশন"}
            </option>
            {sections.map((s) => (
              <option key={s.id} value={s.id}>
                সেকশন {s.name} — {SHIFT_LABEL[s.shift]}
              </option>
            ))}
          </select>
        )}

        {hasFilter && (
          <button onClick={clearFilters}
            className="text-xs font-semibold text-violet-600 hover:underline underline-offset-2">
            ✕ ফিল্টার বাতিল
          </button>
        )}
      </div>

      {/* -- Error -- */}
      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
            <AlertCircle size={24} className="text-red-400" />
          </div>
          <p className="text-sm font-medium text-gray-700 mb-3">{error}</p>
          <button onClick={fetchStudents} className="text-sm text-violet-600 hover:underline font-semibold">
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
                  {[
                    "শিক্ষার্থী", "কোড",
                    "রক্তের গ্রুপ", "যোগাযোগ",
                    "বর্তমান ভর্তি", "অ্যাকাউন্ট স্ট্যাটাস", "একশন",
                  ].map((h, i) => (
                    <th key={i}
                      className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {isLoading
                  ? Array(6).fill(0).map((_, i) => <SkeletonRow key={i} />)
                  : paginated.length === 0
                    ? (
                      <tr>
                        <td colSpan={8} className="px-5 py-20 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center">
                              <Users size={24} className="text-violet-400" />
                            </div>
                            <p className="font-semibold text-gray-600">
                              {hasFilter
                                ? "এই ফিল্টারে কোনো শিক্ষার্থী পাওয়া যায়নি"
                                : "কোনো শিক্ষার্থী নেই"}
                            </p>
                            {hasFilter && (
                              <button onClick={clearFilters}
                                className="text-sm text-violet-600 hover:underline font-semibold">
                                ফিল্টার বাতিল করুন
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                    : paginated.map((student) => {
                      // console.log(student);
                      const initials = student.fullNameEnglish
                        ?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) ?? "S";
                      const enrollment = student.currentEnrollment;
                      const userStatus = student.user?.isActive ?? "ACTIVE";

                      return (
                        <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">

                          {/* Student name */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-sm shrink-0">
                                {
                                  student.profilePhotoUrl
                                    ? <img src={student.profilePhotoUrl} alt={student.fullNameEnglish} className="w-full h-full object-cover rounded-lg" />
                                    : initials
                                }
                                {/* {initials} */}
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

                          {/* Gender */}
                          {/* <td className="px-5 py-4 text-sm text-gray-700">
                            {GENDER_LABEL[student.gender] ?? "—"}
                          </td> */}

                          {/* Blood group — dedicated column */}
                          <td className="px-5 py-4">
                            {student.bloodGroup
                              ? (
                                <span className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-100 whitespace-nowrap">
                                  {student.bloodGroup.replace("_", " ")}
                                </span>
                              )
                              : <span className="text-xs text-gray-400">—</span>
                            }
                          </td>

                          {/* Contact */}
                          <td className="px-5 py-4">
                            <p className="text-sm text-gray-700">{student.phone || "—"}</p>
                            <p className="text-xs text-gray-400">{student.user?.email || "—"}</p>
                          </td>

                          {/* Enrollment */}
                          <td className="px-5 py-4">
                            {enrollment ? (
                              <div>
                                <p className="text-sm font-semibold text-gray-800">
                                  {enrollment.section?.class?.name} - Sec {enrollment.section?.name}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                  রোল: {enrollment.rollNumber}
                                  {" · "}{SHIFT_LABEL[enrollment.section?.shift] ?? enrollment.section?.shift}
                                  {" · "}{enrollment.academicYear}
                                </p>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400 italic">ভর্তি হয়নি</span>
                            )}
                          </td>

                          {/* Account status */}
                          <td className="px-5 py-4">
                            <select
                              value={userStatus}
                              onChange={(e) => handleStatusChange(student, e.target.value)}
                              className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border-0 outline-none cursor-pointer ${statusCls(userStatus)}`}
                            >
                              {USER_STATUS_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                              ))}
                            </select>
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
                              <button
                                onClick={() => setEditStudent(student)}
                                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 border border-violet-200 text-violet-700 bg-violet-50 hover:bg-violet-100 rounded-lg transition-colors"
                              >
                                <Pencil size={12} /> এডিট
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
              <p className="text-sm text-gray-400">
                পৃষ্ঠা {safePage} / {totalPages} · মোট {filtered.length} জন
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage <= 1}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={15} /> পূর্ববর্তী
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage >= totalPages}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  পরবর্তী <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* -- Modals -- */}
      <ViewStudentModal
        isOpen={!!viewStudentId}
        onClose={() => setViewStudentId(null)}
        studentId={viewStudentId}
      />
      <EditStudentModal
        isOpen={!!editStudent}
        onClose={() => setEditStudent(null)}
        onSuccess={() => { setEditStudent(null); fetchStudents(); }}
        student={editStudent}
      />

    </div>
  );
}

export default StudentsPage;