"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Plus, RefreshCw, GraduationCap,
  AlertCircle,
} from "lucide-react";

import Swal from "sweetalert2";
import ClassFormModal from "./ClassFormModal";
import axiosInstance from "@/src/lib/axiosInstance";
import Skeletoncard from "./Skeletoncard";
import ClassCard from "./ClassCard";
import ClassSubjectsModal from "./classSubjectsModal";


const AcademicClassesPage = () => {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });
  const [page, setPage] = useState(1);

  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editClass, setEditClass] = useState(null); // null = create, object = edit
  const [viewSubjectsClass, setViewSubjectsClass] = useState(null);

  // --------------------- Fetch ---------------------
  const fetchClasses = useCallback(async (p = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      // GET ALL CLASSES
      const res = await axiosInstance.get("/academic-classes", {
        params: { page: p, limit: 12 },
      });
      // console.log(res);
      setClasses(res.data?.data || []);
      
      setMeta(res.data?.meta || { total: 0, totalPages: 1 });
      
    } catch {
      setError("ক্লাসের তথ্য লোড করতে ব্যর্থ হয়েছে।");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { 
    fetchClasses(page); 
  }, [page, fetchClasses]);

  // console.log(classes, meta);

  // --------------------- Handlers ---------------------
  const handleOpenCreate = () => { setEditClass(null); setIsFormOpen(true); };
  const handleOpenEdit = (cls) => { setEditClass(cls); setIsFormOpen(true); };
  const handleFormClose = () => { setIsFormOpen(false); setEditClass(null); };
  const handleFormSuccess = () => { fetchClasses(page); };

  const handleDelete = async (cls) => {
    const result = await Swal.fire({
      title: "ক্লাস ডিলিট করতে চান?",
      html: `<strong>${cls.name}</strong> (${cls.academicYear}) সম্পূর্ণরূপে ডিলিট হয়ে যাবে।<br/><span class="text-sm text-gray-500">এই কাজ পূর্বাবস্থায় ফেরানো যাবে না।</span>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, ডিলিট",
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
      // DELETE CLASS
      await axiosInstance.delete(`/academic-classes/${cls.id}`);

      // Remove from local state immediately
      setClasses((prev) => prev.filter((c) => c.id !== cls.id));
      setMeta((prev) => ({ ...prev, total: prev.total - 1 }));

      Swal.fire({
        icon: "success",
        title: "ডিলিট হয়েছে!",
        html: `<strong>${cls.name}</strong> সফলভাবে ডিলিট হয়েছে।`,
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#2563eb",
        customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl px-5 py-2.5 font-semibold" },
      });
    } catch (err) {
      const message = err.response?.data?.message || "ক্লাস ডিলিট করতে ব্যর্থ হয়েছে।";
      Swal.fire({
        icon: "error",
        title: "ব্যর্থ!",
        text: message,
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#2563eb",
        customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl px-5 py-2.5 font-semibold" },
      });
    }
  };

  return (
    <div className="space-y-6">

      {/* -- Header -- */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">একাডেমিক ক্লাস</h2>
          <p className="text-sm text-gray-400 mt-0.5">মোট {classes.length} টি ক্লাস নিবন্ধিত</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchClasses(page)}
            disabled={isLoading}
            className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500 transition-colors disabled:opacity-40"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200/60 active:scale-95"
          >
            <Plus size={16} /> নতুন ক্লাস তৈরি
          </button>
        </div>
      </div>

      {/* -- Error -- */}
      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
            <AlertCircle size={24} className="text-red-400" />
          </div>
          <p className="text-sm font-medium text-gray-700 mb-3">{error}</p>
          <button
            onClick={() => fetchClasses(page)}
            className="text-sm text-blue-600 hover:underline font-semibold"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      )}

      {/* -- Card Grid -- */}
      {!error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {isLoading
            ? Array(8).fill(0).map((_, i) => <Skeletoncard key={i} />)
            : classes.length === 0
              ? (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                    <GraduationCap size={28} className="text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-gray-700 mb-1">কোনো ক্লাস পাওয়া যায়নি</h3>
                  <p className="text-sm text-gray-400 mb-6">এখনো কোনো একাডেমিক ক্লাস তৈরি করা হয়নি।</p>
                  <button
                    onClick={handleOpenCreate}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all"
                  >
                    <Plus size={15} /> প্রথম ক্লাস তৈরি করুন
                  </button>
                </div>
              )
              : classes.map((cls, i) => (
                <ClassCard
                  key={cls.id}
                  cls={cls}
                  index={i}
                  onEdit={handleOpenEdit}
                  onDelete={handleDelete}
                  onViewSubjects={setViewSubjectsClass}
                />
              ))
          }
        </div>
      )}

      {/* -- Pagination -- */}
      {!isLoading && !error && meta.totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-gray-400">
            পৃষ্ঠা {page} / {meta.totalPages} — মোট {meta.total} টি ক্লাস
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page <= 1}
              className="px-4 py-2 text-sm font-semibold border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              পূর্ববর্তী
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= meta.totalPages}
              className="px-4 py-2 text-sm font-semibold border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              পরবর্তী
            </button>
          </div>
        </div>
      )}

      {/* -- Modal -- */}
      <ClassFormModal
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        editClass={editClass}
      />

      <ClassSubjectsModal
        isOpen={!!viewSubjectsClass}
        onClose={() => setViewSubjectsClass(null)}
        cls={viewSubjectsClass}
      />

    </div>
  );
}

export default AcademicClassesPage;
