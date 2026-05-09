"use client";
import { useState, useEffect } from "react";
import { X, Loader2, Check, AlertCircle, Edit3 } from "lucide-react";
import Swal from "sweetalert2";
import axiosInstance from "@/src/lib/axiosInstance";

const GRADE_COLORS = {
  "A+": "text-emerald-600 font-bold",
  "A": "text-emerald-500 font-bold",
  "A-": "text-teal-600 font-bold",
  "B": "text-blue-600 font-bold",
  "C": "text-amber-600 font-bold",
  "D": "text-orange-600 font-bold",
  "F": "text-red-600 font-bold",
};

const calcGrade = (marks, total) => {
  if (!marks || !total) return null;
  const pct = (marks / total) * 100;
  if (pct >= 80) return "A+";
  if (pct >= 70) return "A";
  if (pct >= 60) return "A-";
  if (pct >= 50) return "B";
  if (pct >= 40) return "C";
  if (pct >= 33) return "D";
  return "F";
};

export default function BulkResultEntry({ isOpen, onClose, onSuccess, examSubject, students, existingResults }) {
  // marks map: studentId -> { marks: string, remarks: string }
  const [entries, setEntries] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    // Pre-fill with existing results
    const init = {};
    students.forEach(s => {
      const existing = existingResults[s.id];
      init[s.id] = {
        marks: existing ? String(existing.marksObtained) : "",
        remarks: existing?.remarks ?? "",
        resultId: existing?.id ?? null,
      };
    });
    setEntries(init);
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen, students, existingResults]);

  if (!isOpen || !examSubject) return null;

  const setEntry = (studentId, field, value) =>
    setEntries(prev => ({ ...prev, [studentId]: { ...prev[studentId], [field]: value } }));

  const handleSubmit = async () => {
    // Validate — at least one mark entered
    const toSubmit = students.filter(s => entries[s.id]?.marks !== 0);
    if (toSubmit.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "কোনো নম্বর দেওয়া হয়নি!",
        confirmButtonColor: "#7c3aed",
        confirmButtonText: "ঠিক আছে",
        customClass: {
          popup: "rounded-2xl",
          confirmButton: "rounded-xl px-6 py-2.5 font-semibold"
        }
      });
      return;
    }
    // Validate marks range
    const invalid = toSubmit.filter(s => {
      const m = Number(entries[s.id].marks);
      return isNaN(m) || m < 0 || m > examSubject.totalMarks;
    });
    if (invalid.length > 0) {
      Swal.fire({
        icon: "error",
        title: "অসঠিক নম্বর!",
        html: `নম্বর ০ থেকে ${examSubject.totalMarks}-এর মধ্যে হতে হবে।`,
        confirmButtonColor: "#7c3aed",
        confirmButtonText: "ঠিক আছে",
        customClass: {
          popup: "rounded-2xl",
          confirmButton: "rounded-xl px-6 py-2.5 font-semibold"
        }
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Separate new entries from updates
      const newEntries = toSubmit.filter(s => !entries[s.id]?.resultId);
      // console.log(newEntries);

      const updateEntries = toSubmit.filter(s => entries[s.id]?.resultId);
      // console.log(updateEntries);

      // Bulk POST new results
      if (newEntries.length > 0) {

       const res = await axiosInstance.post("/results/bulk", {
          examSubjectId: examSubject.id,
          results: newEntries.map(s => ({
            studentId: s.id,
            marksObtained: Number(entries[s.id].marks ) || 0,
            ...(entries[s.id].remarks?.trim() ? { remarks: entries[s.id].remarks.trim() } : {}),
          })),
        });

        console.log(res);
      }

      // PATCH individual updates
      for (const s of updateEntries) {
        await axiosInstance.patch(`/results/${entries[s.id].resultId}`, {
          marksObtained: Number(entries[s.id].marks),
          ...(entries[s.id].remarks?.trim() ? { remarks: entries[s.id].remarks.trim() } : {}),
        });
      }

      await Swal.fire({
        icon: "success", 
        title: "ফলাফল সংরক্ষিত হয়েছে!",
        html: `${toSubmit.length} জন শিক্ষার্থীর ফলাফল সফলভাবে সংরক্ষিত হয়েছে।`,
        confirmButtonText: "ঠিক আছে", 
        confirmButtonColor: "#7c3aed",
        customClass: { 
          popup: "rounded-2xl", 
          confirmButton: "rounded-xl px-6 py-2.5 font-semibold" },
      });
      onSuccess?.();
    } 
    catch (err) {
      Swal.fire({
        icon: "error", title: "ব্যর্থ!",
        text: err.response?.data?.message ?? "ফলাফল সংরক্ষণ করতে ব্যর্থ হয়েছে।",
        confirmButtonText: "ঠিক আছে", 
        confirmButtonColor: "#7c3aed",
        customClass: { 
          popup: "rounded-2xl", 
          confirmButton: "rounded-xl px-6 py-2.5 font-semibold" },
      });
    } 
    finally { setIsSubmitting(false); }
  };

  const enteredCount = students.filter(s => entries[s.id]?.marks !== "").length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">
      <div className="bg-white w-full max-w-3xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-linear-to-r from-violet-50 to-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center">
              <Edit3 size={17} className="text-violet-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">ফলাফল প্রদান</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {examSubject.subject?.name} · মোট নম্বর: {examSubject.totalMarks} · পাস: {examSubject.passingMarks}
              </p>
            </div>
          </div>
          <button onClick={onClose} disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 disabled:opacity-40">
            <X size={20} />
          </button>
        </div>

        {/* Hint */}
        <div className="px-6 py-3 bg-violet-50/50 border-b border-violet-100 shrink-0">
          <p className="text-xs text-violet-700 font-medium">
            শুধু যাদের নম্বর দিতে চান তাদের নম্বর পূরণ করুন। গ্রেড স্বয়ংক্রিয়ভাবে দেখাবে।
          </p>
        </div>

        {/* Student entries */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-gray-50 border-b border-gray-100 z-10">
              <tr>
                {["রোল", "শিক্ষার্থী", "প্রাপ্ত নম্বর", "গ্রেড (স্বয়ং)", "মন্তব্য (ঐচ্ছিক)"].map((h, i) => (
                  <th key={i} className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {students.map(student => {
                // console.log(student);
                const entry = entries[student.id] ?? { marks: "0", remarks: "" };
                // console.log(entry);
                const marks = Number(entry.marks);
                // console.log(object);
                const grade = entry.marks !== "" && !isNaN(marks) ? calcGrade(marks, examSubject.totalMarks) : null;
                // console.log(grade);
                const gradeCls = grade ? (GRADE_COLORS[grade] ?? "") : "";
                const isUpdate = !!entry.resultId;
                const initials = student.fullNameEnglish?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) ?? "S";

                return (
                  <tr key={student.id} className={`hover:bg-gray-50/40 transition-colors ${entry.marks !== "" ? "bg-violet-50/20" : ""}`}>
                    <td className="px-5 py-3">
                      <span className="font-mono text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                        {student.currentEnrollment?.rollNumber ?? "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-violet-100 rounded-xl flex items-center justify-center text-violet-700 font-bold text-xs shrink-0">
                          {initials}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{student.fullNameEnglish}</p>
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs text-gray-400">{student.studentCode}</p>
                            {isUpdate && <span className="text-xs text-amber-600 font-semibold bg-amber-50 px-1.5 py-0.5 rounded">আপডেট</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min={0} max={examSubject.totalMarks}
                          value={entry.marks}
                          onChange={e => setEntry(student.id, "marks", e.target.value)}
                          placeholder="—"
                          className={`w-20 px-3 py-2 text-sm font-semibold text-center rounded-xl border outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white transition-all ${entry.marks !== ""
                              ? grade === "F"
                                ? "border-red-300 bg-red-50 text-red-700"
                                : "border-emerald-300 bg-emerald-50 text-emerald-700"
                              : "border-gray-200 bg-gray-50 text-gray-600"
                            }`}
                        />
                        <span className="text-xs text-gray-400">/ {examSubject.totalMarks}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      {grade
                        ? <span className={`text-base ${gradeCls}`}>{grade}</span>
                        : <span className="text-xs text-gray-300">—</span>
                      }
                    </td>
                    <td className="px-5 py-3">
                      <input
                        type="text"
                        value={entry.remarks}
                        onChange={e => setEntry(student.id, "remarks", e.target.value)}
                        placeholder="মন্তব্য..."
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50 shrink-0">
          <p className="text-sm text-gray-500">
            {enteredCount} / {students.length} জনের নম্বর দেওয়া হয়েছে
          </p>
          <div className="flex items-center gap-3">
            <button onClick={onClose} disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50">
              বাতিল
            </button>
            <button onClick={handleSubmit} disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-violet-600 rounded-xl hover:bg-violet-700 active:scale-95 disabled:opacity-50 shadow-lg shadow-violet-200">
              {isSubmitting
                ? <><Loader2 size={15} className="animate-spin" /> সংরক্ষণ হচ্ছে...</>
                : <><Check size={15} /> ফলাফল সংরক্ষণ করুন ({enteredCount} জন)</>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}