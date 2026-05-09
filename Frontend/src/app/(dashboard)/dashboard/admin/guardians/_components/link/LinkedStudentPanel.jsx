"use client";
import { useState, useEffect } from "react";
import {
  X, Users, GraduationCap, Loader2, AlertCircle,
  Trash2, Star, StarOff, Link2,
} from "lucide-react";

import Swal from "sweetalert2";
import axiosInstance from "@/src/lib/axiosInstance";

const SHIFT_LABEL = { MORNING: "সকাল", DAY: "দিন", EVENING: "বিকাল" };
const GENDER_LABEL = { MALE: "পুরুষ", FEMALE: "মহিলা", OTHER: "অন্যান্য" };

const RELATIONSHIP_BN = {
  FATHER: "পিতা", 
  MOTHER: "মাতা", 
  GRANDFATHER: "দাদা/নানা",
  GRANDMOTHER: "দাদি/নানি", 
  UNCLE: "চাচা/মামা", 
  AUNT: "চাচি/মামি",
  SIBLING: "ভাই/বোন", 
  GUARDIAN: "অভিভাবক", 
  OTHER: "অন্যান্য",
};

const LinkedStudentsPanel = ({ isOpen, onClose, guardian, onChanged }) => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionId, setActionId] = useState(null); // which linkId is being actioned

  const fetch = async () => {
    if (!guardian?.id) return;
    setIsLoading(true); 
    setError(null);
    try {
      const res = await axiosInstance.get(`/guardians/${guardian.id}/students`);
      setStudents(res.data?.data ?? []);
    } catch {
      setError("শিক্ষার্থীদের তথ্য লোড করতে ব্যর্থ হয়েছে।");
    } finally { 
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    if (isOpen && guardian?.id) fetch();

    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { 
      document.body.style.overflow = ""; 
    };
  }, [isOpen, guardian?.id]);

  // Toggle isPrimary
  const togglePrimary = async (student) => {
    const linkId = student.linkId;
    const newPrimary = !student.isPrimary;
    setActionId(linkId);
    try {
      await axiosInstance.patch(
        `/guardians/${guardian.id}/students/${student.id}`,
        { isPrimary: newPrimary }
      );
      setStudents((prev) => prev.map((s) =>
        s.linkId === linkId ? { ...s, isPrimary: newPrimary } : s
      ));
      onChanged?.();
    } catch (err) {
      Swal.fire({
        icon: "error", title: "ব্যর্থ!",
        text: err.response?.data?.message ?? "আপডেট করতে ব্যর্থ হয়েছে।",
        confirmButtonText: "ঠিক আছে", confirmButtonColor: "#7c3aed",
        customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl px-5 py-2.5 font-semibold" },
      });
    } finally { 
      setActionId(null); 
    }
  };

  // Unlink student
  const unlink = async (student) => {
    const { isConfirmed } = await Swal.fire({
      title: "সংযোগ বিচ্ছিন্ন করবেন?",
      html: `<strong>${student.fullNameEnglish}</strong>-কে <strong>${guardian.fullNameEnglish}</strong> থেকে সংযোগ বিচ্ছিন্ন করা হবে।`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, বিছিন্ন করুন",
      cancelButtonText: "বাতিল",
      confirmButtonColor: "#ef4444", cancelButtonColor: "#6b7280",
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-xl px-5 py-2.5 font-semibold",
        cancelButton: "rounded-xl px-5 py-2.5 font-semibold",
      },
    });
    if (!isConfirmed) return;

    setActionId(student.linkId);
    try {
      await axiosInstance.delete(`/guardians/${guardian.id}/students/${student.id}`);
      setStudents((prev) => prev.filter((s) => s.linkId !== student.linkId));
      onChanged?.();
      Swal.fire({
        icon: "success", title: "বিচ্ছিন্ন হয়েছে!",
        html: `<strong>${student.fullNameEnglish}</strong>-কে সফলভাবে বিচ্ছিন্ন করা হয়েছে।`,
        timer: 2000, timerProgressBar: true,
        showConfirmButton: false,
        customClass: { popup: "rounded-2xl" },
      });
    } catch (err) {
      const msg = err.response?.data?.message ?? "বিছিন্ন করতে ব্যর্থ হয়েছে।";
      Swal.fire({
        icon: "error", title: "ব্যর্থ!",
        text: msg,
        confirmButtonText: "ঠিক আছে", confirmButtonColor: "#7c3aed",
        customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl px-5 py-2.5 font-semibold" },
      });
    } finally { setActionId(null); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">
      <div className="bg-white w-full max-w-lg max-h-[88vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-linear-to-r from-blue-50 to-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users size={17} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">সংযুক্ত শিক্ষার্থীরা</h2>
              <p className="text-xs text-gray-400 mt-0.5">{guardian?.fullNameEnglish} · {guardian?.guardianCode}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 size={28} className="text-violet-400 animate-spin mb-3" />
              <p className="text-sm text-gray-400">লোড হচ্ছে...</p>
            </div>
          )}

          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle size={24} className="text-red-400 mb-3" />
              <p className="text-sm text-gray-600 mb-3">{error}</p>
              <button onClick={fetch} className="text-sm text-violet-600 hover:underline font-semibold">
                আবার চেষ্টা করুন
              </button>
            </div>
          )}

          {!isLoading && !error && students.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-3">
                <Link2 size={24} className="text-blue-400" />
              </div>
              <p className="font-semibold text-gray-600 mb-1">কোনো শিক্ষার্থী যুক্ত নেই</p>
              <p className="text-xs text-gray-400">অভিভাবক তালিকা থেকে "যুক্ত করুন" বাটনে ক্লিক করুন।</p>
            </div>
          )}

          {!isLoading && students.map((student) => {
            const enrollment = student.currentEnrollment;
            const profilePhotoUrl = student.profilePhotoUrl;
            // console.log(student);
            const initials = student.fullNameEnglish?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) ?? "S";
            const busy = actionId === student.linkId;

            return (
              <div key={student.linkId}
                className={`bg-white border rounded-2xl overflow-hidden transition-all ${student.isPrimary ? "border-violet-200" : "border-gray-100"
                  }`}
              >
                {/* Student header */}
                <div className={`flex items-center gap-3 px-4 py-3.5 ${student.isPrimary ? "bg-violet-50/50" : ""}`}>
                  <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center text-violet-700 font-bold text-sm shrink-0">
                    {/* {initials} */}
                    {profilePhotoUrl
                      ? <img src={profilePhotoUrl} alt={student.fullNameEnglish} className="w-full h-full object-cover rounded-lg" />
                      : initials
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-800">{student.fullNameEnglish}</p>
                      {student.isPrimary && (
                        <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full">
                          <Star size={10} /> প্রাথমিক
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {student.studentCode} · {GENDER_LABEL[student.gender]}
                      {" · "}{RELATIONSHIP_BN[student.relationship] ?? student.relationship}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => togglePrimary(student)}
                      disabled={busy}
                      title={student.isPrimary ? "প্রাথমিক সরান" : "প্রাথমিক করুন"}
                      className={`p-2 rounded-xl transition-colors disabled:opacity-40 ${student.isPrimary
                          ? "text-violet-600 bg-violet-100 hover:bg-violet-200"
                          : "text-gray-400 hover:bg-gray-100 hover:text-violet-500"
                        }`}
                    >
                      {busy && actionId === student.linkId
                        ? <Loader2 size={14} className="animate-spin" />
                        : student.isPrimary ? <Star size={14} /> : <StarOff size={14} />
                      }
                    </button>
                    <button
                      onClick={() => unlink(student)}
                      disabled={busy}
                      title="সংযোগ বিচ্ছিন্ন করুন"
                      className="p-2 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-40"
                    >
                      {busy ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>

                {/* Enrollment info */}
                {enrollment && (
                  <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 border-t border-gray-100">
                    <GraduationCap size={13} className="text-gray-400 shrink-0" />
                    <p className="text-xs text-gray-600">
                      <span className="font-semibold">{enrollment.section?.class?.name}</span>
                      {" — সেকশন "}<span className="font-semibold">{enrollment.section?.name}</span>
                      {enrollment.section?.shift && ` · ${SHIFT_LABEL[enrollment.section.shift]}`}
                      {enrollment.rollNumber && ` · রোল: ${enrollment.rollNumber}`}
                      {enrollment.academicYear && ` · ${enrollment.academicYear}`}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-gray-100 shrink-0">
          <button onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
            বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
}

export default LinkedStudentsPanel;