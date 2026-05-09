"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Plus, RefreshCw, AlertCircle, LayoutGrid,
  ChevronLeft, ChevronRight, Pencil, Trash2, Users, Filter,
} from "lucide-react";

import Swal from "sweetalert2";
import SectionFormModal from "./SectionFormModal";
import axiosInstance from "@/src/lib/axiosInstance";
import SkeletonRow from "./SkeletonRow";
import { set } from "react-hook-form";

// ----------------------- CONSTANTS -----------------------
const SHIFT_LABEL = {
  MORNING: { label: "সকাল", color: "bg-amber-100 text-amber-700" },
  DAY: { label: "দিন", color: "bg-blue-100 text-blue-700" },
  EVENING: { label: "বিকাল", color: "bg-violet-100 text-violet-700" },
};



const AcademicSectionsPage = () => {
  const [sections, setSections] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [filterClassId, setFilterClassId] = useState("");

  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editSection, setEditSection] = useState(null);

  // ----------------------- Fetch all classes for dropdown (once) -----------------------
  useEffect(() => {
    axiosInstance.get("/academic-classes", { params: { limit: 100 } })
      .then((res) => setClasses(res.data?.data || []))
      .catch(() => { setError("ক্লাসের তথ্য লোড করতে ব্যর্থ হয়েছে।"); });
  }, []);

  // ----------------------- Fetch sections -----------------------
  const fetchSections = useCallback(async (p = 1, classId = "") => {
    setIsLoading(true);
    setError(null);
    try {
      const params = { page: p, limit: 10 };
      if (classId) params.classId = classId;
      const res = await axiosInstance.get("/sections", { params });
      setSections(res.data?.data || []);
      setMeta(res.data?.meta || { total: 0, totalPages: 1 });
    } catch {
      setError("সেকশনের তথ্য লোড করতে ব্যর্থ হয়েছে।");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSections(page, filterClassId);
  }, [page, filterClassId, fetchSections]);

  // Reset to page 1 when filter changes
  const handleFilterChange = (classId) => {
    setFilterClassId(classId);
    setPage(1);
  };

  // ----------------------- Handlers -----------------------
  const handleOpenCreate = () => { 
    setEditSection(null); 
    setIsFormOpen(true); 
  };
    
  const handleOpenEdit = (s) => { 
    setEditSection(s);
    setIsFormOpen(true); 
  };

  const handleFormClose = () => { 
    setIsFormOpen(false); 
    setEditSection(null); 
  };

  const handleFormSuccess = () => fetchSections(page, filterClassId);

  const handleDelete = async (section) => {
    const result = await Swal.fire({
      title: "সেকশন মুছে ফেলবেন?",
      html: `<strong>${section.class?.name} — সেকশন ${section.name}</strong> সম্পূর্ণরূপে মুছে যাবে।<br/><span class="text-sm text-gray-500">এই কাজ পূর্বাবস্থায় ফেরানো যাবে না।</span>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, মুছুন",
      cancelButtonText: "বাতিল",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-xl px-5 py-2.5 font-semibold",
        cancelButton: "rounded-xl px-5 py-2.5 font-semibold",
      },
    });

    if (!result.isConfirmed) return;

    try {
      await axiosInstance.delete(`/sections/${section.id}`);
      setSections((prev) => prev.filter((s) => s.id !== section.id));
      setMeta((prev) => ({ ...prev, total: prev.total - 1 }));

      Swal.fire({
        icon: "success",
        title: "মুছে ফেলা হয়েছে!",
        html: `<strong>সেকশন ${section.name}</strong> সফলভাবে মুছে ফেলা হয়েছে।`,
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#4f46e5",
        customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl px-5 py-2.5 font-semibold" },
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "ব্যর্থ!",
        text: err.response?.data?.message || "সেকশন মুছতে ব্যর্থ হয়েছে।",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#4f46e5",
        customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl px-5 py-2.5 font-semibold" },
      });
    }
  };

  const selectedClassName = classes.find((c) => c.id === filterClassId)?.name || "";

  return (
    <div className="space-y-5">

      {/* -- Header -- */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">একাডেমিক সেকশন</h2>
          <p className="text-sm text-gray-400 mt-0.5">মোট {meta.total} টি সেকশন নিবন্ধিত</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchSections(page, filterClassId)}
            disabled={isLoading}
            className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500 transition-colors disabled:opacity-40"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200/60 active:scale-95"
          >
            <Plus size={16} /> নতুন সেকশন তৈরি
          </button>
        </div>
      </div>

      {/* -- Filter bar -- */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Filter size={15} />
          <span className="font-medium">ক্লাস অনুযায়ী ফিল্টার:</span>
        </div>
        <select
          value={filterClassId}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-gray-700 min-w-48"
        >
          <option value="">সকল ক্লাস</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.academicYear})
            </option>
          ))}
        </select>
        {filterClassId && (
          <button
            onClick={() => handleFilterChange("")}
            className="text-xs font-semibold text-indigo-600 hover:underline"
          >
            ফিল্টার বাতিল করুন
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
          <button
            onClick={() => fetchSections(page, filterClassId)}
            className="text-sm text-indigo-600 hover:underline font-semibold"
          >
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
                  {["সেকশন", "ক্লাস", "শিফট", "ক্যাপাসিটি", "ভর্তি / খালি", "একশন"].map((h, i) => (
                    <th
                      key={i}
                      className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}

                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading
                  ? Array(5).fill(0).map((_, i) => <SkeletonRow key={i} />)
                  : sections.length === 0
                    ? (
                      <tr>
                        <td colSpan={6} className="px-5 py-20 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center">
                              <LayoutGrid size={24} className="text-indigo-400" />
                            </div>
                            <p className="font-semibold text-gray-600">
                              {filterClassId
                                ? `"${selectedClassName}"-এ কোনো সেকশন নেই`
                                : "কোনো সেকশন পাওয়া যায়নি"}
                            </p>
                            <button
                              onClick={handleOpenCreate}
                              className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:underline"
                            >
                              <Plus size={14} /> নতুন সেকশন তৈরি করুন
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                    : sections.map((section) => {
                      const shift = SHIFT_LABEL[section.shift] || { label: section.shift, color: "bg-gray-100 text-gray-600" };
                      const enrolled = section.enrolledStudents ?? section._count?.enrollments ?? 0;
                      const available = section.availableSeats ?? (section.capacity - enrolled);

                      return (
                        <tr key={section.id} className="hover:bg-gray-50/50 transition-colors">

                          {/* Section name */}
                          <td className="px-5 py-4">
                            <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-base">
                              {section.name}
                            </div>
                          </td>

                          {/* Class */}
                          <td className="px-5 py-4">
                            <p className="font-semibold text-gray-800">{section.class?.name}</p>
                            <p className="text-xs text-gray-400">{section.class?.academicYear}</p>
                          </td>

                          {/* Shift */}
                          <td className="px-5 py-4">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${shift.color}`}>
                              {shift.label}
                            </span>
                          </td>

                          {/* Capacity */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5 text-gray-700">
                              <Users size={14} className="text-gray-400" />
                              <span className="font-medium">{section.capacity} জন</span>
                            </div>
                          </td>

                          {/* Enrolled / Available */}
                          <td className="px-5 py-4">
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-gray-500">{enrolled} ভর্তি</span>
                                <span className={`font-semibold ${available > 0 ? "text-emerald-600" : "text-red-500"}`}>
                                  {available} খালি
                                </span>
                              </div>
                              {/* Progress bar */}
                              <div className="h-1.5 bg-gray-100 rounded-full w-32 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${enrolled / section.capacity > 0.8
                                    ? "bg-red-400"
                                    : enrolled / section.capacity > 0.5
                                      ? "bg-amber-400"
                                      : "bg-emerald-400"
                                    }`}
                                  style={{ width: `${Math.min((enrolled / section.capacity) * 100, 100)}%` }}
                                />
                              </div>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOpenEdit(section)}
                                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 border border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                              >
                                <Pencil size={12} /> আপডেট
                              </button>
                              <button
                                onClick={() => handleDelete(section)}
                                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                              >
                                <Trash2 size={12} /> ডিলিট
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

          {/* -- Pagination -- */}
          {!isLoading && meta.totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-50">
              <p className="text-sm text-gray-400">
                পৃষ্ঠা {page} / {meta.totalPages} — মোট {meta.total} টি সেকশন
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page <= 1}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={15} /> পূর্ববর্তী
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= meta.totalPages}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  পরবর্তী <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* -- Modal -- */}
      <SectionFormModal
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        editSection={editSection}
        classes={classes}
      />

    </div>
  );
}


export default AcademicSectionsPage;