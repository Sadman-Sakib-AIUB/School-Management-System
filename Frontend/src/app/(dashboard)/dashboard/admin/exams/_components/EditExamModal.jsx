"use client";
import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  X, Loader2, ClipboardList, BookMarked, Calendar,
} from "lucide-react";

import Swal from "sweetalert2";
import axiosInstance from "@/src/lib/axiosInstance";
import { CATEGORY_COLORS } from "./CreateExamModal";



const EXAM_TYPE = [
  { value: "MIDTERM", label: "অর্ধ-বার্ষিক" },
  { value: "FINAL", label: "বার্ষিক" },
  { value: "CLASS_TEST", label: "ক্লাস টেস্ট" },
  { value: "WEEKLY_TEST", label: "সাপ্তাহিক টেস্ট" },
]


// Convert ISO to YYYY-MM-DD for date input value 
const toDateInput = (iso) => (iso ? iso.split("T")[0] : "");

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


const EditExamModal = ({ isOpen, onClose, onSuccess, exam }) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({ mode: "onBlur" });

  // console.log(exam);

  const { fields } = useFieldArray({ control, name: "examSubjects" });

  // Pre-fill form when exam changes
  useEffect(() => {
    if (!isOpen || !exam) return;
    reset({
      name: exam.name ?? "",
      type: exam.type ?? "",
      academicYear: exam.academicYear ?? new Date().getFullYear(),
      startDate: toDateInput(exam.startDate),
      endDate: toDateInput(exam.endDate),
      examSubjects: (exam.examSubjects ?? []).map((es) => (
        {
        
        // We store the examSubject id + classSubjectId for the PATCH
        examSubjectId: es.id,
        classSubjectId: es.classSubjectId?? "",
        subjectName: es.subject?.name ?? "",
        subjectCode: es.subject?.code ?? "",
        category: es.subject?.category ?? "",
        totalMarks: es.totalMarks ?? "",
        passingMarks: es.passingMarks ?? "",
        examDate: toDateInput(es.examDate),
      })),
    });
  }, [isOpen, exam, reset]);

  // console.log(exam.examSubjects[0]);



  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen || !exam) return null;

  const handleClose = () => { if (!isSubmitting) { reset(); onClose(); } };

  const onSubmit = async (data) => {
    // console.log(data);
    try {
      const payload = {
        name: data.name.trim(),
        type: data.type,
        academicYear: Number(data.academicYear),
        startDate: data.startDate,
        endDate: data.endDate,
        // Only include examSubjects if the exam has them and they have classSubjectId
        ...(data.examSubjects?.length > 0 && {
          examSubjects: data.examSubjects.map((es) => ({
            classSubjectId: es.classSubjectId,
            totalMarks: Number(es.totalMarks),
            passingMarks: Number(es.passingMarks),
            examDate: es.examDate,
          })),
        }),
      };

      // console.log(payload);

      const res = await axiosInstance.patch(`/results/exams/update/${exam.id}`, payload);
      // console.log(res);

      await Swal.fire({
        icon: "success",
        title: "পরীক্ষা আপডেট হয়েছে!",
        html: `<strong>${payload.name}</strong> সফলভাবে আপডেট হয়েছে।`,
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#7c3aed",
        customClass: {
          popup: "rounded-2xl",
          confirmButton: "rounded-xl px-6 py-2.5 font-semibold",
        },
      });

      reset();
      onClose();
      onSuccess?.();

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "আপডেট ব্যর্থ!",
        text: err.response?.data?.message ?? "পরীক্ষা আপডেট করতে ব্যর্থ হয়েছে।",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#7c3aed",
        customClass: {
          popup: "rounded-2xl",
          confirmButton: "rounded-xl px-6 py-2.5 font-semibold",
        },
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">
      <div className="bg-white w-full max-w-2xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
              <ClipboardList size={17} className="text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">পরীক্ষা আপডেট করুন</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {exam.section?.class?.name} — সেকশন {exam.section?.name} · {exam.academicYear}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 disabled:opacity-40"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-7 py-6 space-y-6">

          {/* -- Basic info -- */}
          <div className="space-y-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              মূল তথ্য
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <Field label="পরীক্ষার নাম" error={errors.name?.message}>
                  <input
                    {...register("name", { required: "আবশ্যক" })}
                    className={inputCls(errors.name)}
                    placeholder="Final Exam - Term 2"
                  />
                </Field>
              </div>

              <Field label="পরীক্ষার ধরন" error={errors.type?.message}>
                <select
                  {...register("type", { required: "আবশ্যক" })}
                  className={inputCls(errors.type)}
                >
                  <option value="">নির্বাচন করুন</option>
                  {EXAM_TYPE.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </Field>

              <Field label="শিক্ষাবর্ষ" error={errors.academicYear?.message}>
                <input
                  type="number"
                  {...register("academicYear", {
                    required: "আবশ্যক",
                    min: { value: 2000, message: "সঠিক বছর দিন" },
                  })}
                  className={inputCls(errors.academicYear)}
                />
              </Field>

              <Field label="শুরুর তারিখ" error={errors.startDate?.message}>
                <input
                  type="date"
                  {...register("startDate", { required: "আবশ্যক" })}
                  className={inputCls(errors.startDate)}
                />
              </Field>

              <Field label="শেষের তারিখ" error={errors.endDate?.message}>
                <input
                  type="date"
                  {...register("endDate", { required: "আবশ্যক" })}
                  className={inputCls(errors.endDate)}
                />
              </Field>
            </div>
          </div>

          {/* -- Subject schedule -- */}
          {fields.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                বিষয় অনুযায়ী তারিখ ও নম্বর
              </p>
              <div className="space-y-2.5">
                {fields.map((field, idx) => {
                  const catCls = CATEGORY_COLORS[field.category] ?? "bg-gray-100 text-gray-600";
                  // console.log("Rendering field", field);
                  return (
                    <div
                      key={field.id}
                      className="bg-gray-50 border border-gray-100 rounded-2xl p-4"
                    >
                      {/* Subject header */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 bg-violet-100 rounded-lg flex items-center justify-center shrink-0">
                          <BookMarked size={13} className="text-violet-600" />
                        </div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${catCls}`}>
                          {field.subjectCode}
                        </span>
                        <p className="text-sm font-semibold text-gray-700">{field.subjectName}</p>

                        {/* Hidden fields */}
                        <input type="hidden" {...register(`examSubjects.${idx}.classSubjectId`)} />
                        <input type="hidden" {...register(`examSubjects.${idx}.subjectName`)} />
                        <input type="hidden" {...register(`examSubjects.${idx}.subjectCode`)} />
                        <input type="hidden" {...register(`examSubjects.${idx}.category`)} />
                      </div>

                      {/* Editable fields */}
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-gray-400 font-medium mb-1">
                            পরীক্ষার তারিখ <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="date"
                            {...register(`examSubjects.${idx}.examDate`, { required: true })}
                            className={`w-full px-3 py-2 text-xs border rounded-xl bg-white outline-none focus:ring-2 focus:ring-violet-400 ${errors.examSubjects?.[idx]?.examDate
                                ? "border-red-300 bg-red-50"
                                : "border-gray-200"
                              }`}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 font-medium mb-1">
                            মোট নম্বর <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="number"
                            min={1}
                            {...register(`examSubjects.${idx}.totalMarks`, {
                              required: true, min: 1,
                            })}
                            className={`w-full px-3 py-2 text-xs border rounded-xl bg-white outline-none focus:ring-2 focus:ring-violet-400 ${errors.examSubjects?.[idx]?.totalMarks
                                ? "border-red-300 bg-red-50"
                                : "border-gray-200"
                              }`}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 font-medium mb-1">
                            পাসের নম্বর <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="number"
                            min={1}
                            {...register(`examSubjects.${idx}.passingMarks`, {
                              required: true, min: 1,
                            })}
                            className={`w-full px-3 py-2 text-xs border rounded-xl bg-white outline-none focus:ring-2 focus:ring-violet-400 ${errors.examSubjects?.[idx]?.passingMarks
                                ? "border-red-300 bg-red-50"
                                : "border-gray-200"
                              }`}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-7 py-4 border-t border-gray-100 bg-gray-50/50 shrink-0">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50"
          >
            বাতিল
          </button>
          <button
            disabled={isSubmitting}
            onClick={handleSubmit(onSubmit)}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-amber-500 rounded-xl hover:bg-amber-600 transition-all active:scale-95 disabled:opacity-60 shadow-lg shadow-amber-200"
          >
            {isSubmitting
              ? <><Loader2 size={15} className="animate-spin" /> আপডেট হচ্ছে...</>
              : "পরীক্ষা আপডেট করুন"
            }
          </button>
        </div>

      </div>
    </div>
  );
}

export default EditExamModal;