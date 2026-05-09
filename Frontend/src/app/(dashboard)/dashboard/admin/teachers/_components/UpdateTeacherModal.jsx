"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Loader2, Briefcase, User } from "lucide-react";
import axiosInstance from "../../../../../../lib/axiosInstance";
import Swal from "sweetalert2";

const BLOOD_OPTIONS = ["A_POSITIVE", "A_NEGATIVE", "B_POSITIVE", "B_NEGATIVE", "AB_POSITIVE", "AB_NEGATIVE", "O_POSITIVE", "O_NEGATIVE"];
const DEPT_OPTIONS = ["Science", "Arts", "Commerce", "Mathematics", "Bengali", "English", "Social Science", "ICT", "Physical Education", "Religious Studies"];
const DESIG_OPTIONS = ["Head of Department", "Senior Teacher", "Assistant Teacher", "Junior Teacher", "Lecturer"];

const inputCls = (hasError) =>
  `w-full px-3 py-2.5 text-sm rounded-xl border bg-gray-50 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${hasError ? "border-red-300 bg-red-50" : "border-gray-200"
  }`;

const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
      {label}
    </label>
    {children}
    {error && (
      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
        ⚠ {error}
      </p>
    )}
  </div>
);

const SectionHeader = ({ icon: Icon, title, color }) => (
  <div className={`flex items-center gap-2.5 pb-3 mb-5 border-b-2 ${color}`}>
    <div className={`p-1.5 rounded-lg ${color.replace("border-", "bg-").replace("-200", "-100")}`}>
      <Icon size={16} className={color.replace("border-", "text-").replace("-200", "-600")} />
    </div>
    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">{title}</h3>
  </div>
);

const UpdateTeacherModal = ({ isOpen, onClose, onSuccess, teacher }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onBlur" });

  // console.log(teacher);

  // Pre-fill form with existing teacher data whenever teacher changes
  useEffect(() => {
    if (teacher && isOpen) {
      reset({
        designation: teacher.designation || "",
        department: teacher.department || "",
        subject: teacher.subject || "",
        qualification: teacher.qualification || "",
        phone: teacher.phone || "",
        address: teacher.address || "",
        bloodGroup: teacher.bloodGroup || "",
        salary: teacher.salary || "",
      });
    }
  }, [teacher, isOpen, reset]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen || !teacher) return null;

  const onSubmit = async (data) => {
    try {
      const payload = { ...data, salary: Number(data.salary) };
      const res = await axiosInstance.patch(`/teachers/${teacher.id}`, payload);
      // console.log(res);

      const name = res.data?.data?.fullNameEnglish || teacher.fullNameEnglish;

      await Swal.fire({
        icon: "success",
        title: "সফল!",
        html: `<strong>${name}</strong>-এর তথ্য সফলভাবে আপডেট হয়েছে।`,
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#059669",
        customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl px-6 py-2.5 font-semibold" },
      });

      onClose();
      onSuccess?.();
    } catch (error) {
      const message = error.response?.data?.message || "আপডেট করতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।";
      Swal.fire({
        icon: "error",
        title: "ব্যর্থ!",
        text: message,
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#059669",
        customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl px-6 py-2.5 font-semibold" },
      });
    }
  };

  const handleClose = () => {
    if (!isSubmitting) { reset(); onClose(); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-white shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">শিক্ষক তথ্য আপডেট</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {teacher.fullNameEnglish} &nbsp;·&nbsp;
              <span className="font-mono">{teacher.teacherCode}</span>
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600 disabled:opacity-40"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto px-8 py-6 space-y-8"
          noValidate
        >
          {/* Professional */}
          <div>
            <SectionHeader icon={Briefcase} title="পেশাগত তথ্য" color="border-emerald-200" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="পদবি" error={errors.designation?.message}>
                <select
                  {...register("designation", { required: "পদবি নির্বাচন করুন" })}
                  className={inputCls(errors.designation)}
                >
                  <option value="">নির্বাচন করুন</option>
                  {DESIG_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
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

              <Field label="মাসিক বেতন (টাকা)" error={errors.salary?.message}>
                <input
                  type="number"
                  {...register("salary", {
                    required: "বেতন আবশ্যক",
                    min: { value: 1000, message: "কমপক্ষে ১,০০০ টাকা হতে হবে" },
                  })}
                  placeholder="75000"
                  className={inputCls(errors.salary)}
                />
              </Field>
            </div>
          </div>

          {/* Personal */}
          <div>
            <SectionHeader icon={User} title="ব্যক্তিগত তথ্য" color="border-blue-200" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <Field label="ঠিকানা" error={errors.address?.message}>
                <input
                  {...register("address", { required: "ঠিকানা আবশ্যক" })}
                  placeholder="Gazipur, Bangladesh"
                  className={`${inputCls(errors.address)} sm:col-span-2`}
                />
              </Field>
            </div>
          </div>
        </form>

        {/* Footer */}
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
            disabled={isSubmitting}
            onClick={handleSubmit(onSubmit)}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-emerald-200"
          >
            {isSubmitting
              ? <><Loader2 size={16} className="animate-spin" /> আপডেট হচ্ছে...</>
              : <>তথ্য আপডেট করুন</>
            }
          </button>
        </div>

      </div>
    </div>
  );
}

export default UpdateTeacherModal;