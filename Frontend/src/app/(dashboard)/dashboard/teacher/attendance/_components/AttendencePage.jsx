"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2, XCircle, Clock, FileText,
  Users, CalendarDays, ChevronRight, Loader2,
  AlertCircle, RefreshCw, BarChart2, Check,
  BookOpen,
} from "lucide-react";

import Swal from "sweetalert2";
import { useTeacherSections } from "@/src/hooks/useTeachersSections";
import axiosInstance from "@/src/lib/axiosInstance";
import SkeletonStudentRow from "./SkeletonStudentRow";

// --------------- CONSTANTS ---------------
const STATUS_OPTIONS = [
  { value: "PRESENT", 
    label: "উপস্থিত", 
    icon: CheckCircle2, 
    color: "text-emerald-600", 
    bg: "bg-emerald-50", 
    border: "border-emerald-200", 
    activeBg: "bg-emerald-500", 
    activeText: "text-white" 
  },
  { 
    value: "ABSENT", 
    label: "অনুপস্থিত", 
    icon: XCircle, 
    color: "text-red-500", 
    bg: "bg-red-50", 
    border: "border-red-200", 
    activeBg: "bg-red-500", 
    activeText: "text-white" 
  },
  { value: "LATE", 
    label: "লেট", 
    icon: Clock, 
    color: "text-amber-600", 
    bg: "bg-amber-50", 
    border: "border-amber-200", 
    activeBg: "bg-amber-500", 
    activeText: "text-white" 
  },
  { 
    value: "LEAVE", 
    label: "ছুটি", 
    icon: FileText, 
    color: "text-blue-600", 
    bg: "bg-blue-50", 
    border: "border-blue-200", 
    activeBg: "bg-blue-500", 
    activeText: "text-white" 
  },
];

const todayISO = () => new Date().toISOString().split("T")[0];
const formatDateBN = (iso) =>
  new Date(iso).toLocaleDateString("bn-BD", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

const SummaryBadge = ({ label, count, color, bg }) => (
  <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${bg}`}>
    <span className={`text-lg font-bold ${color}`}>{count}</span>
    <span className={`text-xs font-semibold ${color} opacity-80`}>{label}</span>
  </div>
);


const AttendancePage = () => {
  const router = useRouter();

  // Teacher sections via shared hook
  const { sections, isLoading: sectionsLoading, error: sectionsError, isFallback } = useTeacherSections();

  // Selection state
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [selectedDate, setSelectedDate] = useState(todayISO());

  // Students + existing attendance
  const [students, setStudents] = useState([]);       // enrolled students
  const [existingMap, setExistingMap] = useState({});       // studentId -> attendance record
  const [attendance, setAttendance] = useState({});       // studentId -> { status, remarks }
  const [remarks, setRemarks] = useState({});       // studentId -> remark text

  const [studentsLoading, setStudentsLoading] = useState(false);
  const [alreadyMarked, setAlreadyMarked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);



  // ------------- Auto-select first section once hook loads --------------
  useEffect(() => {
    if (sections.length > 0 && !selectedSectionId) {
      setSelectedSectionId(sections[0].id);
    }
  }, [sections, selectedSectionId]);

  // ---- Load students + existing attendance when section/date changes ------
  const loadStudentsAndAttendance = useCallback(async () => {
    if (!selectedSectionId) return;
    setStudentsLoading(true);
    setError(null);
    setAlreadyMarked(false);

    try {
      // Fetch enrolled students
      const studRes = await axiosInstance.get("/students", {
        params: { sectionId: selectedSectionId, limit: 100 },
      });
      // console.log(studRes.data);

      let studentList = studRes.data?.data ?? [];
      // console.log(studentList);

      // Filter to students enrolled in this section
      studentList = studentList.filter(
        (s) => s.currentEnrollment?.section?.id === selectedSectionId
          || s.currentEnrollment?.sectionId === selectedSectionId
      );

      setStudents(studentList);

      // Fetch existing attendance for this section + date
      const attRes = await axiosInstance.get("/attendance", {
        params: { sectionId: selectedSectionId, date: selectedDate },
      });
      // console.log(attRes.data.data);

      const existingRecords = attRes.data?.data?.attendances ?? [];
      const map = {};
      const initAtt = {};
      const initRemarks = {};

      existingRecords.forEach((rec) => {
        map[rec.studentId] = rec;
        initAtt[rec.studentId] = rec.status;
        initRemarks[rec.studentId] = rec.remarks ?? "";
      });

      setExistingMap(map);

      // console.log(existingRecords);

      if (existingRecords.length > 0) {
        setAlreadyMarked(true);
        setAttendance(initAtt);
        setRemarks(initRemarks);
      } else {
        setAlreadyMarked(false);
        // Default all to PRESENT
        const defaultAtt = {};
        studentList.forEach((s) => { defaultAtt[s.id] = "PRESENT"; });
        setAttendance(defaultAtt);
        setRemarks({});
      }
    } catch (err) {
      // 404 from attendance GET = not yet marked
      if (err.response?.status === 404) {
        setAlreadyMarked(false);
        const defaultAtt = {};
        students.forEach((s) => { defaultAtt[s.id] = "PRESENT"; });
        setAttendance(defaultAtt);
      } else {
        setError("তথ্য লোড করতে ব্যর্থ হয়েছে।");
      }
    } finally {
      setStudentsLoading(false);
    }
  }, [selectedSectionId, selectedDate]);

  useEffect(() => { loadStudentsAndAttendance(); }, [loadStudentsAndAttendance]);

  // ---------- Helpers -------------
  const setStudentStatus = (studentId, status) =>
    setAttendance((prev) => ({ ...prev, [studentId]: status }));

  const setStudentRemark = (studentId, remark) =>
    setRemarks((prev) => ({ ...prev, [studentId]: remark }));

  const markAll = (status) => {
    const all = {};
    students.forEach((s) => { all[s.id] = status; });
    setAttendance(all);
  };

  // ------- Summary counts ----------
  const summary = STATUS_OPTIONS.reduce((acc, opt) => {
    acc[opt.value] = Object.values(attendance).filter((v) => v === opt.value).length;
    return acc;
  }, {});
  // console.table(summary);

  const handleSubmit = async () => {
    if (students.length === 0) return;

    const unmarked = students.filter((s) => !attendance[s.id]);
    if (unmarked.length > 0) {
      Swal.fire({
        icon: "warning", title: "অসম্পূর্ণ!",
        html: `${unmarked.length} জন শিক্ষার্থীর উপস্থিতি চিহ্নিত করা হয়নি।`,
        confirmButtonText: "ঠিক আছে", confirmButtonColor: "#7c3aed",
        customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl px-6 py-2.5 font-semibold" },
      });
      return;
    }

    const { isConfirmed } = await Swal.fire({
      title: "উপস্থিতি সংরক্ষণ করবেন?",
      html: `<strong>${selectedDate}</strong> তারিখের ${students.length} জন শিক্ষার্থীর উপস্থিতি জমা দেওয়া হবে।`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, জমা দিন",
      cancelButtonText: "বাতিল",
      confirmButtonColor: "#7c3aed", cancelButtonColor: "#6b7280",
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-xl px-5 py-2.5 font-semibold",
        cancelButton: "rounded-xl px-5 py-2.5 font-semibold",
      },
    });
    if (!isConfirmed) return;

    setIsSubmitting(true);
    try {
      const attendances = students.map((s) => ({
        studentId: s.id,
        status: attendance[s.id] ?? "PRESENT",
        ...(remarks[s.id]?.trim() ? { remarks: remarks[s.id].trim() } : {}),
      }));

      await axiosInstance.post("/attendance/bulk", {
        sectionId: selectedSectionId,
        date: selectedDate,
        attendances,
      });

      await Swal.fire({
        icon: "success", title: "সফল!",
        html: `${students.length} জন শিক্ষার্থীর উপস্থিতি সংরক্ষিত হয়েছে।`,
        confirmButtonText: "ঠিক আছে", confirmButtonColor: "#7c3aed",
        customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl px-6 py-2.5 font-semibold" },
      });

      setAlreadyMarked(true);
      console.log(alreadyMarked);
      await loadStudentsAndAttendance();
    } catch (err) {
      Swal.fire({
        icon: "error", title: "ব্যর্থ!",
        text: err.response?.data?.message ?? "এটেন্ডেন্স জমা দিতে ব্যর্থ হয়েছে।",
        confirmButtonText: "ঠিক আছে", confirmButtonColor: "#7c3aed",
        customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl px-6 py-2.5 font-semibold" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedSection = sections.find((s) => s.id === selectedSectionId);

  return (
    <div className="space-y-5 pb-8">

      {/* -- Header -- */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">এটেন্ডেন্স সেভ করুন</h2>
          <p className="text-sm text-gray-400 mt-0.5">সেকশন ও তারিখ নির্বাচন করে শিক্ষার্থীদের উপস্থিতি দিন</p>
        </div>
        <button
          onClick={() => router.push("/dashboard/teacher/attendance/report")}
          className="flex items-center gap-2 px-5 py-2.5 bg-violet-50 text-violet-700 border border-violet-200 rounded-xl text-sm font-semibold hover:bg-violet-100 transition-colors"
        >
          <BarChart2 size={16} /> রিপোর্ট দেখুন <ChevronRight size={14} />
        </button>
      </div>

      {/* -- Section + Date selector -- */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-wrap gap-4">
          {/* Section dropdown */}
          <div className="flex-1 min-w-48">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              সেকশন
            </label>
            {sectionsLoading ? (
              <div className="h-11 bg-gray-100 rounded-xl animate-pulse" />
            ) : sections.length === 0 ? (
              <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-2.5 rounded-xl">
                <AlertCircle size={15} /> কোনো সেকশন নির্ধারিত নেই
              </div>
            ) : (
              <select
                value={selectedSectionId}
                onChange={(e) => setSelectedSectionId(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white text-gray-700 font-medium"
              >
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.class?.name ?? s.className ?? "ক্লাস"} — সেকশন {s.name}
                    {s.shift ? ` (${s.shift})` : ""}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Date picker */}
          <div className="flex-1 min-w-48">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              তারিখ
            </label>
            <input
              type="date"
              value={selectedDate}
              max={todayISO()}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white text-gray-700 font-medium"
            />
          </div>

          {/* Refresh */}
          <div className="flex items-end">
            <button
              onClick={loadStudentsAndAttendance}
              disabled={studentsLoading || !selectedSectionId}
              className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500 disabled:opacity-40"
            >
              <RefreshCw size={16} className={studentsLoading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Fallback notice */}
        {isFallback && !sectionsLoading && (
          <div className="mt-3 flex items-center gap-2 text-xs text-amber-700 bg-amber-50 px-4 py-2.5 rounded-xl border border-amber-100">
            <span className="shrink-0">⚠</span>
            শিক্ষকের নির্ধারিত সেকশন তথ্য এখনো API তে যোগ হয়নি। প্রতিষ্ঠানের সকল সেকশন দেখানো হচ্ছে।
          </div>
        )}

        {/* Already marked notice */}
        {/* {alreadyMarked && !studentsLoading && (
          <div className="mt-4 flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-100">
            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
            এই তারিখে উপস্থিতি আগে নেওয়া হয়েছে। আপনি পরিবর্তন করে পুনরায় জমা দিতে পারেন।
          </div>
        )} */}
      </div>

      {/* -- Error -- */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 px-5 py-4 rounded-2xl text-sm font-medium">
          <AlertCircle size={18} className="shrink-0" />
          {error}
          <button onClick={loadStudentsAndAttendance} className="ml-auto text-xs font-bold underline">
            আবার চেষ্টা করুন
          </button>
        </div>
      )}

      {/* ── Students list ── */}
      {!error && selectedSectionId && (
        <div className="space-y-3">

          {/* Toolbar */}
          {!studentsLoading && students.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Summary badges */}
              <div className="flex flex-wrap gap-2">
                <SummaryBadge label="উপস্থিত" count={summary.PRESENT} color="text-emerald-700" bg="bg-emerald-50" />
                <SummaryBadge label="অনুপস্থিত" count={summary.ABSENT} color="text-red-600" bg="bg-red-50" />
                <SummaryBadge label="দেরিতে" count={summary.LATE} color="text-amber-700" bg="bg-amber-50" />
                <SummaryBadge label="ছুটি" count={summary.LEAVE} color="text-blue-700" bg="bg-blue-50" />
              </div>
              {/* Mark all */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-bold">সবাইকে:</span>
                {STATUS_OPTIONS.map((opt) => (
                  <button key={opt.value} onClick={() => markAll(opt.value)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${opt.bg} ${opt.color} ${opt.border} hover:opacity-80`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section info + student count */}
          {!studentsLoading && selectedSection && (
            <div className="flex items-center gap-3 px-1">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <BookOpen size={15} className="text-violet-500" />
                <span className="font-semibold">
                  {selectedSection.class?.name ?? "ক্লাস"} — সেকশন {selectedSection.name}
                </span>
              </div>
              <span className="text-gray-300">·</span>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users size={14} />
                <span>{students.length} জন শিক্ষার্থী</span>
              </div>
              <span className="text-gray-300">·</span>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CalendarDays size={14} />
                <span>{formatDateBN(selectedDate)}</span>
              </div>
            </div>
          )}

          {/* Student rows */}
          <div className="space-y-2">
            {studentsLoading
              ? Array(6).fill(0).map((_, i) => <SkeletonStudentRow key={i} />)
              : students.length === 0
                ? (
                  <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-gray-100">
                    <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center mb-3">
                      <Users size={24} className="text-violet-400" />
                    </div>
                    <p className="font-semibold text-gray-600">এই সেকশনে কোনো শিক্ষার্থী নেই</p>
                  </div>
                )
                : students.map((student, idx) => {
                  const currentStatus = attendance[student.id];
                  const currentRemark = remarks[student.id] ?? "";
                  const initials = student.fullNameEnglish?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) ?? "S";
                  const isAbsentOrLate = currentStatus === "ABSENT" || currentStatus === "LATE";

                  return (
                    <div key={student.id}
                      className={`bg-white rounded-2xl border transition-all duration-150 overflow-hidden ${currentStatus === "PRESENT" ? "border-emerald-100" :
                          currentStatus === "ABSENT" ? "border-red-100" :
                            currentStatus === "LATE" ? "border-amber-100" :
                              currentStatus === "LEAVE" ? "border-blue-100" :
                                "border-gray-100"
                        }`}
                    >
                      <div className="flex items-center gap-4 px-5 py-4">
                        {/* Index */}
                        <span className="text-xs font-bold text-gray-400 w-5 shrink-0 text-right">{idx + 1}</span>

                        {/* Avatar + name */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${currentStatus === "PRESENT" ? "bg-emerald-100 text-emerald-700" :
                              currentStatus === "ABSENT" ? "bg-red-100 text-red-600" :
                                currentStatus === "LATE" ? "bg-amber-100 text-amber-700" :
                                  currentStatus === "LEAVE" ? "bg-blue-100 text-blue-700" :
                                    "bg-violet-100 text-violet-700"
                            }`}>
                            {initials}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">{student.fullNameEnglish}</p>
                            <p className="text-xs text-gray-400">
                              {student.studentCode}
                              {student.currentEnrollment?.rollNumber && ` · রোল: ${student.currentEnrollment.rollNumber}`}
                            </p>
                          </div>
                        </div>

                        {/* Status buttons */}
                        <div className="flex items-center gap-2 shrink-0">
                          {STATUS_OPTIONS.map((opt) => {
                            const Icon = opt.icon;
                            const isActive = currentStatus === opt.value;
                            return (
                              <button
                                key={opt.value}
                                onClick={() => setStudentStatus(student.id, opt.value)}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all active:scale-95 ${isActive
                                    ? `${opt.activeBg} ${opt.activeText} border-transparent shadow-sm`
                                    : `bg-white ${opt.color} ${opt.border} hover:${opt.bg}`
                                  }`}
                              >
                                <Icon size={13} />
                                <span className="hidden sm:inline">{opt.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Remarks input for ABSENT / LATE */}
                      {isAbsentOrLate && (
                        <div className="px-5 pb-4">
                          <input
                            type="text"
                            value={currentRemark}
                            onChange={(e) => setStudentRemark(student.id, e.target.value)}
                            placeholder="মন্তব্য লিখুন (ঐচ্ছিক)..."
                            className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white text-gray-600 placeholder:text-gray-400"
                          />
                        </div>
                      )}
                    </div>
                  );
                })
            }
          </div>

          {/* Submit button */}
          {!studentsLoading && students.length > 0 && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 bg-violet-600 text-white rounded-xl text-sm font-bold hover:bg-violet-700 transition-all active:scale-95 disabled:opacity-60 shadow-lg shadow-violet-200"
              >
                {isSubmitting
                  ? <><Loader2 size={16} className="animate-spin" /> জমা হচ্ছে...</>
                  : <><Check size={16} /> উপস্থিতি জমা দিন ({students.length} জন)</>
                }
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AttendancePage;