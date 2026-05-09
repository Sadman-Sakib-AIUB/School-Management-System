"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X, Loader2, LayoutGrid } from "lucide-react";

import Swal from "sweetalert2";
import axiosInstance from "@/src/lib/axiosInstance";

const SHIFT_OPTIONS = [
  { value: "MORNING", label: "সকাল (Morning)" },
  { value: "DAY", label: "দিন (Day)" },
  { value: "EVENING", label: "বিকাল (Evening)" },
];

const inputCls = (hasError) =>
  `w-full px-3 py-2.5 text-sm rounded-xl border bg-gray-50 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${hasError ? "border-red-300 bg-red-50" : "border-gray-200"
  }`;

const Field = ({ label, required = true, error, children }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
    {error && <p className="mt-1 text-xs text-red-500">⚠ {error}</p>}
  </div>
);

export default function SectionFormModal({ isOpen, onClose, onSuccess, editSection, classes }) {
  const isEdit = !!editSection;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onBlur" });

  useEffect(() => {
    if (isOpen) {
      reset(isEdit
        ? { shift: editSection.shift, capacity: editSection.capacity }
        : { name: "", classId: "", shift: "MORNING", capacity: 40 }
      );
    }
  }, [isOpen, editSection, isEdit, reset]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        // UPDATE SECTION
        await axiosInstance.patch(`/sections/${editSection.id}`, {
          shift: data.shift,
          capacity: Number(data.capacity),
        });
      } else {
        // CREATE NEW SECTION
        await axiosInstance.post("/sections", {
          name: data.name.trim().toUpperCase(),
          classId: data.classId,
          shift: data.shift,
          capacity: Number(data.capacity),
        });
      }

      const label = isEdit
        ? `${editSection.class?.name} — সেকশন ${editSection.name}`
        : `সেকশন ${data.name.toUpperCase()}`;

      await Swal.fire({
        icon: "success",
        title: "সফল!",
        html: `<strong>${label}</strong> সফলভাবে ${isEdit ? "আপডেট" : "তৈরি"} হয়েছে।`,
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#4f46e5",
        customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl px-6 py-2.5 font-semibold" },
      });

      reset();
      onClose();
      onSuccess?.();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ব্যর্থ!",
        text: error.response?.data?.message || `সেকশন ${isEdit ? "আপডেট" : "তৈরি"} করতে ব্যর্থ হয়েছে।`,
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#4f46e5",
        customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl px-6 py-2.5 font-semibold" },
      });
    }
  };

  const handleClose = () => { if (!isSubmitting) { reset(); onClose(); } };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center">
              <LayoutGrid size={17} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {isEdit ? "সেকশন আপডেট" : "নতুন সেকশন তৈরি"}
              </h2>
              {isEdit && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {editSection.class?.name} · সেকশন {editSection.name}
                </p>
              )}
            </div>
          </div>
          <button onClick={handleClose} disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 disabled:opacity-40">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-6 space-y-4">

          {/* Create-only fields */}
          {!isEdit && (
            <>
              <Field label="ক্লাস নির্বাচন করুন" error={errors.classId?.message}>
                <select
                  {...register("classId", { required: "ক্লাস নির্বাচন করুন" })}
                  className={inputCls(errors.classId)}
                >
                  <option value="">— ক্লাস বেছে নিন —</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.academicYear})
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="সেকশনের নাম" error={errors.name?.message}>
                <input
                  {...register("name", {
                    required: "সেকশনের নাম আবশ্যক",
                    maxLength: { value: 12, message: "সর্বোচ্চ ৫ অক্ষর (যেমন: A, B, C)" },
                  })}
                  placeholder="A"
                  className={inputCls(errors.name)}
                  style={{ textTransform: "uppercase" }}
                />
              </Field>
            </>
          )}

          {/* Shared fields */}
          <Field label="শিফট" error={errors.shift?.message}>
            <select
              {...register("shift", { required: "শিফট নির্বাচন করুন" })}
              className={inputCls(errors.shift)}
            >
              {SHIFT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </Field>

          <Field label="ক্যাপাসিটি (আসন সংখ্যা)" error={errors.capacity?.message}>
            <input
              type="number"
              {...register("capacity", {
                required: "ক্যাপাসিটি আবশ্যক",
                min: { value: 1, message: "কমপক্ষে ১ জন" },
                max: { value: 200, message: "সর্বোচ্চ ২০০ জন" },
              })}
              placeholder="40"
              className={inputCls(errors.capacity)}
            />
          </Field>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <button type="button" onClick={handleClose} disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50">
            বাতিল
          </button>
          <button disabled={isSubmitting} onClick={handleSubmit(onSubmit)}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-60 shadow-lg shadow-indigo-200">
            {isSubmitting
              ? <><Loader2 size={15} className="animate-spin" /> অপেক্ষা করুন...</>
              : isEdit ? "আপডেট করুন" : "সেকশন তৈরি করুন"
            }
          </button>
        </div>

      </div>
    </div>
  );
}