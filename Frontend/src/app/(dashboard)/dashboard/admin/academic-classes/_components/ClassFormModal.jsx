"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Loader2, BookOpen } from "lucide-react";

import Swal from "sweetalert2";
import axiosInstance from "@/src/lib/axiosInstance";

const inputCls = (hasError) =>
  `w-full px-3 py-2.5 text-sm rounded-xl border bg-gray-50 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasError ? "border-red-300 bg-red-50" : "border-gray-200"
  }`;

const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
      {label} <span className="text-red-400">*</span>
    </label>
    {children}
    {error && <p className="mt-1 text-xs text-red-500">⚠ {error}</p>}
  </div>
);

const ClassFormModal = ({ isOpen, onClose, onSuccess, editClass }) => {
  const isEdit = !!editClass;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onBlur" });

  useEffect(() => {
    if (isOpen) {
      reset(isEdit
        ? { name: editClass.name, academicYear: editClass.academicYear }
        : { name: "", academicYear: new Date().getFullYear() }
      );
    }
  }, [isOpen, editClass, isEdit, reset]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    try {
      const payload = { name: data.name.trim(), academicYear: Number(data.academicYear) };

      if (isEdit) {
        // UPDATE CLASS
        await axiosInstance.patch(`/academic-classes/${editClass.id}`, { name: payload.name });
      } else {

        // CREATE CLASS
        await axiosInstance.post("/academic-classes", payload);
      }

      await Swal.fire({
        icon: "success",
        title: "সফল!",
        html: `<strong>${payload.name}</strong> সফলভাবে ${isEdit ? "আপডেট" : "তৈরি"} হয়েছে।`,
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#2563eb",
        customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl px-6 py-2.5 font-semibold" },
      });

      reset();
      onClose();
      onSuccess?.();
    } catch (error) {
      const message = error.response?.data?.message || `ক্লাস ${isEdit ? "আপডেট" : "তৈরি"} করতে ব্যর্থ হয়েছে।`;
      Swal.fire({
        icon: "error",
        title: "ব্যর্থ!",
        text: message,
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#2563eb",
        customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl px-6 py-2.5 font-semibold" },
      });
    }
  };

  const handleClose = () => { if (!isSubmitting) { reset(); onClose(); } };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
              <BookOpen size={18} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {isEdit ? "ক্লাস আপডেট" : "নতুন ক্লাস তৈরি"}
              </h2>
              {isEdit && (
                <p className="text-xs text-gray-400 mt-0.5">{editClass.name} · {editClass.academicYear}</p>
              )}
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600 disabled:opacity-40"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-6 space-y-4">
          <Field label="ক্লাসের নাম" error={errors.name?.message}>
            <input
              {...register("name", {
                required: "ক্লাসের নাম আবশ্যক",
                minLength: { value: 2, message: "কমপক্ষে ২ অক্ষর দিন" },
              })}
              placeholder="Class - 1"
              className={inputCls(errors.name)}
            />
          </Field>

          <Field label="শিক্ষাবর্ষ" error={errors.academicYear?.message}>
            <input
              type="number"
              {...register("academicYear", {
                required: "শিক্ষাবর্ষ আবশ্যক",
                min: { value: 2000, message: "সঠিক বছর দিন" },
                max: { value: 2100, message: "সঠিক বছর দিন" },
              })}
              placeholder="2026"
              disabled={isEdit}
              className={`${inputCls(errors.academicYear)} ${isEdit ? "opacity-50 cursor-not-allowed" : ""}`}
            />
            {isEdit && (
              <p className="mt-1 text-xs text-gray-400">শিক্ষাবর্ষ পরিবর্তন করা যাবে না।</p>
            )}
          </Field>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            বাতিল
          </button>
          <button
            disabled={isSubmitting}
            onClick={handleSubmit(onSubmit)}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
          >
            {isSubmitting
              ? <><Loader2 size={15} className="animate-spin" /> অপেক্ষা করুন...</>
              : isEdit ? "আপডেট করুন" : "ক্লাস তৈরি করুন"
            }
          </button>
        </div>

      </div>
    </div>
  );
}

export default ClassFormModal;