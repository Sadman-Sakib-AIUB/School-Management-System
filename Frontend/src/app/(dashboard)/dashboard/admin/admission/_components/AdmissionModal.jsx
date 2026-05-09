"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  X, Loader2, CheckCircle2,
  ChevronRight, UserPlus, GraduationCap,
} from "lucide-react";

import Swal from "sweetalert2";
import axiosInstance from "@/src/lib/axiosInstance";

// ------------------- CONSTANTS -------------------
const GENDER_OPTIONS = [{ value: "MALE", label: "পুরুষ" }, { value: "FEMALE", label: "মহিলা" }, { value: "OTHER", label: "অন্যান্য" }];
const BLOOD_OPTIONS = ["A_POSITIVE", "A_NEGATIVE", "B_POSITIVE", "B_NEGATIVE", "AB_POSITIVE", "AB_NEGATIVE", "O_POSITIVE", "O_NEGATIVE"];
const SHIFT_LABEL = { MORNING: "সকাল", DAY: "দিন", EVENING: "বিকাল" };

// ------------------- HELPERS -------------------
const inputCls = (err) =>
  `w-full px-3 py-2.5 text-sm rounded-xl border bg-gray-50 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-transparent ${err ? "border-red-300 bg-red-50" : "border-gray-200"
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

const SectionHeader = ({ title, color }) => (
  <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${color}`}>{title}</p>
);

// ------------------- STEP INDICATOR -------------------
const StepIndicator = ({ step }) => (
  <div className="flex items-center gap-0 mb-6">
    {[1, 2].map((s) => (
      <div key={s} className="flex items-center">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border-2 transition-all ${step > s
            ? "bg-emerald-500 border-emerald-500 text-white"
            : step === s
              ? "bg-violet-600 border-violet-600 text-white"
              : "bg-white border-gray-200 text-gray-400"
          }`}>
          {step > s ? <CheckCircle2 size={16} /> : s}
        </div>
        <span className={`ml-2 text-xs font-semibold ${step >= s ? "text-gray-700" : "text-gray-400"
          }`}>
          {s === 1 ? "শিক্ষার্থী তৈরি" : "সেকশনে ভর্তি"}
        </span>
        {s < 2 && (
          <div className={`mx-3 h-0.5 w-12 rounded-full ${step > 1 ? "bg-emerald-400" : "bg-gray-200"}`} />
        )}
      </div>
    ))}
  </div>
);

// ------------------- STEP 1: CREATE STUDENT -------------------
const Step1 = ({ onSuccess }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ mode: "onBlur" });

  const onSubmit = async (data) => {
    try {
      const res = await axiosInstance.post("/students", {
        username: data.username.trim(),
        email: data.email.trim(),
        password: data.password,
        studentCode: data.studentCode.trim().toUpperCase(),
        fullNameEnglish: data.fullNameEnglish.trim(),
        fullNameBangla: data.fullNameBangla.trim(),
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        bloodGroup: data.bloodGroup,
        phone: data.phone.trim(),
        address: data.address.trim(),
      });
      onSuccess(res.data?.data);
    } catch (err) {
      Swal.fire({
        icon: "error", title: "ব্যর্থ!",
        text: err.response?.data?.message || "শিক্ষার্থী তৈরি করতে ব্যর্থ হয়েছে।",
        confirmButtonText: "ঠিক আছে", confirmButtonColor: "#7c3aed",
        customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl px-5 py-2.5 font-semibold" },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Account */}
      <div>
        <SectionHeader title="অ্যাকাউন্ট তথ্য" color="text-violet-500" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="ইউজারনেম" error={errors.username?.message}>
            <input {...register("username", { required: "আবশ্যক" })} placeholder="karim_2025" className={inputCls(errors.username)} />
          </Field>
          <Field label="স্টুডেন্ট কোড" error={errors.studentCode?.message}>
            <input {...register("studentCode", { required: "আবশ্যক", pattern: { value: /^S-\d{4}-\d{3}$/, message: "S-YYYY-NNN ফরম্যাটে দিন" } })} placeholder="S-2025-001" className={inputCls(errors.studentCode)} />
          </Field>
          <Field label="ইমেইল" error={errors.email?.message}>
            <input type="email" {...register("email", { required: "আবশ্যক", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "সঠিক ইমেইল দিন" } })} placeholder="karim@student.com" className={inputCls(errors.email)} />
          </Field>
          <Field label="পাসওয়ার্ড" error={errors.password?.message}>
            <input type="password" {...register("password", { required: "আবশ্যক", minLength: { value: 6, message: "কমপক্ষে ৬ অক্ষর" } })} placeholder="••••••••" className={inputCls(errors.password)} />
          </Field>
        </div>
      </div>

      {/* Personal */}
      <div>
        <SectionHeader title="ব্যক্তিগত তথ্য" color="text-blue-500" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="পূর্ণ নাম (ইংরেজি)" error={errors.fullNameEnglish?.message}>
            <input {...register("fullNameEnglish", { required: "আবশ্যক" })} placeholder="Abdul Karim" className={inputCls(errors.fullNameEnglish)} />
          </Field>
          <Field label="পূর্ণ নাম (বাংলা)" error={errors.fullNameBangla?.message}>
            <input {...register("fullNameBangla", { required: "আবশ্যক" })} placeholder="আব্দুল করিম" className={inputCls(errors.fullNameBangla)} />
          </Field>
          <Field label="জন্ম তারিখ" error={errors.dateOfBirth?.message}>
            <input type="date" {...register("dateOfBirth", { required: "আবশ্যক" })} className={inputCls(errors.dateOfBirth)} />
          </Field>
          <Field label="লিঙ্গ" error={errors.gender?.message}>
            <select {...register("gender", { required: "আবশ্যক" })} className={inputCls(errors.gender)}>
              <option value="">নির্বাচন করুন</option>
              {GENDER_OPTIONS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
            </select>
          </Field>
          <Field label="রক্তের গ্রুপ" error={errors.bloodGroup?.message}>
            <select {...register("bloodGroup", { required: "আবশ্যক" })} className={inputCls(errors.bloodGroup)}>
              <option value="">নির্বাচন করুন</option>
              {BLOOD_OPTIONS.map((b) => <option key={b} value={b}>{b.replace("_", " ")}</option>)}
            </select>
          </Field>
          <Field label="মোবাইল নম্বর" error={errors.phone?.message}>
            <input {...register("phone", { required: "আবশ্যক", pattern: { value: /^01[3-9]\d{8}$/, message: "সঠিক নম্বর দিন" } })} placeholder="01XXXXXXXXX" className={inputCls(errors.phone)} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="ঠিকানা" error={errors.address?.message}>
              <input {...register("address", { required: "আবশ্যক" })} placeholder="Chittagong, Bangladesh" className={inputCls(errors.address)} />
            </Field>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button type="submit" disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-violet-600 rounded-xl hover:bg-violet-700 transition-all active:scale-95 disabled:opacity-60 shadow-lg shadow-violet-200">
          {isSubmitting
            ? <><Loader2 size={15} className="animate-spin" /> তৈরি হচ্ছে...</>
            : <>পরবর্তী ধাপ <ChevronRight size={15} /></>
          }
        </button>
      </div>
    </form>
  );
};

// ------------------- STEP 2: ENROLL STUDENT -------------------
const Step2 = ({ student, classes, onSuccess, onSkip }) => {
  const [sections, setSections] = useState([]);
  const [loadingSections, setLoadingSections] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    mode: "onBlur",
    defaultValues: { academicYear: new Date().getFullYear() },
  });

  const selectedClassId = watch("classId");

  // Load sections when class changes
  useEffect(() => {
    if (!selectedClassId) { setSections([]); return; }
    setLoadingSections(true);
    setValue("sectionId", "");
    axiosInstance.get("/sections", { params: { classId: selectedClassId, limit: 100 } })
      .then((res) => setSections(res.data?.data || []))
      .catch(() => setSections([]))
      .finally(() => setLoadingSections(false));
  }, [selectedClassId, setValue]);

  const onSubmit = async (data) => {
    try {
      await axiosInstance.post(`/students/${student.id}/enroll`, {
        sectionId: data.sectionId,
        academicYear: Number(data.academicYear),
        rollNumber: data.rollNumber.trim(),
      });

      await Swal.fire({
        icon: "success", title: "ভর্তি সম্পন্ন!",
        html: `<strong>${student.fullNameEnglish}</strong> সফলভাবে ভর্তি হয়েছে।`,
        confirmButtonText: "ঠিক আছে", confirmButtonColor: "#7c3aed",
        customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl px-5 py-2.5 font-semibold" },
      });
      onSuccess();
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
    <div className="space-y-5">
      {/* Created student summary */}
      <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700 font-bold text-lg shrink-0">
          {student.fullNameEnglish?.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-gray-800 text-sm">{student.fullNameEnglish}</p>
          <p className="text-xs text-gray-500">{student.studentCode} · {student.user?.email}</p>
        </div>
        <CheckCircle2 size={18} className="text-emerald-500 ml-auto shrink-0" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <SectionHeader title="সেকশন নির্বাচন করুন" color="text-violet-500" />

        <Field label="ক্লাস" error={errors.classId?.message}>
          <select {...register("classId", { required: "ক্লাস নির্বাচন করুন" })} className={inputCls(errors.classId)}>
            <option value="">— ক্লাস বেছে নিন —</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>{c.name} ({c.academicYear})</option>
            ))}
          </select>
        </Field>

        <Field label="সেকশন" error={errors.sectionId?.message}>
          <select {...register("sectionId", { required: "সেকশন নির্বাচন করুন" })} className={inputCls(errors.sectionId)} disabled={!selectedClassId || loadingSections}>
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
            <input type="number" {...register("academicYear", { required: "আবশ্যক", min: { value: 2000, message: "সঠিক বছর দিন" } })} className={inputCls(errors.academicYear)} />
          </Field>
          <Field label="রোল নম্বর" error={errors.rollNumber?.message}>
            <input {...register("rollNumber", { required: "আবশ্যক" })} placeholder="01" className={inputCls(errors.rollNumber)} />
          </Field>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button type="button" onClick={onSkip}
            className="text-sm font-semibold text-gray-500 hover:text-gray-700 underline underline-offset-2">
            এখন নয়, পরে ভর্তি করব
          </button>
          <button type="submit" disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-violet-600 rounded-xl hover:bg-violet-700 transition-all active:scale-95 disabled:opacity-60 shadow-lg shadow-violet-200">
            {isSubmitting
              ? <><Loader2 size={15} className="animate-spin" /> ভর্তি হচ্ছে...</>
              : <><GraduationCap size={15} /> ভর্তি সম্পন্ন করুন</>
            }
          </button>
        </div>
      </form>
    </div>
  );
};

// ------------------- MAIN WIZARD MODAL -------------------
const AdmissionModal = ({ isOpen, onClose, onSuccess, classes }) => {
  const [step, setStep] = useState(1);
  const [createdStudent, setCreatedStudent] = useState(null);

  useEffect(() => {
    if (isOpen) { setStep(1); setCreatedStudent(null); }
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStep1Success = (student) => {
    setCreatedStudent(student);
    setStep(2);
  };

  const handleDone = () => { onClose(); onSuccess?.(); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">
      <div className="bg-white w-full max-w-2xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center">
              <UserPlus size={17} className="text-violet-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">নতুন ভর্তি</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-7 py-6">
          <StepIndicator step={step} />

          {step === 1 && <Step1 onSuccess={handleStep1Success} />}
          {step === 2 && (
            <Step2
              student={createdStudent}
              classes={classes}
              onSuccess={handleDone}
              onSkip={handleDone}
            />
          )}
        </div>

      </div>
    </div>
  );
}

export default AdmissionModal;