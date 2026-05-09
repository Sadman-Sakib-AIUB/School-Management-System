"use client";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  X, Loader2, UserPlus, ChevronRight, CheckCircle2,
  Download, Printer, User, Mail, Phone, MapPin,
  Briefcase, CreditCard, Building2, Hash, Eye, EyeOff,
  Shield, PartyPopper,
  AlertCircleIcon,
} from "lucide-react";

import Swal from "sweetalert2";
import axiosInstance from "@/src/lib/axiosInstance";
import StepIndicator from "../StepIndicator";

// ------ CONSTANTS ------
const PORTAL_URL = typeof window !== "undefined" ? window.location.origin : "https://school.demo.com";
// console.log(PORTAL_URL);

// -- HELPERS -- 
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
    {error && <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
      <AlertCircleIcon className="w-3 h-3" />
      {error}
    </p>}
  </div>
);

const SectionTitle = ({ title, color = "text-violet-500" }) => (
  <p className={`text-xs font-bold uppercase tracking-widest pb-2 border-b border-gray-100 ${color}`}>
    {title}
  </p>
);



// STEP 1: ACCOUNT 
const Step1 = ({ onNext, defaultValues }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({ mode: "onBlur", defaultValues });
  const [showPw, setShowPw] = useState(false);
  // console.log("Username Error:", errors.username);

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate className="space-y-5">
      <SectionTitle title="অ্যাকাউন্ট তথ্য" color="text-violet-500" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

        <Field label="ইউজারনেম" error={errors.username?.message}>
          <input {...register("username", { required: "আবশ্যক" })}
            placeholder="tania" className={inputCls(errors.username)} />
        </Field>

        <Field label="গার্ডিয়ান কোড" error={errors.guardianCode?.message}>
          <input {...register("guardianCode", {
            required: "আবশ্যক",
            pattern: { value: /^G-\d{4}-\d{3}$/, message: "G-YYYY-NNN ফরম্যাট" },
          })} placeholder="G-2025-001" className={inputCls(errors.guardianCode)} />
        </Field>

        <Field label="লগইন ইমেইল" error={errors.email?.message}>
          <input type="email" {...register("email", {
            required: "আবশ্যক",
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "সঠিক ইমেইল দিন" },
          })} placeholder="tania@school.com" className={inputCls(errors.email)} />
        </Field>

        <Field label="পাসওয়ার্ড" error={errors.password?.message}>

          <div className="relative">
            <input type={showPw ? "text" : "password"} {...register("password", {
              required: "আবশ্যক", minLength: { value: 6, message: "কমপক্ষে ৬ অক্ষর" },
            })} placeholder="••••••••" className={`${inputCls(errors.password)} pr-10`} />

            <button type="button" onClick={() => setShowPw(v => !v)}
              className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

          </div>
        </Field>
      </div>

      <div className="flex justify-end pt-1">
        <button type="submit"
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-violet-600 rounded-xl hover:bg-violet-700 active:scale-95 shadow-lg shadow-violet-200">
          পরবর্তী <ChevronRight size={15} />
        </button>
      </div>
    </form>
  );
};

// STEP 2: PERSONAL 
const Step2 = ({ onNext, onBack, defaultValues }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({ mode: "onBlur", defaultValues });

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate className="space-y-5">
      <SectionTitle title="ব্যক্তিগত ও যোগাযোগ তথ্য" color="text-blue-500" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

        <Field label="পূর্ণ নাম (ইংরেজি)" error={errors.fullNameEnglish?.message}>
          <input {...register("fullNameEnglish", { required: "আবশ্যক" })}
            placeholder="Tania Sultana" className={inputCls(errors.fullNameEnglish)} />
        </Field>

        <Field label="পূর্ণ নাম (বাংলা)" error={errors.fullNameBangla?.message}>
          <input {...register("fullNameBangla", { required: "আবশ্যক" })}
            placeholder="তানিয়া সুলতানা" className={inputCls(errors.fullNameBangla)} />
        </Field>

        <Field label="মোবাইল নম্বর" error={errors.phone?.message}>
          <input {...register("phone", {
            required: "আবশ্যক",
            pattern: { value: /^01[3-9]\d{8}$/, message: "সঠিক নম্বর দিন" },
          })} placeholder="01XXXXXXXXX" className={inputCls(errors.phone)} />
        </Field>

        <Field label="ব্যক্তিগত ইমেইল" required={false} error={errors.guardianEmail?.message}>
          <input type="email" {...register("guardianEmail")}
            placeholder="tania@gmail.com" className={inputCls(errors.guardianEmail)} />
        </Field>

        <Field label="NID" required={false} error={errors.nid?.message}>
          <input {...register("nid")} placeholder="1234567890"
            className={inputCls(errors.nid)} />
        </Field>

        <Field label="পেশা" required={false} error={errors.occupation?.message}>
          <input {...register("occupation")} placeholder="Nurse, Teacher…"
            className={inputCls(errors.occupation)} />
        </Field>

        <Field label="মাসিক আয় (৳)" required={false} error={errors.monthlyIncome?.message}>
          <input type="number" {...register("monthlyIncome", { min: { value: 0, message: "সঠিক পরিমাণ" } })}
            placeholder="35000" className={inputCls(errors.monthlyIncome)} />
        </Field>

        <div className="sm:col-span-2">
          <Field label="ঠিকানা" error={errors.address?.message}>
            <input {...register("address", { required: "আবশ্যক" })}
              placeholder="Mymensingh, Bangladesh" className={inputCls(errors.address)} />
          </Field>
        </div>
      </div>
      <div className="flex items-center justify-between pt-1">
        <button type="button" onClick={onBack}
          className="text-sm font-semibold text-gray-500 hover:text-gray-700 underline underline-offset-2">
          ← পূর্ববর্তী
        </button>
        <button type="submit"
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-violet-600 rounded-xl hover:bg-violet-700 active:scale-95 shadow-lg shadow-violet-200">
          পর্যালোচনা করুন <ChevronRight size={15} />
        </button>
      </div>
    </form>
  );
};

// STEP 3: REVIEW 
const ReviewRow = ({ icon: Icon, label, value, sensitive }) => (
  <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
    <Icon size={13} className="text-gray-400 mt-0.5 shrink-0" />
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-400">{label}</p>
      <p className={`text-sm font-semibold wrap-break-words mt-0.5 ${sensitive ? "font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg inline-block" : "text-gray-800"}`}>
        {value || "—"}
      </p>
    </div>
  </div>
);

const ReviewCard = ({ title, color, children }) => (
  <div className="bg-gray-50 rounded-2xl overflow-hidden">
    <p className={`text-xs font-bold uppercase tracking-widest px-4 py-2.5 ${color}`}>{title}</p>
    <div className="px-4 pb-1">{children}</div>
  </div>
);

const Step3 = ({ data, onConfirm, onBack, isSubmitting }) => (
  <div className="space-y-4">
    <div className="flex items-start gap-3 p-4 bg-violet-50 border border-violet-100 rounded-2xl">
      <Shield size={16} className="text-violet-500 mt-0.5 shrink-0" />
      <p className="text-xs text-violet-700 font-medium">
        সব তথ্য যাচাই করুন। নিশ্চিত করলে অ্যাকাউন্ট তৈরি হবে এবং একটি PDF প্রিন্টযোগ্য কার্ড পাবেন।
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <ReviewCard title="অ্যাকাউন্ট তথ্য" color="text-violet-600 bg-violet-50">
        <ReviewRow icon={Hash} label="গার্ডিয়ান কোড" value={data.guardianCode} />
        <ReviewRow icon={User} label="ইউজারনেম" value={data.username} />
        <ReviewRow icon={Mail} label="লগইন ইমেইল" value={data.email} />
        <ReviewRow icon={Shield} label="পাসওয়ার্ড" value={data.password} sensitive />
      </ReviewCard>

      <ReviewCard title="ব্যক্তিগত তথ্য" color="text-blue-600 bg-blue-50">
        <ReviewRow icon={User} label="নাম (ইংরেজি)" value={data.fullNameEnglish} />
        <ReviewRow icon={User} label="নাম (বাংলা)" value={data.fullNameBangla} />
        <ReviewRow icon={Phone} label="মোবাইল" value={data.phone} />
        <ReviewRow icon={Mail} label="ব্যক্তিগত ইমেইল" value={data.guardianEmail} />
      </ReviewCard>

      <ReviewCard title="অতিরিক্ত তথ্য" color="text-emerald-600 bg-emerald-50">
        <ReviewRow icon={MapPin} label="ঠিকানা" value={data.address} />
        <ReviewRow icon={CreditCard} label="NID" value={data.nid} />
        <ReviewRow icon={Briefcase} label="পেশা" value={data.occupation} />
        <ReviewRow icon={CreditCard} label="মাসিক আয়" value={data.monthlyIncome ? `৳ ${Number(data.monthlyIncome).toLocaleString()}` : null} />
      </ReviewCard>
    </div>

    <div className="flex items-center justify-between pt-2">
      <button type="button" onClick={onBack} disabled={isSubmitting}
        className="text-sm font-semibold text-gray-500 hover:text-gray-700 underline underline-offset-2 disabled:opacity-40">
        ← এডিট করুন
      </button>
      <button onClick={onConfirm} disabled={isSubmitting}
        className="flex items-center gap-2 px-7 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 active:scale-95 disabled:opacity-60 shadow-lg shadow-emerald-200">
        {isSubmitting
          ? <><Loader2 size={15} className="animate-spin" /> তৈরি হচ্ছে...</>
          : <><CheckCircle2 size={15} /> নিশ্চিত করুন ও তৈরি করুন</>
        }
      </button>
    </div>
  </div>
);

// STEP 4: SUCCESS + PDF 
const Step4 = ({ formData, createdData, onClose }) => {
  const pdfRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const institutionName = createdData?.institution?.name || "Demo High School";
  // console.log(institutionName);
  const guardianCode = createdData?.guardianCode || formData.guardianCode;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: html2canvas } = await import("html2canvas");

      const el = pdfRef.current;
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a5"
      });

      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = (canvas.height * pdfW) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfW, pdfH);
      pdf.save(`guardian-${guardianCode}.pdf`);
    } catch (err) {
      console.error("PDF error:", err);
    } finally {
      setDownloading(false);
    }
  };


  const handlePrint = () => {
    const el = pdfRef.current;
    if (!el) return;
    const win = window.open("", "_blank");
    win.document.write(`
      <html><head><title>Guardian Card — ${guardianCode}</title>
      <style>
        body { margin: 0; padding: 0; font-family: sans-serif; }
        @media print { @page { size: A5; margin: 0; } }
      </style></head>
      <body>${el.outerHTML}</body></html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 300);
  };

  return (
    <div className="space-y-5">
      {/* Success banner */}
      <div className="flex flex-col items-center text-center py-4">
        <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-3">
          <PartyPopper size={26} className="text-emerald-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">অ্যাকাউন্ট তৈরি হয়েছে!</h3>
        <p className="text-sm text-gray-400 mt-1">
          <span className="font-semibold text-gray-600">{formData.fullNameEnglish}</span>-এর গার্ডিয়ান অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।
        </p>
      </div>

      {/* Printable card */}
      <div
        ref={pdfRef}
        style={{
          fontFamily: "'Segoe UI', Arial, sans-serif",
          backgroundColor: "#fff",
          border: "1px solid #e5e7eb", 
          borderRadius: "1rem",        
          overflow: "hidden"      
        }}
      >
        {/* Card header */}
        <div style={{
          background: "#7c3aed",
          padding: "20px 24px"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "#ffffff33",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              fontWeight: 700,
              color: "#fff",
            }}>
              {formData.fullNameEnglish?.charAt(0) || "G"}
            </div>
            <div>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: 16, margin: 0 }}>{formData.fullNameEnglish}</p>
              <p style={{ color: "#ffffffbf", fontSize: 12, margin: "2px 0 0" }}>{formData.fullNameBangla}</p>
            </div>
            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <p style={{ color: "#ffffffbf", fontSize: 10, margin: 0 }}>Guardian Code</p>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: 13, margin: "2px 0 0", fontFamily: "monospace" }}>{guardianCode}</p>
            </div>
          </div>
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #ffffff33" }}>
            <p style={{ color: "#ffffffb3", fontSize: 10, margin: 0 }}>{institutionName} · অভিভাবক পরিচয়পত্র</p>
          </div>
        </div>

        {/* Card body */}
        <div style={{ padding: "20px 24px" }}>

          {/* Login credentials — highlighted */}
          <div style={{ background: "#fef3c7", border: "1px solid #fcd34d", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#92400e", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 10px" }}>
              🔐 পোর্টাল লগইন তথ্য (গোপনীয়)
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {[
                ["পোর্টাল ঠিকানা", PORTAL_URL],
                ["ইউজারনেম", formData.username],
                ["লগইন ইমেইল", formData.email],
                ["পাসওয়ার্ড", formData.password],
              ].map(([label, val]) => (
                <div key={label}>
                  <p style={{ fontSize: 9, color: "#78350f", fontWeight: 600, margin: 0 }}>{label}</p>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#92400e", margin: "2px 0 0", wordBreak: "break-all" }}>{val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Personal info grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {[
              ["মোবাইল নম্বর", formData.phone],
              ["ব্যক্তিগত ইমেইল", formData.guardianEmail],
              ["ঠিকানা", formData.address],
              ["NID", formData.nid],
              ["পেশা", formData.occupation],
              ["মাসিক আয়", formData.monthlyIncome ? `৳ ${Number(formData.monthlyIncome).toLocaleString()}` : null],
            ].filter(([, v]) => v).map(([label, val]) => (
              <div key={label} style={{ borderBottom: "1px solid #f3f4f6", paddingBottom: 8 }}>
                <p style={{ fontSize: 9, color: "#9ca3af", fontWeight: 600, margin: 0, textTransform: "uppercase" }}>{label}</p>
                <p style={{ fontSize: 11, color: "#1f2937", fontWeight: 600, margin: "3px 0 0", wordBreak: "break-all" }}>{val}</p>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <p style={{ fontSize: 9, color: "#9ca3af", margin: 0, maxWidth: "70%" }}>
              এই পরিচয়পত্রটি গোপন রাখুন। পাসওয়ার্ড প্রথম লগইনের পরে পরিবর্তন করুন।
            </p>
            <p style={{ fontSize: 9, color: "#d1d5db", margin: 0 }}>
              {new Date().toLocaleDateString("en-BD")}
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <button onClick={handleDownload} disabled={downloading}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-violet-600 rounded-xl hover:bg-violet-700 active:scale-95 disabled:opacity-60 shadow-lg shadow-violet-200 transition-all">
          {downloading
            ? <><Loader2 size={15} className="animate-spin" /> তৈরি হচ্ছে...</>
            : <><Download size={15} /> PDF ডাউনলোড করুন</>
          }
        </button>
        <button onClick={handlePrint}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-violet-700 bg-violet-50 border border-violet-200 rounded-xl hover:bg-violet-100 active:scale-95 transition-all">
          <Printer size={15} /> প্রিন্ট করুন
        </button>
      </div>

      <div className="flex justify-center pt-1">
        <button onClick={onClose}
          className="text-sm font-semibold text-gray-400 hover:text-gray-600 underline underline-offset-2">
          বন্ধ করুন
        </button>
      </div>
    </div>
  );
};


const CreateGuardianModal = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [step1Data, setStep1Data] = useState(null);
  const [step2Data, setStep2Data] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdGuardian, setCreatedGuardian] = useState(null);

  const handleClose = () => {
    if (isSubmitting) return;
    setStep(1);
    setStep1Data(null);
    setStep2Data(null);
    setCreatedGuardian(null);
    onClose();
  };

  const handleStep1 = (data) => { setStep1Data(data); setStep(2); };
  const handleStep2 = (data) => { setStep2Data(data); setStep(3); };

  const allData = { ...step1Data, ...step2Data };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        username: allData.username.trim(),
        email: allData.email.trim(),
        password: allData.password,
        guardianCode: allData.guardianCode.trim().toUpperCase(),
        fullNameEnglish: allData.fullNameEnglish.trim(),
        fullNameBangla: allData.fullNameBangla.trim(),
        phone: allData.phone.trim(),
        guardianEmail: allData.guardianEmail?.trim() || undefined,
        address: allData.address.trim(),
        nid: allData.nid?.trim() || undefined,
        occupation: allData.occupation?.trim() || undefined,
        monthlyIncome: allData.monthlyIncome ? Number(allData.monthlyIncome) : undefined,
      };

      const res = await axiosInstance.post("/guardians", payload);
      setCreatedGuardian(res.data?.data);
      setStep(4);
      onSuccess?.();
    } catch (err) {
      Swal.fire({
        icon: "error", title: "ব্যর্থ!",
        text: err.response?.data?.message || "গার্ডিয়ান তৈরি করতে ব্যর্থ হয়েছে।",
        confirmButtonText: "ঠিক আছে", confirmButtonColor: "#7c3aed",
        customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl px-6 py-2.5 font-semibold" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">
      <div className="bg-white w-full max-w-2xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center">
              <UserPlus size={17} className="text-violet-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">নতুন গার্ডিয়ান তৈরি</h2>
          </div>
          {step !== 4 && (
            <button onClick={handleClose} disabled={isSubmitting}
              className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 disabled:opacity-40">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-7 py-6">
          <StepIndicator step={step} />

          {step === 1 && <Step1 onNext={handleStep1} defaultValues={step1Data} />}
          {step === 2 && <Step2 onNext={handleStep2} onBack={() => setStep(1)} defaultValues={step2Data} />}
          {step === 3 && <Step3 data={allData} onConfirm={handleConfirm} onBack={() => setStep(2)} isSubmitting={isSubmitting} />}
          {step === 4 && <Step4 formData={allData} createdData={createdGuardian} onClose={handleClose} />}
        </div>
      </div>
    </div>
  );
}

export default CreateGuardianModal;