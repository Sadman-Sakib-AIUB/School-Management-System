"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Loader2, UserCog } from "lucide-react";

import Swal from "sweetalert2";
import axiosInstance from "@/src/lib/axiosInstance";

const inputCls = (err) =>
  `w-full px-3 py-2.5 text-sm rounded-xl border bg-gray-50 outline-none transition-all
   focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-transparent ${err ? "border-red-300 bg-red-50" : "border-gray-200"
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

const SectionDivider = ({ title, color = "text-violet-500" }) => (
  <p className={`text-xs font-bold uppercase tracking-widest pb-2 border-b border-gray-100 ${color}`}>{title}</p>
);

export default function EditGuardianModal({ isOpen, onClose, onSuccess, guardian }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ mode: "onBlur" });

  useEffect(() => {
    if (!isOpen || !guardian) return;
    reset({
      fullNameEnglish: guardian.fullNameEnglish || "",
      fullNameBangla: guardian.fullNameBangla || "",
      phone: guardian.phone || "",
      guardianEmail: guardian.email || "",
      address: guardian.address || "",
      occupation: guardian.occupation || "",
      monthlyIncome: guardian.monthlyIncome || "",
    });
  }, [isOpen, guardian, reset]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen || !guardian) return null;

  const handleClose = () => { if (!isSubmitting) { reset(); onClose(); } };

  const onSubmit = async (data) => {
    try {
      await axiosInstance.patch(`/guardians/${guardian.id}`, {
        fullNameEnglish: data.fullNameEnglish.trim(),
        fullNameBangla: data.fullNameBangla.trim(),
        phone: data.phone.trim(),
        guardianEmail: data.guardianEmail?.trim() || undefined,
        address: data.address.trim(),
        occupation: data.occupation?.trim() || undefined,
        monthlyIncome: data.monthlyIncome ? Number(data.monthlyIncome) : undefined,
      });


      await Swal.fire({
        icon: "success", title: "সফল!",
        html: `<strong>${data.fullNameEnglish}</strong>-এর তথ্য আপডেট হয়েছে।`,
        confirmButtonText: "ঠিক আছে", confirmButtonColor: "#7c3aed",
        customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl px-6 py-2.5 font-semibold" },
      });
      reset();
      onClose();
      onSuccess?.();
    } catch (err) {
      Swal.fire({
        icon: "error", title: "ব্যর্থ!",
        text: err.response?.data?.message || "তথ্য আপডেট করতে ব্যর্থ হয়েছে।",
        confirmButtonText: "ঠিক আছে", confirmButtonColor: "#7c3aed",
        customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl px-6 py-2.5 font-semibold" },
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">
      <div className="bg-white w-full max-w-xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-linear-to-r from-violet-50 to-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center">
              <UserCog size={17} className="text-violet-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">গার্ডিয়ান তথ্য আপডেট</h2>
              <p className="text-xs text-gray-400 mt-0.5">{guardian.guardianCode} · {guardian.fullNameEnglish}</p>
            </div>
          </div>
          <button onClick={handleClose} disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 disabled:opacity-40">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

          {/* Personal */}
          <div className="space-y-4">
            <SectionDivider title="ব্যক্তিগত তথ্য" color="text-blue-500" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="পূর্ণ নাম (ইংরেজি)" error={errors.fullNameEnglish?.message}>
                <input {...register("fullNameEnglish", { required: "আবশ্যক" })}
                  className={inputCls(errors.fullNameEnglish)} />
              </Field>
              <Field label="পূর্ণ নাম (বাংলা)" error={errors.fullNameBangla?.message}>
                <input {...register("fullNameBangla", { required: "আবশ্যক" })}
                  className={inputCls(errors.fullNameBangla)} />
              </Field>
              <Field label="মোবাইল নম্বর" error={errors.phone?.message}>
                <input {...register("phone", {
                  required: "আবশ্যক",
                  pattern: { value: /^01[3-9]\d{8}$/, message: "সঠিক নম্বর দিন" },
                })} className={inputCls(errors.phone)} />
              </Field>
              <Field label="ব্যক্তিগত ইমেইল" required={false} error={errors.guardianEmail?.message}>
                <input type="email" {...register("guardianEmail")}
                  className={inputCls(errors.guardianEmail)} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="ঠিকানা" error={errors.address?.message}>
                  <input {...register("address", { required: "আবশ্যক" })}
                    className={inputCls(errors.address)} />
                </Field>
              </div>
            </div>
          </div>

          {/* Professional */}
          <div className="space-y-4">
            <SectionDivider title="পেশাগত তথ্য" color="text-violet-500" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="পেশা" required={false} error={errors.occupation?.message}>
                <input {...register("occupation")} placeholder="Nurse, Teacher..."
                  className={inputCls(errors.occupation)} />
              </Field>
              <Field label="মাসিক আয় (টাকা)" required={false} error={errors.monthlyIncome?.message}>
                <input type="number" {...register("monthlyIncome", {
                  min: { value: 0, message: "সঠিক পরিমাণ দিন" },
                })} className={inputCls(errors.monthlyIncome)} />
              </Field>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 shrink-0">
          <button type="button" onClick={handleClose} disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50">
            বাতিল
          </button>
          <button disabled={isSubmitting} onClick={handleSubmit(onSubmit)}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-violet-600 rounded-xl hover:bg-violet-700 transition-all active:scale-95 disabled:opacity-60 shadow-lg shadow-violet-200">
            {isSubmitting
              ? <><Loader2 size={15} className="animate-spin" /> আপডেট হচ্ছে...</>
              : "তথ্য আপডেট করুন"
            }
          </button>
        </div>
      </div>
    </div>
  );
}