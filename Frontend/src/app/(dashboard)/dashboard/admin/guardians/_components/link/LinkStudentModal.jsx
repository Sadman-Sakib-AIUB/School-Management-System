"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  X, Search, Loader2, Link2,
  GraduationCap,
} from "lucide-react";

import Swal from "sweetalert2";
import axiosInstance from "@/src/lib/axiosInstance";

const RELATIONSHIP_OPTIONS = [
  { value: "FATHER", label: "পিতা" },
  { value: "MOTHER", label: "মাতা" },
  { value: "GRANDFATHER", label: "দাদা/নানা" },
  { value: "GRANDMOTHER", label: "দাদি/নানি" },
  { value: "UNCLE", label: "চাচা/মামা" },
  { value: "AUNT", label: "চাচি/মামি" },
  { value: "SIBLING", label: "ভাই/বোন" },
  { value: "GUARDIAN", label: "অভিভাবক" },
  { value: "OTHER", label: "অন্যান্য" },
];

const SHIFT_LABEL = { MORNING: "সকাল", DAY: "দিন", EVENING: "বিকাল" };

const LinkStudentModal = ({ isOpen, onClose, onSuccess, guardian }) => {
  const [searchInput, setSearchInput] = useState("");
  const [students, setStudents] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { relationship: "FATHER", isPrimary: false },
  });

  useEffect(() => {
    if (!isOpen) {
      setSearchInput("");
      setStudents([]);
      setSelectedStudent(null);
      reset();
    }
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen, reset]);

  // Debounced student search
  useEffect(() => {
    if (!searchInput.trim()) { setStudents([]); return; }
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await axiosInstance.get("/students", {
          params: { search: searchInput.trim(), limit: 10 },
        });
        // console.log(res);
        setStudents(res.data?.data ?? []);
      }
      catch (error) {
        console.error("Error fetching students:", error);
        setStudents([]);
      }
      finally {
        setSearching(false);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const onSubmit = async (data) => {
    if (!selectedStudent) return;
    setIsSubmitting(true);
    try {
      await axiosInstance.post(`/guardians/${guardian.id}/link-student`, {
        studentId: selectedStudent.id,
        relationship: data.relationship,
        isPrimary: data.isPrimary === true || data.isPrimary === "true",
      });

      await Swal.fire({
        icon: "success", title: "যুক্ত করা হয়েছে!",
        html: `<strong>${selectedStudent.fullNameEnglish}</strong>-কে <strong>${guardian.fullNameEnglish}</strong>-এর সাথে সফলভাবে যুক্ত করা হয়েছে।`,
        confirmButtonText: "ঠিক আছে", confirmButtonColor: "#7c3aed",
        customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl px-6 py-2.5 font-semibold" },
      });
      onClose();
      onSuccess?.();

    } catch (err) {
      Swal.fire({
        icon: "error", title: "ব্যর্থ!",
        text: err.response?.data?.message ?? "যুক্ত করতে ব্যর্থ হয়েছে।",
        confirmButtonText: "ঠিক আছে", confirmButtonColor: "#7c3aed",
        customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl px-6 py-2.5 font-semibold" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !guardian) return null;

  const enrollment = selectedStudent?.currentEnrollment;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">
      <div className="bg-white w-full max-w-lg max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-linear-to-r from-violet-50 to-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center">
              <Link2 size={17} className="text-violet-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">শিক্ষার্থী সংযুক্ত করুন</h2>
              <p className="text-xs text-gray-400 mt-0.5">{guardian.fullNameEnglish} · {guardian.guardianCode}</p>
            </div>
          </div>
          <button onClick={onClose} disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 disabled:opacity-40">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">

          {/* Student search */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              শিক্ষার্থী খুঁজুন
            </label>
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchInput}
                onChange={(e) => { setSearchInput(e.target.value); setSelectedStudent(null); }}
                placeholder="নাম, কোড বা ফোন..."
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white"
              />
              {searching && <Loader2 size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-violet-400 animate-spin" />}
            </div>

            {/* Search results */}
            {students.length > 0 && !selectedStudent && (
              <div className="mt-2 border border-gray-200 rounded-xl overflow-hidden shadow-lg">
                {students.map((s) => {
                  const enroll = s.currentEnrollment;
                  return (
                    <button key={s.id} type="button"
                      onClick={() => { setSelectedStudent(s); setStudents([]); setSearchInput(s.fullNameEnglish); }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-violet-50 transition-colors border-b border-gray-50 last:border-0 text-left"
                    >
                      <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center text-violet-700 font-bold text-xs shrink-0">
                        {/* {s.fullNameEnglish?.charAt(0)} */}
                        {s.profilePhotoUrl
                          ? <img src={s.profilePhotoUrl} alt={s.fullNameEnglish} className="w-full h-full object-cover rounded-lg" />
                          : s.fullNameEnglish?.charAt(0)
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800">{s.fullNameEnglish}</p>
                        <p className="text-xs text-gray-400">
                          {s.studentCode}
                          {enroll && ` · ${enroll.section?.class?.name} — সেকশন ${enroll.section?.name}`}
                        </p>
                      </div>
                      {enroll && (
                        <GraduationCap size={14} className="text-violet-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {searchInput.trim() && !searching && students.length === 0 && !selectedStudent && (
              <p className="mt-2 text-xs text-gray-400 text-center py-2">কোনো শিক্ষার্থী পাওয়া যায়নি।</p>
            )}
          </div>

          {/* Selected student card */}
          {selectedStudent && (
            <div className="bg-violet-50 border border-violet-100 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center text-violet-700 font-bold shrink-0">
                  {/* {selectedStudent.fullNameEnglish?.charAt(0)} */}
                  {selectedStudent.profilePhotoUrl
                    ? <img src={selectedStudent.profilePhotoUrl} alt={selectedStudent.fullNameEnglish} className="w-full h-full object-cover rounded-lg" />
                    : selectedStudent.fullNameEnglish?.charAt(0)
                  }
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{selectedStudent.fullNameEnglish}</p>
                  <p className="text-xs text-gray-500">{selectedStudent.fullNameBangla} · {selectedStudent.studentCode}</p>
                </div>
                <button onClick={() => { setSelectedStudent(null); setSearchInput(""); }}
                  className="p-1.5 hover:bg-violet-200 rounded-lg text-violet-500">
                  <X size={14} />
                </button>
              </div>
              {enrollment && (
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1 bg-white rounded-lg text-violet-700 font-semibold border border-violet-100">
                    {enrollment.section?.class?.name} — সেকশন {enrollment.section?.name}
                  </span>
                  <span className="px-2.5 py-1 bg-white rounded-lg text-gray-600 font-medium border border-gray-100">
                    রোল: {enrollment.rollNumber}
                  </span>
                  {enrollment.section?.shift && (
                    <span className="px-2.5 py-1 bg-white rounded-lg text-gray-600 font-medium border border-gray-100">
                      {SHIFT_LABEL[enrollment.section.shift]}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Relationship form */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                সম্পর্ক <span className="text-red-400">*</span>
              </label>
              <select {...register("relationship", { required: "সম্পর্ক নির্বাচন করুন" })}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white text-gray-700">
                {RELATIONSHIP_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
              {errors.relationship && <p className="mt-1 text-xs text-red-500">⚠ {errors.relationship.message}</p>}
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <input type="checkbox" id="isPrimary" {...register("isPrimary")}
                className="w-4 h-4 accent-violet-600 rounded cursor-pointer" />
              <div>
                <label htmlFor="isPrimary" className="text-sm font-semibold text-gray-700 cursor-pointer">
                  প্রাথমিক অভিভাবক হিসেবে চিহ্নিত করুন
                </label>
                <p className="text-xs text-gray-400 mt-0.5">
                  প্রাথমিক অভিভাবক মূল যোগাযোগের ব্যক্তি হিসেবে গণ্য হবেন।
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 shrink-0">
          <button type="button" onClick={onClose} disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50">
            বাতিল
          </button>
          <button
            disabled={!selectedStudent || isSubmitting}
            onClick={handleSubmit(onSubmit)}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-violet-600 rounded-xl hover:bg-violet-700 active:scale-95 disabled:opacity-50 shadow-lg shadow-violet-200 transition-all"
          >
            {isSubmitting
              ? <><Loader2 size={15} className="animate-spin" /> যুক্ত হচ্ছে...</>
              : <><Link2 size={15} /> যুক্ত করুন</>
            }
          </button>
        </div>

      </div>
    </div>
  );
}

export default LinkStudentModal;