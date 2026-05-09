"use client";
import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  X, ChevronRight, Loader2,
  CheckCircle2, BookOpen, LayoutGrid, ClipboardList, AlertCircle, CheckSquare, Square,
} from "lucide-react";

import Swal from "sweetalert2";
import axiosInstance from "@/src/lib/axiosInstance";
import Link from "next/link";

// ----- CONSTANTS ------
const EXAM_TYPES = [
  { value: "CLASS_TEST", label: "ক্লাস টেস্ট" },
  { value: "WEEKLY_TEST", label: "সপ্তাহিক টেস্ট" },
  { value: "MIDTERM", label: "অর্ধ-বার্ষিক" },
  { value: "FINAL", label: "বার্ষিক" },
];

export const CATEGORY_COLORS = {
  MATHEMATICS: "bg-blue-100 text-blue-700",
  SCIENCE: "bg-emerald-100 text-emerald-700",
  LANGUAGES: "bg-violet-100 text-violet-700",
  SOCIAL: "bg-amber-100 text-amber-700",
  RELIGIOUS: "bg-rose-100 text-rose-700",
  ARTS: "bg-pink-100 text-pink-700",
  PHYSICAL: "bg-cyan-100 text-cyan-700",
  OTHER: "bg-gray-100 text-gray-600",
};

const inputCls = (err) =>
  `w-full px-3 py-2.5 text-sm rounded-xl border bg-gray-50 outline-none transition-all
   focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-transparent ${err ? "border-red-300 bg-red-50" : "border-gray-200"}`;

const Field = ({ label, required = true, error, children }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
    {error && <p className="mt-1 text-xs text-red-500">⚠ {error}</p>}
  </div>
);

// ------- STEP INDICATOR -------
const STEPS = ["ক্লাস নির্বাচন", "সেকশন নির্বাচন", "পরীক্ষা তৈরি"];
const StepIndicator = ({ step }) => (
  <div className="flex items-center mb-6">
    {STEPS.map((label, idx) => {
      const s = idx + 1;
      const done = step > s, active = step === s;
      return (
        <div key={s} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border-2 transition-all ${done ? "bg-emerald-500 border-emerald-500 text-white" :
                active ? "bg-violet-600 border-violet-600 text-white" :
                  "bg-white border-gray-200 text-gray-400"
              }`}>
              {done ? <CheckCircle2 size={15} /> : s}
            </div>
            <span className={`mt-1 text-xs font-semibold whitespace-nowrap ${active ? "text-violet-700" : done ? "text-emerald-600" : "text-gray-400"
              }`}>{label}</span>
          </div>
          {s < STEPS.length && (
            <div className={`h-0.5 w-8 sm:w-14 mx-1 mb-4 rounded-full ${step > s ? "bg-emerald-400" : "bg-gray-200"}`} />
          )}
        </div>
      );
    })}
  </div>
);

// --------- STEP 1: PICK CLASS ---------
const Step1 = ({ classes, loading, selected, onSelect, onNext }) => (
  <div className="space-y-4">
    <p className="text-sm text-gray-500">কোন ক্লাসের জন্য পরীক্ষা তৈরি করতে চান?</p>
    {loading ? (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Array(6).fill(0).map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />)}
      </div>
    ) : (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {classes.map((cls) => (
          <button key={cls.id} type="button" onClick={() => onSelect(cls)}
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${selected?.id === cls.id
                ? "border-violet-500 bg-violet-50 shadow-lg shadow-violet-100"
                : "border-gray-100 bg-white hover:border-violet-200 hover:bg-violet-50/30"
              }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selected?.id === cls.id ? "bg-violet-500 text-white" : "bg-gray-100 text-gray-500"
              }`}>
              <BookOpen size={18} />
            </div>
            <div className="text-center">
              <p className={`text-sm font-bold ${selected?.id === cls.id ? "text-violet-700" : "text-gray-700"}`}>
                {cls.name}
              </p>
              <p className="text-xs text-gray-400">{cls.academicYear}</p>
            </div>
          </button>
        ))}
      </div>
    )}
    <div className="flex justify-end pt-2">
      <button onClick={onNext} disabled={!selected}
        className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-violet-600 rounded-xl hover:bg-violet-700 active:scale-95 disabled:opacity-40 shadow-lg shadow-violet-200">
        পরবর্তী <ChevronRight size={15} />
      </button>
    </div>
  </div>
);

// --------- STEP 2: PICK SECTIONS (multi-select) ---------------
const SHIFT_BN = { MORNING: "সকাল", DAY: "দিন", EVENING: "বিকাল" };

const Step2 = ({ cls, sections, loading, selectedSections, onToggle, onSelectAll, onNext, onBack }) => {
  const allSelected = sections.length > 0 && selectedSections.length === sections.length;
  const someSelected = selectedSections.length > 0 && !allSelected;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-700">{cls?.name}</span> — কোন সেকশনের পরীক্ষা?
        </p>

        {/* select all button — only show when sections exist */}
        {!loading && sections.length > 0 && (
          <button
            type="button"
            onClick={onSelectAll}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${allSelected
                ? "bg-violet-600 text-white border-violet-600"
                : "bg-white text-violet-600 border-violet-200 hover:bg-violet-50"
              }`}
          >
            {allSelected
              ? <CheckSquare size={13} />
              : <Square size={13} />
            }
            সব সেকশন নির্বাচন করুন
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {Array(4).fill(0).map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : sections.length === 0 ? (
        <div className="flex flex-col items-center py-10 text-center">
          <AlertCircle size={28} className="text-amber-400 mb-3" />
          <p className="text-sm font-semibold text-gray-600">এই ক্লাসে কোনো সেকশন নেই</p>
          <p className="text-xs text-gray-400 mt-1">আগে সেকশন তৈরি করুন।</p>
          <Link href="/dashboard/admin/sections"
            className="mt-4 text-sm font-semibold text-violet-500 hover:text-gray-700 underline underline-offset-2">
            সেকশন যোগ করুন
          </Link>
        </div>
      ) : (
        <>
          {/* selected count badge */}
          {selectedSections.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-violet-50 border border-violet-100 rounded-xl">
              <CheckCircle2 size={14} className="text-violet-500 shrink-0" />
              <p className="text-xs font-semibold text-violet-700">
                {selectedSections.length} টি সেকশন নির্বাচিত:&nbsp;
                {selectedSections.map((s) => `সেকশন ${s.name}`).join(", ")}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {sections.map((sec) => {
              const isSelected = selectedSections.some((s) => s.id === sec.id);
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => onToggle(sec)}
                  className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${isSelected
                      ? "border-violet-500 bg-violet-50 shadow-lg shadow-violet-100"
                      : "border-gray-100 bg-white hover:border-violet-200 hover:bg-violet-50/30"
                    }`}
                >
                  {/* checkmark badge */}
                  {isSelected && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center">
                      <CheckCircle2 size={12} className="text-white" />
                    </span>
                  )}

                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? "bg-violet-500 text-white" : "bg-gray-100 text-gray-500"
                    }`}>
                    <LayoutGrid size={18} />
                  </div>

                  <div className="text-center">
                    <p className={`text-sm font-bold ${isSelected ? "text-violet-700" : "text-gray-700"}`}>
                      সেকশন {sec.name}
                    </p>
                    <p className="text-xs text-gray-400">{SHIFT_BN[sec.shift] ?? sec.shift}</p>
                    <p className="text-xs text-gray-400">ধারণক্ষমতা: {sec.capacity}</p>
                  </div>

                </button>
              );
            })}
          </div>
        </>
      )}

      <div className="flex items-center justify-between pt-2">
        <button onClick={onBack}
          className="text-sm font-semibold text-gray-500 hover:text-gray-700 underline underline-offset-2">
          ← পূর্ববর্তী
        </button>
        <button
          onClick={onNext}
          disabled={selectedSections.length === 0}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-violet-600 rounded-xl hover:bg-violet-700 active:scale-95 disabled:opacity-40 shadow-lg shadow-violet-200"
        >
          পরবর্তী <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
};

// --------- STEP 3: EXAM FORM ---------------
const Step3 = ({ cls, sections, classSubjects, loadingSubjects, onBack, onSubmit: onSubmitProp }) => {
  const { register, control, reset, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      academicYear: new Date().getFullYear(),
      classSubjects: classSubjects.map(cs => ({
        classSubjectId: cs.id,
        totalMarks: cs.totalMarks,
        passingMarks: cs.passingMarks,
        examDate: "",
      })),
    },
  });

  const { fields } = useFieldArray({ control, name: "classSubjects" });

  useEffect(() => {
    if (classSubjects.length > 0) {
      reset({
        academicYear: new Date().getFullYear(),
        classSubjects: classSubjects.map(cs => ({
          classSubjectId: cs.id,
          totalMarks: cs.totalMarks,
          passingMarks: cs.passingMarks,
          examDate: "",
        })),
      });
    }
  }, [classSubjects, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmitProp)} noValidate className="space-y-5">

      {/* Context banner — shows all selected sections */}
      <div className="flex items-start gap-3 px-4 py-3 bg-violet-50 border border-violet-100 rounded-2xl">
        <BookOpen size={15} className="text-violet-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-violet-700">{cls?.name}</p>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {sections.map((sec) => (
              <span key={sec.id}
                className="text-xs font-semibold px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full">
                সেকশন {sec.name} · {SHIFT_BN[sec.shift] ?? sec.shift}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Basic info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <Field label="পরীক্ষার নাম" error={errors.name?.message}>
            <input {...register("name", { required: "আবশ্যক" })}
              placeholder="Class 7 Midterm Exam 2026" className={inputCls(errors.name)} />
          </Field>
        </div>
        <Field label="পরীক্ষার ধরন" error={errors.type?.message}>
          <select {...register("type", { required: "আবশ্যক" })} className={inputCls(errors.type)}>
            <option value="">নির্বাচন করুন</option>
            {EXAM_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </Field>
        <Field label="শিক্ষাবর্ষ" error={errors.academicYear?.message}>
          <input type="number" {...register("academicYear", {
            required: "আবশ্যক",
            min: { value: 2000, message: "সঠিক বছর" },
          })} className={inputCls(errors.academicYear)} />
        </Field>
        <Field label="শুরুর তারিখ" error={errors.startDate?.message}>
          <input type="date" {...register("startDate", { required: "আবশ্যক" })}
            className={inputCls(errors.startDate)} />
        </Field>
        <Field label="শেষের তারিখ" error={errors.endDate?.message}>
          <input type="date" {...register("endDate", { required: "আবশ্যক" })}
            className={inputCls(errors.endDate)} />
        </Field>
      </div>

      {/* Subjects table */}
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          বিষয় অনুযায়ী তারিখ ও নম্বর
        </p>
        {loadingSubjects ? (
          <div className="space-y-2">
            {Array(3).fill(0).map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : classSubjects.length === 0 ? (
          <div className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-700">
            <AlertCircle size={15} className="shrink-0" />
            এই ক্লাসে কোনো বিষয় যুক্ত নেই। আগে Academic Classes থেকে বিষয় যোগ করুন।
          </div>
        ) : (
          <div className="space-y-2">
            {fields.map((field, idx) => {
              const subj = classSubjects[idx];
              const catCls = CATEGORY_COLORS[subj?.subject?.category] ?? "bg-gray-100 text-gray-600";
              return (
                <div key={field.id} className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${catCls}`}>
                      {subj?.subject?.code}
                    </span>
                    <p className="text-sm font-semibold text-gray-700">{subj?.subject?.name}</p>
                    {subj?.isCompulsory && (
                      <span className="text-xs text-red-500 font-semibold ml-auto">আবশ্যিক</span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <p className="text-xs text-gray-400 mt-2">পরীক্ষার তারিখ *</p>
                      <input type="date"
                        {...register(`classSubjects.${idx}.examDate`, { required: true })}
                        className={`w-full px-2.5 py-2 text-xs border rounded-xl bg-white outline-none focus:ring-2 focus:ring-violet-400 ${errors.classSubjects?.[idx]?.examDate ? "border-red-300" : "border-gray-200"
                          }`}
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">মোট নম্বর</p>
                      <input type="number"
                        {...register(`classSubjects.${idx}.totalMarks`, { min: 1 })}
                        className="w-full px-2.5 py-2 text-xs border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-violet-400"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">পাসের নম্বর</p>
                      <input type="number"
                        {...register(`classSubjects.${idx}.passingMarks`, { min: 1 })}
                        className="w-full px-2.5 py-2 text-xs border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-violet-400"
                      />
                    </div>
                  </div>
                  <input type="hidden" {...register(`classSubjects.${idx}.classSubjectId`)} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-1">
        <button type="button" onClick={onBack}
          className="text-sm font-semibold text-gray-500 hover:text-gray-700 underline underline-offset-2">
          ← পূর্ববর্তী
        </button>
        <button type="submit" disabled={isSubmitting || classSubjects.length === 0}
          className="flex items-center gap-2 px-7 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 active:scale-95 disabled:opacity-50 shadow-lg shadow-emerald-200">
          {isSubmitting
            ? <><Loader2 size={15} className="animate-spin" /> তৈরি হচ্ছে...</>
            : <><CheckCircle2 size={15} /> পরীক্ষা তৈরি করুন</>
          }
        </button>
      </div>
    </form>
  );
};

// --------- MODAL ---------
const CreateExamModal = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [classes, setClasses] = useState([]);
  const [classesLoading, setClassesLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [sections, setSections] = useState([]);
  const [sectionsLoading, setSectionsLoading] = useState(false);
  // -- multi-select: array of section objects --
  const [selectedSections, setSelectedSections] = useState([]);
  const [classSubjects, setClassSubjects] = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);

  // reset everything on open/close
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setSelectedClass(null);
      setSelectedSections([]);
      setClassSubjects([]);
      return;
    }
    setClassesLoading(true);
    axiosInstance.get("/academic-classes", { params: { limit: 100 } })
      .then(res => setClasses(res.data?.data ?? []))
      .catch(() => { })
      .finally(() => setClassesLoading(false));
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // reset sections selection when class changes
  useEffect(() => {
    if (!selectedClass) return;
    setSelectedSections([]);
    setSectionsLoading(true);
    setSections([]);
    axiosInstance.get("/sections", { params: { classId: selectedClass.id, limit: 100 } })
      .then(res => setSections(res.data?.data ?? []))
      .catch(() => { })
      .finally(() => setSectionsLoading(false));
  }, [selectedClass]);

  // -- toggle a single section --
  const handleToggleSection = (sec) => {
    setSelectedSections((prev) =>
      prev.some((s) => s.id === sec.id)
        ? prev.filter((s) => s.id !== sec.id)  // deselect
        : [...prev, sec] // select
    );
  };

  // -- select all / deselect all --
  const handleSelectAll = () => {
    if (selectedSections.length === sections.length) {
      setSelectedSections([]); // all already selected -> deselect all
    } else {
      setSelectedSections([...sections]); // select all
    }
  };

  const loadClassSubjects = async () => {
    if (!selectedClass) return;
    setSubjectsLoading(true);
    setClassSubjects([]);
    try {
      const res = await axiosInstance.get(`/academic-classes/${selectedClass.id}/subjects`);
      const raw = res.data?.data?.subjects ?? [];
      setClassSubjects(Array.isArray(raw) ? raw : []);
    } catch {
      setClassSubjects([]);
    } finally {
      setSubjectsLoading(false);
    }
  };

  const goToStep3 = () => {
    setStep(3);
    loadClassSubjects();
  };

  const handleSubmit = async (data) => {
    try {
      const payload = {
        name: data.name.trim(),
        type: data.type,
        academicYear: Number(data.academicYear),
        sectionIds: selectedSections.map((s) => s.id), // ← array
        startDate: data.startDate,
        endDate: data.endDate,
        classSubjects: data.classSubjects.map(cs => ({
          classSubjectId: cs.classSubjectId,
          examDate: cs.examDate,
          ...(cs.totalMarks ? { totalMarks: Number(cs.totalMarks) } : {}),
          ...(cs.passingMarks ? { passingMarks: Number(cs.passingMarks) } : {}),
        })),
      };

      await axiosInstance.post("/results/exams", payload);

      await Swal.fire({
        icon: "success",
        title: "পরীক্ষা তৈরি হয়েছে!",
        html: `<strong>${payload.name}</strong> সফলভাবে তৈরি হয়েছে।`,
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#7c3aed",
        customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl px-6 py-2.5 font-semibold" },
      });

      onClose();
      onSuccess?.();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "ব্যর্থ!",
        text: err.response?.data?.message ?? "পরীক্ষা তৈরি করতে ব্যর্থ হয়েছে।",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#7c3aed",
        customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl px-6 py-2.5 font-semibold" },
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex h-full items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">
      <div className="bg-white w-full max-w-2xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">

        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center">
              <ClipboardList size={17} className="text-violet-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">নতুন পরীক্ষা তৈরি</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-6">
          <StepIndicator step={step} />

          {step === 1 && (
            <Step1
              classes={classes}
              loading={classesLoading}
              selected={selectedClass}
              onSelect={(cls) => { setSelectedClass(cls); setSelectedSections([]); }}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <Step2
              cls={selectedClass}
              sections={sections}
              loading={sectionsLoading}
              selectedSections={selectedSections}
              onToggle={handleToggleSection}
              onSelectAll={handleSelectAll}
              onNext={goToStep3}
              onBack={() => setStep(1)}
            />
          )}

          {step === 3 && (
            <Step3
              key={selectedClass?.id}
              cls={selectedClass}
              sections={selectedSections}// <- array instead of single object
              classSubjects={classSubjects}
              loadingSubjects={subjectsLoading}
              onBack={() => setStep(2)}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateExamModal;