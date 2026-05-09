"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X, Loader2, GraduationCap } from "lucide-react";

import Swal from "sweetalert2";
import axiosInstance from "@/src/lib/axiosInstance";

const SHIFT_LABEL = { MORNING: "সকাল", DAY: "দিন", EVENING: "বিকাল" };

const inputCls = (err) =>
  `w-full px-3 py-2.5 text-sm rounded-xl border bg-gray-50 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-transparent ${
    err ? "border-red-300 bg-red-50" : "border-gray-200"
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

export default function EnrollModal({ isOpen, onClose, onSuccess, student, classes }) {
  const [sections, setSections]           = useState([]);
  const [loadingSections, setLoadingSections] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting }, reset } = useForm({
    mode: "onBlur",
    defaultValues: { academicYear: new Date().getFullYear() },
  });

  const selectedClassId = watch("classId");

  useEffect(() => {
    if (isOpen) reset({ classId: "", sectionId: "", academicYear: new Date().getFullYear(), rollNumber: "" });
  }, [isOpen, reset]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (!selectedClassId) { setSections([]); return; }
    setLoadingSections(true);
    setValue("sectionId", "");
    axiosInstance.get("/sections", { params: { classId: selectedClassId, limit: 100 } })
      .then((res) => setSections(res.data?.data || []))
      .catch(() => setSections([]))
      .finally(() => setLoadingSections(false));
  }, [selectedClassId, setValue]);

  if (!isOpen || !student) return null;

  const onSubmit = async (data) => {
    try {
      await axiosInstance.post(`/students/${student.id}/enroll`, {
        sectionId:    data.sectionId,
        academicYear: Number(data.academicYear),
        rollNumber:   data.rollNumber.trim(),
      });

      await Swal.fire({
        icon: "success", title: "ভর্তি সম্পন্ন!",
        html: `<strong>${student.fullNameEnglish}</strong> সফলভাবে সেকশনে ভর্তি হয়েছে।`,
        confirmButtonText: "ঠিক আছে", confirmButtonColor: "#7c3aed",
        customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl px-5 py-2.5 font-semibold" },
      });
      reset(); onClose(); onSuccess?.();
    } catch (err) {
      Swal.fire({
        icon: "error", title: "ভর্তি ব্যর্থ!",
        text: err.response?.data?.message || "সেকশনে ভর্তি করতে ব্যর্থ হয়েছে।",
        confirmButtonText: "ঠিক আছে", confirmButtonColor: "#7c3aed",
        customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl px-5 py-2.5 font-semibold" },
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center">
              <GraduationCap size={17} className="text-violet-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">সেকশনে ভর্তি করুন</h2>
              <p className="text-xs text-gray-400 mt-0.5">{student.fullNameEnglish} · {student.studentCode}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-6 space-y-4">
          <Field label="ক্লাস" error={errors.classId?.message}>
            <select {...register("classId", { required: "ক্লাস নির্বাচন করুন" })} className={inputCls(errors.classId)}>
              <option value="">— ক্লাস বেছে নিন —</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.academicYear})</option>
              ))}
            </select>
          </Field>

          <Field label="সেকশন" error={errors.sectionId?.message}>
            <select {...register("sectionId", { required: "সেকশন নির্বাচন করুন" })}
              className={inputCls(errors.sectionId)} disabled={!selectedClassId || loadingSections}>
              <option value="">
                {loadingSections ? "লোড হচ্ছে..." : !selectedClassId ? "আগে ক্লাস বেছে নিন" : "— সেকশন বেছে নিন —"}
              </option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  সেকশন {s.name} — {SHIFT_LABEL[s.shift]} ({s.availableSeats ?? s.capacity} খালি)
                </option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="শিক্ষাবর্ষ" error={errors.academicYear?.message}>
              <input type="number" {...register("academicYear", { required: "আবশ্যক", min: { value: 2000, message: "সঠিক বছর" } })}
                className={inputCls(errors.academicYear)} />
            </Field>
            <Field label="রোল নম্বর" error={errors.rollNumber?.message}>
              <input {...register("rollNumber", { required: "আবশ্যক" })} placeholder="01"
                className={inputCls(errors.rollNumber)} />
            </Field>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">
            বাতিল
          </button>
          <button disabled={isSubmitting} onClick={handleSubmit(onSubmit)}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-violet-600 rounded-xl hover:bg-violet-700 transition-all active:scale-95 disabled:opacity-60 shadow-lg shadow-violet-200">
            {isSubmitting
              ? <><Loader2 size={15} className="animate-spin" /> ভর্তি হচ্ছে...</>
              : <><GraduationCap size={15} /> ভর্তি সম্পন্ন করুন</>
            }
          </button>
        </div>

      </div>
    </div>
  );
}