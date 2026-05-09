import axiosInstance from '@/src/lib/axiosInstance';
import { Check, Loader2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const AssignTeacherModal = ({ isOpen, onClose, onSuccess, classSubject }) => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    setSelected(classSubject?.teacher?.id ?? "");

    axiosInstance.get("/teachers", { params: { limit: 100 } })
      .then(res => setTeachers(res.data?.data ?? []))
      .catch(() => { })
      .finally(() => setLoading(false));

    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen, classSubject]);

  if (!isOpen || !classSubject) return null;

  const handleSubmit = async () => {
    if (!selected) return;
    // console.log(selected);
    setSubmitting(true);
    try {
       await axiosInstance.post(
        `/academic-classes/subjects/${classSubject.id}/assign-teacher`,
        { teacherId: selected }
      );
      // console.log(res);
      await Swal.fire({
        icon: "success", title: "শিক্ষক নির্ধারিত হয়েছে!",
        html: `বিষয় <strong>${classSubject.subject?.name}</strong>-এ শিক্ষক <strong>${teachers.find(t => t.id === selected)?.fullNameEnglish}</strong>  সফলভাবে যুক্ত হয়েছে।`,
        // text: res.data?.message ?? "শিক্ষক সফলভাবে নির্ধারিত হয়েছে।",
        confirmButtonText: "ঠিক আছে", confirmButtonColor: "#7c3aed",
        customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl px-6 py-2.5 font-semibold" },
      });
      onClose(); 
      onSuccess?.();
    } catch (err) {
      Swal.fire({
        icon: "error", title: "ব্যর্থ!",
        text: err.response?.data?.message ?? "শিক্ষক যুক্ত করতে ব্যর্থ হয়েছে।",
        confirmButtonText: "ঠিক আছে", confirmButtonColor: "#7c3aed",
        customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl px-6 py-2.5 font-semibold" },
      });
    } finally { setSubmitting(false); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-linear-to-r from-violet-50 to-white">
          <div>
            <h3 className="font-bold text-gray-900">শিক্ষক নির্ধারণ করুন</h3>
            <p className="text-xs text-gray-400 mt-0.5">{classSubject.subject?.name} · {classSubject.subject?.code}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400">
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5">
          {loading ? (
            <div className="h-11 bg-gray-100 rounded-xl animate-pulse" />
          ) : (
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                শিক্ষক নির্বাচন করুন
              </label>
              <select value={selected} onChange={e => setSelected(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-violet-400 text-gray-700">
                <option value="">— শিক্ষক বেছে নিন —</option>
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.fullNameEnglish} ({t.teacherCode}){t.department ? ` · ${t.department}` : ""}
                  </option>
                ))}
              </select>
              {classSubject.teacher && (
                <p className="mt-2 text-xs text-gray-400">
                  বর্তমান শিক্ষক: <span className="font-semibold text-gray-600">{classSubject.teacher.fullNameEnglish}</span>
                </p>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">
            বাতিল
          </button>
          <button disabled={!selected || submitting} onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-violet-600 rounded-xl hover:bg-violet-700 disabled:opacity-50 active:scale-95 shadow-lg shadow-violet-200">
            {submitting ? <><Loader2 size={14} className="animate-spin" /> হচ্ছে...</> : <><Check size={14} /> নির্ধারণ করুন</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignTeacherModal;