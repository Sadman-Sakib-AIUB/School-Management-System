import { useForm } from "react-hook-form";
import { CATEGORIES } from "./SubjectCard";
import { inputCls } from "./classSubjectsModal";
import Swal from "sweetalert2";

const { default: axiosInstance } = require("@/src/lib/axiosInstance");
const { Loader2, Check, ChevronRight, BookMarked } = require("lucide-react");
const { useState } = require("react");


const LEVELS = [
  { value: "PRIMARY", label: "প্রাথমিক" },
  { value: "SECONDARY", label: "মাধ্যমিক" },
  { value: "HIGHER", label: "উচ্চ মাধ্যমিক" },
];


const Field = ({ label, required = true, error, children }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
    {error && <p className="mt-1 text-xs text-red-500">⚠ {error}</p>}
  </div>
);

const AddSubjectForm = ({ cls, onSuccess, onCancel }) => {
  const [step, setStep] = useState(1); // 1=create, 2=assign marks
  const [createdSubject, setCreatedSubject] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1 form
  const form1 = useForm({ mode: "onBlur", defaultValues: { defaultTotalMarks: 100, defaultPassingMarks: 33 } });
  // Step 2 form
  const form2 = useForm({ mode: "onBlur", defaultValues: { totalMarks: 100, passingMarks: 33, isCompulsory: true } });

  const handleCreateSubject = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await axiosInstance.post("/results/subjects", {
        name: data.name.trim(),
        code: data.code.trim().toUpperCase(),
        category: data.category,
        level: data.level,
        defaultTotalMarks: Number(data.defaultTotalMarks),
        defaultPassingMarks: Number(data.defaultPassingMarks),
        description: data.description?.trim() || undefined,
      });
      setCreatedSubject(res.data?.data);
      form2.setValue("totalMarks", Number(data.defaultTotalMarks));
      form2.setValue("passingMarks", Number(data.defaultPassingMarks));
      setStep(2);
    } catch (err) {
      Swal.fire({
        icon: "error", title: "বিষয় তৈরি ব্যর্থ!",
        text: err.response?.data?.message ?? "বিষয় তৈরি করতে ব্যর্থ হয়েছে।",
        confirmButtonText: "ঠিক আছে", confirmButtonColor: "#7c3aed",
        customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl px-6 py-2.5 font-semibold" },
      });
    } finally { setIsSubmitting(false); }
  };

  const handleAssignToClass = async (data) => {
    setIsSubmitting(true);
    try {
      await axiosInstance.post(`/academic-classes/${cls.id}/subjects`, {
        subjects: [{
          subjectId: createdSubject.id,
          totalMarks: Number(data.totalMarks),
          passingMarks: Number(data.passingMarks),
          isCompulsory: data.isCompulsory === true || data.isCompulsory === "true",
        }],
      });
      await Swal.fire({
        icon: "success", title: "বিষয় যুক্ত হয়েছে!",
        html: `<strong>${createdSubject.name}</strong> সফলভাবে ${cls.name}-এ যুক্ত হয়েছে।`,
        confirmButtonText: "ঠিক আছে", confirmButtonColor: "#7c3aed",
        customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl px-6 py-2.5 font-semibold" },
      });
      onSuccess?.();
    } catch (err) {
      Swal.fire({
        icon: "error", title: "যুক্ত করা ব্যর্থ!",
        text: err.response?.data?.message ?? "বিষয় ক্লাসে যুক্ত করতে ব্যর্থ হয়েছে।",
        confirmButtonText: "ঠিক আছে", confirmButtonColor: "#7c3aed",
        customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl px-6 py-2.5 font-semibold" },
      });
    } finally { 
      setIsSubmitting(false); 
    }
  };

  if (step === 1) return (
    <form onSubmit={form1.handleSubmit(handleCreateSubject)} noValidate className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-gray-700">নতুন বিষয় তৈরি করুন</p>
        <button type="button" onClick={onCancel}
          className="text-xs text-gray-400 hover:text-gray-600 underline">বাতিল</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="বিষয়ের নাম" error={form1.formState.errors.name?.message}>
          <input {...form1.register("name", { required: "আবশ্যক" })}
            placeholder="উচ্চতর গণিত" className={inputCls(form1.formState.errors.name)} />
        </Field>
        <Field label="কোড" error={form1.formState.errors.code?.message}>
          <input {...form1.register("code", {
            required: "আবশ্যক",
            pattern: { value: /^[A-Za-z0-9_-]{2,10}$/, message: "২-১০ অক্ষর, শুধু EN/নম্বর" },
          })} placeholder="HMATH" className={inputCls(form1.formState.errors.code)} />
        </Field>
        <Field label="ক্যাটাগরি" error={form1.formState.errors.category?.message}>
          <select {...form1.register("category", { required: "আবশ্যক" })}
            className={inputCls(form1.formState.errors.category)}>
            <option value="">নির্বাচন করুন</option>
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </Field>
        <Field label="স্তর" error={form1.formState.errors.level?.message}>
          <select {...form1.register("level", { required: "আবশ্যক" })}
            className={inputCls(form1.formState.errors.level)}>
            <option value="">নির্বাচন করুন</option>
            {LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
        </Field>
        <Field label="মোট নম্বর" error={form1.formState.errors.defaultTotalMarks?.message}>
          <input type="number" {...form1.register("defaultTotalMarks", {
            required: "আবশ্যক", min: { value: 1, message: "কমপক্ষে ১" },
          })} className={inputCls(form1.formState.errors.defaultTotalMarks)} />
        </Field>
        <Field label="পাসের নম্বর" error={form1.formState.errors.defaultPassingMarks?.message}>
          <input type="number" {...form1.register("defaultPassingMarks", {
            required: "আবশ্যক", min: { value: 1, message: "কমপক্ষে ১" },
          })} className={inputCls(form1.formState.errors.defaultPassingMarks)} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="বিবরণ" required={false} error={form1.formState.errors.description?.message}>
            <input {...form1.register("description")} placeholder="সংক্ষিপ্ত বিবরণ (ঐচ্ছিক)"
              className={inputCls(form1.formState.errors.description)} />
          </Field>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-violet-600 rounded-xl hover:bg-violet-700 active:scale-95 disabled:opacity-60 shadow-lg shadow-violet-200">
          {isSubmitting ? <><Loader2 size={14} className="animate-spin" /> তৈরি হচ্ছে...</> : <>পরবর্তী <ChevronRight size={14} /></>}
        </button>
      </div>
    </form>
  );

  return (
    <form onSubmit={form2.handleSubmit(handleAssignToClass)} noValidate className="space-y-4">
      {/* Created subject preview */}
      <div className="flex items-center gap-3 p-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl">
        <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
          <BookMarked size={15} className="text-emerald-600" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-800">{createdSubject?.name}</p>
          <p className="text-xs text-gray-500 font-mono">{createdSubject?.code}</p>
        </div>
        <div className="ml-auto flex items-center gap-1 text-xs font-semibold text-emerald-600">
          <Check size={13} /> তৈরি হয়েছে
        </div>
      </div>

      <p className="text-sm font-bold text-gray-700">{cls.name}-এ নম্বর নির্ধারণ করুন</p>

      <div className="grid grid-cols-2 gap-3">
        <Field label="মোট নম্বর" error={form2.formState.errors.totalMarks?.message}>
          <input type="number" {...form2.register("totalMarks", {
            required: "আবশ্যক", min: { value: 1, message: "কমপক্ষে ১" },
          })} className={inputCls(form2.formState.errors.totalMarks)} />
        </Field>
        <Field label="পাসের নম্বর" error={form2.formState.errors.passingMarks?.message}>
          <input type="number" {...form2.register("passingMarks", {
            required: "আবশ্যক", min: { value: 1, message: "কমপক্ষে ১" },
          })} className={inputCls(form2.formState.errors.passingMarks)} />
        </Field>
      </div>

      <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-200">
        <input type="checkbox" id="isCompulsory" {...form2.register("isCompulsory")}
          className="w-4 h-4 accent-violet-600 rounded cursor-pointer" defaultChecked />
        <label htmlFor="isCompulsory" className="text-sm font-semibold text-gray-700 cursor-pointer">
          আবশ্যিক বিষয় হিসেবে চিহ্নিত করুন
        </label>
      </div>

      <div className="flex items-center justify-between">
        {/* <button type="button" onClick={() => setStep(1)} disabled={isSubmitting}
          className="text-sm font-semibold text-gray-500 hover:text-gray-700 underline underline-offset-2 disabled:opacity-40">
          ← পূর্ববর্তী
        </button> */}
        <button type="submit" disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 active:scale-95 disabled:opacity-60 shadow-lg shadow-emerald-200">
          {isSubmitting
            ? <><Loader2 size={14} className="animate-spin" /> যুক্ত হচ্ছে...</>
            : <><Check size={14} /> ক্লাসে যুক্ত করুন</>
          }
        </button>
      </div>
    </form>
  );
}

export default AddSubjectForm;