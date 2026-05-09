"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Loader2, User, Briefcase, Lock, CreditCard } from "lucide-react";
import axiosInstance from "../../../../../lib/axiosInstance";
import Swal from "sweetalert2";

// ------------- CONSTANTS ------------------
const GENDER_OPTIONS = ["MALE", "FEMALE", "OTHER"];
const BLOOD_OPTIONS = ["A_POSITIVE", "A_NEGATIVE", "B_POSITIVE", "B_NEGATIVE", "AB_POSITIVE", "AB_NEGATIVE", "O_POSITIVE", "O_NEGATIVE"];
const DEPT_OPTIONS = ["Science", "Arts", "Commerce", "Mathematics", "Bengali", "English", "Social Science", "ICT", "Physical Education", "Religious Studies"];
const DESIG_OPTIONS = ["Head of Department", "Senior Teacher", "Assistant Teacher", "Junior Teacher", "Lecturer"];

// --------------------- FIELD COMPONENT -------------------------
const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
      {label} <span className="text-red-400">*</span>
    </label>
    {children}
    {error && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"> ⚠️ {error}</p>}
  </div>
);

const inputCls = (hasError) =>
  `w-full px-3 py-2.5 text-sm rounded-xl border bg-gray-50 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-transparent ${hasError ? "border-red-300 bg-red-50" : "border-gray-200"
  }`;

// ----------------------- SECTION HEADER -----------------------
const SectionHeader = ({ icon: Icon, title, color }) => (
  <div className={`flex items-center gap-2.5 pb-3 mb-5 border-b-2 ${color}`}>
    <div className={`p-1.5 rounded-lg ${color.replace("border-", "bg-").replace("-200", "-100")}`}>
      <Icon size={16} className={color.replace("border-", "text-").replace("-200", "-600")} />
    </div>
    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">{title}</h3>
  </div>
);

// ------------------------- MAIN MODAL --------------------------
export default function AddTeacherModal({ isOpen, onClose, onSuccess }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onBlur" });

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    try {
      // Convert salary to number
      const payload = { ...data, salary: Number(data.salary) };

      const res = await axiosInstance.post("/teachers", payload);

      const teacherName = res.data?.data?.fullNameEnglish || "শিক্ষক";

      await Swal.fire({
        icon: "success",
        title: "সফল!",
        html: `<strong>${teacherName}</strong> সফলভাবে যোগ করা হয়েছে।`,
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#7c3aed",
        borderRadius: "16px",
        customClass: {
          popup: "rounded-2xl",
          confirmButton: "rounded-xl px-6 py-2.5 font-semibold",
        },
      });

      reset();
      onClose();
      onSuccess?.(); // triggers list refresh when GET API is ready
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "শিক্ষক যোগ করতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।";

      Swal.fire({
        icon: "error",
        title: "ব্যর্থ!",
        text: message,
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#7c3aed",
        customClass: {
          popup: "rounded-2xl",
          confirmButton: "rounded-xl px-6 py-2.5 font-semibold",
        },
      });
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">

        {/* ── MODAL HEADER ── */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-white shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">নতুন শিক্ষক যোগ করুন</h2>
            <p className="text-sm text-gray-400 mt-0.5">সকল তারকা চিহ্নিত (*) তথ্য আবশ্যক</p>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-red-600 disabled:opacity-40"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── FORM BODY (scrollable) ── */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto px-8 py-6 space-y-8"
          noValidate
        >

          {/* ── SECTION 1: Account ── */}
          <div>
            <SectionHeader icon={Lock} title="অ্যাকাউন্ট তথ্য" color="border-violet-200" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="ইউজারনেম" error={errors.username?.message}>
                <input
                  {...register("username", {
                    required: "ইউজারনেম আবশ্যক",
                    minLength: { value: 3, message: "কমপক্ষে ৩ অক্ষর" },
                    pattern: { value: /^[a-z0-9_]+$/, message: "শুধু ছোট হাতের অক্ষর, সংখ্যা ও _ ব্যবহার করুন" },
                  })}
                  placeholder="arif_math"
                  className={inputCls(errors.username)}
                />
              </Field>
              <Field label="লগইন ইমেইল" error={errors.email?.message}>
                <input
                  type="email"
                  {...register("email", {
                    required: "ইমেইল আবশ্যক",
                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "সঠিক ইমেইল দিন" },
                  })}
                  placeholder="arif@school.com"
                  className={inputCls(errors.email)}
                />
              </Field>
              <Field label="পাসওয়ার্ড" error={errors.password?.message}>
                <input
                  type="password"
                  {...register("password", {
                    required: "পাসওয়ার্ড আবশ্যক",
                    minLength: { value: 8, message: "কমপক্ষে ৮ অক্ষর" },
                    pattern: { value: /^(?=.*[A-Z])(?=.*[0-9])/, message: "একটি বড় হাতের অক্ষর ও একটি সংখ্যা থাকতে হবে" },
                  })}
                  placeholder="••••••••"
                  className={inputCls(errors.password)}
                />
              </Field>
            </div>
          </div>

          {/* ── SECTION 2: Personal ── */}
          <div>
            <SectionHeader icon={User} title="ব্যক্তিগত তথ্য" color="border-blue-200" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="পূর্ণ নাম (ইংরেজি)" error={errors.fullNameEnglish?.message}>
                <input
                  {...register("fullNameEnglish", { required: "নাম আবশ্যক" })}
                  placeholder="Arifur Rahman"
                  className={inputCls(errors.fullNameEnglish)}
                />
              </Field>
              <Field label="পূর্ণ নাম (বাংলা)" error={errors.fullNameBangla?.message}>
                <input
                  {...register("fullNameBangla", { required: "নাম আবশ্যক" })}
                  placeholder="আরিফুর রহমান"
                  className={inputCls(errors.fullNameBangla)}
                />
              </Field>
              <Field label="জন্ম তারিখ" error={errors.dateOfBirth?.message}>
                <input
                  type="date"
                  {...register("dateOfBirth", { required: "জন্ম তারিখ আবশ্যক" })}
                  className={inputCls(errors.dateOfBirth)}
                />
              </Field>
              <Field label="লিঙ্গ" error={errors.gender?.message}>
                <select
                  {...register("gender", { required: "লিঙ্গ নির্বাচন করুন" })}
                  className={inputCls(errors.gender)}
                >
                  <option value="">নির্বাচন করুন</option>
                  {GENDER_OPTIONS.map((g) => (
                    <option key={g} value={g}>{g === "MALE" ? "পুরুষ" : g === "FEMALE" ? "মহিলা" : "অন্যান্য"}</option>
                  ))}
                </select>
              </Field>
              <Field label="রক্তের গ্রুপ" error={errors.bloodGroup?.message}>
                <select
                  {...register("bloodGroup", { required: "রক্তের গ্রুপ আবশ্যক" })}
                  className={inputCls(errors.bloodGroup)}
                >
                  <option value="">নির্বাচন করুন</option>
                  {BLOOD_OPTIONS.map((b) => (
                    <option key={b} value={b}>{b.replace("_", " ")}</option>
                  ))}
                </select>
              </Field>
              <Field label="মোবাইল নম্বর" error={errors.phone?.message}>
                <input
                  {...register("phone", {
                    required: "মোবাইল নম্বর আবশ্যক",
                    pattern: { value: /^01[3-9]\d{8}$/, message: "সঠিক বাংলাদেশি নম্বর দিন" },
                  })}
                  placeholder="01XXXXXXXXX"
                  className={inputCls(errors.phone)}
                />
              </Field>
              <Field label="জাতীয় পরিচয়পত্র নম্বর (NID)" error={errors.nid?.message}>
                <input
                  {...register("nid", {
                    required: "NID আবশ্যক",
                    pattern: { value: /^\d{10,17}$/, message: "১০-১৭ সংখ্যার NID নম্বর দিন" },
                  })}
                  placeholder="1234567890"
                  className={inputCls(errors.nid)}
                />
              </Field>
              <Field label="ঠিকানা" error={errors.address?.message}>
                <input
                  {...register("address", { required: "ঠিকানা আবশ্যক" })}
                  placeholder="Gazipur, Bangladesh"
                  className={inputCls(errors.address)}
                />
              </Field>
            </div>
          </div>

          {/* ── SECTION 3: Professional ── */}
          <div>
            <SectionHeader icon={Briefcase} title="পেশাগত তথ্য" color="border-emerald-200" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="শিক্ষক কোড" error={errors.teacherCode?.message}>
                <input
                  {...register("teacherCode", {
                    required: "শিক্ষক কোড আবশ্যক",
                    pattern: { value: /^T-\d{4}-\d{3,}$/, message: "ফরম্যাট: T-2025-001" },
                  })}
                  placeholder="T-2025-007"
                  className={inputCls(errors.teacherCode)}
                />
              </Field>
              <Field label="যোগদানের তারিখ" error={errors.joiningDate?.message}>
                <input
                  type="date"
                  {...register("joiningDate", { required: "যোগদানের তারিখ আবশ্যক" })}
                  className={inputCls(errors.joiningDate)}
                />
              </Field>
              <Field label="বিভাগ" error={errors.department?.message}>
                <select
                  {...register("department", { required: "বিভাগ নির্বাচন করুন" })}
                  className={inputCls(errors.department)}
                >
                  <option value="">নির্বাচন করুন</option>
                  {DEPT_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </Field>
              <Field label="পদবি" error={errors.designation?.message}>
                <select
                  {...register("designation", { required: "পদবি নির্বাচন করুন" })}
                  className={inputCls(errors.designation)}
                >
                  <option value="">নির্বাচন করুন</option>
                  {DESIG_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </Field>

              <Field label="বিষয়" error={errors.subject?.message}>
                <input
                  {...register("subject", { required: "বিষয় আবশ্যক" })}
                  placeholder="Mathematics"
                  className={inputCls(errors.subject)}
                />
              </Field>
              
              <Field label="শিক্ষাগত যোগ্যতা" error={errors.qualification?.message}>
                <input
                  {...register("qualification", { required: "যোগ্যতা আবশ্যক" })}
                  placeholder="Ph.D in Mathematics"
                  className={inputCls(errors.qualification)}
                />
              </Field>
              <Field label="ব্যক্তিগত ইমেইল" error={errors.teacherEmail?.message}>
                <input
                  type="email"
                  {...register("teacherEmail", {
                    required: "ব্যক্তিগত ইমেইল আবশ্যক",
                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "সঠিক ইমেইল দিন" },
                  })}
                  placeholder="personal@gmail.com"
                  className={inputCls(errors.teacherEmail)}
                />
              </Field>
            </div>
          </div>

          {/* ── SECTION 4: Financial ── */}
          <div>
            <SectionHeader icon={CreditCard} title="আর্থিক তথ্য" color="border-amber-200" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="মাসিক বেতন (টাকা)" error={errors.salary?.message}>
                <input
                  type="number"
                  {...register("salary", {
                    required: "বেতন আবশ্যক",
                    min: { value: 1000, message: "বেতন কমপক্ষে ১,০০০ টাকা হতে হবে" },
                  })}
                  placeholder="75000"
                  className={inputCls(errors.salary)}
                />
              </Field>
            </div>
          </div>

        </form>

        {/* ── MODAL FOOTER ── */}
        <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-gray-100 bg-gray-50/50 shrink-0">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            বাতিল
          </button>
          <button
            type="submit"
            form="add-teacher-form"
            disabled={isSubmitting}
            onClick={handleSubmit(onSubmit)}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 shadow-lg shadow-violet-200"
          >
            {isSubmitting ? (
              <><Loader2 size={16} className="animate-spin" /> সংরক্ষণ হচ্ছে...</>
            ) : (
              <>শিক্ষক যোগ করুন</>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}