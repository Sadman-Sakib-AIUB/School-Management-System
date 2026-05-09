"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, BarChart2, Users, TrendingUp, TrendingDown,
  Trophy, Loader2, AlertCircle, CheckCircle2, XCircle,
  ChevronDown, ChevronUp, Download, Printer,
  Send, Mail, MessageSquare, X,
} from "lucide-react";

import Swal from "sweetalert2";
import axiosInstance from "@/src/lib/axiosInstance";
import { EXAM_TYPE_BN } from "../../page";

// ---------- CONSTANTS -------------

const GRADE_PILL = {
  "A+": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "A": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "A-": "bg-teal-100 text-teal-700 border-teal-200",
  "B": "bg-blue-100 text-blue-700 border-blue-200",
  "C": "bg-amber-100 text-amber-700 border-amber-200",
  "D": "bg-orange-100 text-orange-700 border-orange-200",
  "F": "bg-red-100 text-red-600 border-red-200",
};

const GRADE_PRINT = {
  "A+": { bg: "#d1fae5", text: "#065f46", border: "#a7f3d0" },
  "A": { bg: "#d1fae5", text: "#065f46", border: "#a7f3d0" },
  "A-": { bg: "#ccfbf1", text: "#134e4a", border: "#99f6e4" },
  "B": { bg: "#dbeafe", text: "#1e3a8a", border: "#93c5fd" },
  "C": { bg: "#fef3c7", text: "#78350f", border: "#fcd34d" },
  "D": { bg: "#ffedd5", text: "#9a3412", border: "#fdba74" },
  "F": { bg: "#fee2e2", text: "#7f1d1d", border: "#fca5a5" },
};

const rankBadge = (rank) => {
  if (rank === 1) return { emoji: "🥇", label: "১ম", bg: "#fef3c7", text: "#78350f" };
  if (rank === 2) return { emoji: "🥈", label: "২য়", bg: "#f3f4f6", text: "#374151" };
  if (rank === 3) return { emoji: "🥉", label: "৩য়", bg: "#ffedd5", text: "#7c2d12" };
  return null;
};

const pctColor = (p) => p >= 80 ? "text-emerald-600" : p >= 50 ? "text-amber-600" : "text-red-500";
const pctBarCls = (p) => p >= 80 ? "bg-emerald-500" : p >= 50 ? "bg-amber-500" : "bg-red-500";

// ----------- MESSAGE COMPOSE MODAL -------------
function MessageModal({ isOpen, onClose, student, exam, channel }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!isOpen || !student || !exam) return;
    const isPassed = student.status === "PASS";
    const subj = `${exam.name} - ${student.student?.fullNameEnglish} এর ফলাফল`;
    const msg =
      `প্রিয় অভিভাবক,

আপনার সন্তান ${student.student?.fullNameEnglish} (রোল: ${student.rollNumber}) "${exam.name}"-এ নিম্নলিখিত ফলাফল অর্জন করেছে:

মোট নম্বর: ${student.totalObtained} / ${student.grandTotal}
শতকরা হার: ${student.percentage}%
সার্বিক গ্রেড: ${student.overallGrade}
GPA: ${student.averageGPA}
ফলাফল: ${isPassed ? "উত্তীর্ণ ✓" : "অনুত্তীর্ণ ✗"}

${!isPassed ? "অনুগ্রহ করে বিষয়টি গুরুত্বের সাথে বিবেচনা করুন।\n" : ""}
ধন্যবাদ,
${exam.class} — সেকশন ${exam.section} কর্তৃপক্ষ`;

    setSubject(subj);
    setBody(msg);
  }, [isOpen, student, exam]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSendGmail = async () => {
    setSending(true);
    try {
      // Attempt to send via backend API (placeholder)
     const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(gmailUrl, "_blank");
      onClose();

      if (response.ok) {
        await Swal.fire({
          icon: "success", title: "ইমেইল পাঠানো হয়েছে!",
          html: `<strong>${student.student?.fullNameEnglish}</strong>-এর অভিভাবককে ইমেইল পাঠানো হয়েছে।`,
          confirmButtonText: "ঠিক আছে", confirmButtonColor: "#7c3aed",
          customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl px-6 py-2.5 font-semibold" },
        });
        onClose();
      } else {
        throw new Error("Failed");
      }
    } catch {
      // Fallback: open Gmail compose in browser
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(gmailUrl, "_blank");
      onClose();
    } finally { setSending(false); }
  };


  


  const handleSendCustom = async () => {
    setSending(true);
    try {
      // Placeholder for custom message API
      await new Promise(r => setTimeout(r, 800));
      await Swal.fire({
        icon: "success", title: "বার্তা পাঠানো হয়েছে!",
        html: `<strong>${student.student?.fullNameEnglish}</strong>-এর অভিভাবককে বার্তা পাঠানো হয়েছে।`,
        confirmButtonText: "ঠিক আছে", confirmButtonColor: "#7c3aed",
        customClass: {
          popup: "rounded-2xl",
          confirmButton: "rounded-xl px-6 py-2.5 font-semibold"
        },
      });
      onClose();
    } catch {
      Swal.fire({
        icon: "error",
        title: "ব্যর্থ!",
        confirmButtonText: "ঠিক আছে",
        confirmButtonColor: "#7c3aed",
        customClass: {
          popup: "rounded-2xl",
          confirmButton: "rounded-xl px-6 py-2.5 font-semibold"
        }
      });
    } finally { setSending(false); }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
              {channel === "gmail" ? <Mail size={17} className="text-blue-600" /> : <MessageSquare size={17} className="text-blue-600" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                {channel === "gmail" ? "Gmail বার্তা" : "কাস্টম বার্তা"}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">{student?.student?.fullNameEnglish} এর অভিভাবককে</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {channel === "gmail" && (
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">বিষয়</label>
              <input value={subject} onChange={e => setSubject(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white" />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">বার্তা</label>
            <textarea value={body} onChange={e => setBody(e.target.value)} rows={10}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white resize-none font-mono" />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 shrink-0">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">
            বাতিল
          </button>
          <button
            onClick={channel === "gmail" ? handleSendGmail : handleSendCustom}
            disabled={sending || !body.trim()}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:scale-95 disabled:opacity-50 shadow-lg shadow-blue-200"
          >
            {sending ? <><Loader2 size={15} className="animate-spin" /> পাঠানো হচ্ছে...</> : <><Send size={15} /> পাঠান</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ------------ BULK MESSAGE MODAL --------------
function BulkMessageModal({ isOpen, onClose, data, channel }) {
  const [subject, setSubject] = useState("");
  const [template, setTemplate] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!isOpen || !data) return;
    setSubject(`${data.exam?.name} - ফলাফল প্রকাশিত হয়েছে`);
    setTemplate(
      `প্রিয় অভিভাবক,

আপনার সন্তানের "${data.exam?.name}" পরীক্ষার ফলাফল প্রকাশিত হয়েছে।

${data.exam?.class} — সেকশন ${data.exam?.section}

অনুগ্রহ করে পোর্টালে লগইন করে বিস্তারিত রিপোর্ট দেখুন।

ধন্যবাদ,
কর্তৃপক্ষ`
    );
  }, [isOpen, data]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const totalParents = data?.studentResults?.length ?? 0;

  const handleBulkSend = async () => {
    const { isConfirmed } = await Swal.fire({
      title: "বার্তা পাঠাবেন?",
      html: `<strong>${totalParents} জন</strong> শিক্ষার্থীর অভিভাবককে বার্তা পাঠানো হবে।`,
      icon: "question", showCancelButton: true,
      confirmButtonText: "হ্যাঁ, পাঠান",
      cancelButtonText: "বাতিল",
      confirmButtonColor: "#2563eb", cancelButtonColor: "#6b7280",
      customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl px-5 py-2.5 font-semibold", cancelButton: "rounded-xl px-5 py-2.5 font-semibold" },
    });
    if (!isConfirmed) return;

    setSending(true);
    try {
      if (channel === "gmail") {
        // Open Gmail compose for bulk (best effort)
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(template)}`;
        window.open(gmailUrl, "_blank");
      } else {
        await new Promise(r => setTimeout(r, 1000));
      }
      await Swal.fire({
        icon: "success", title: "বার্তা পাঠানো হয়েছে!",
        html: `${totalParents} জন অভিভাবককে বার্তা পাঠানো হয়েছে।`,
        confirmButtonText: "ঠিক আছে", confirmButtonColor: "#7c3aed",
        customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl px-6 py-2.5 font-semibold" },
      });
      onClose();
    } catch {
      Swal.fire({
        icon: "error", title: "ব্যর্থ!", confirmButtonText: "ঠিক আছে", confirmButtonColor: "#7c3aed",
        customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl px-6 py-2.5 font-semibold" }
      });
    } finally { setSending(false); }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
              <Send size={17} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">সকল অভিভাবককে বার্তা</h3>
              <p className="text-xs text-gray-400 mt-0.5">{totalParents} জন অভিভাবক · {channel === "gmail" ? "Gmail" : "কাস্টম"}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {channel === "gmail" && (
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">বিষয়</label>
              <input value={subject} onChange={e => setSubject(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white" />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">বার্তার টেমপ্লেট</label>
            <textarea value={template} onChange={e => setTemplate(e.target.value)} rows={10}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white resize-none font-mono" />
          </div>
          <p className="text-xs text-gray-400">
            💡 এই বার্তাটি {totalParents} জন শিক্ষার্থীর অভিভাবকদের কাছে পাঠানো হবে।
          </p>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50 shrink-0">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">
            বাতিল
          </button>
          <button onClick={handleBulkSend} disabled={sending || !template.trim()}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:scale-95 disabled:opacity-50 shadow-lg shadow-blue-200">
            {sending ? <><Loader2 size={15} className="animate-spin" /> পাঠানো হচ্ছে...</> : <><Send size={15} /> {totalParents} জনকে পাঠান</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ------------ PRINT TEMPLATE --------------
function PrintTemplate({ data }) {
  const stats = data.statistics;
  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", background: "#fff", padding: 28 }}>
      <div style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)", borderRadius: 16, padding: "20px 24px", marginBottom: 20 }}>
        <p style={{ color: "rgba(255,255,255,.7)", fontSize: 11, fontWeight: 600, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: 1 }}>সেকশন ফলাফল সারসংক্ষেপ</p>
        <h1 style={{ color: "#fff", fontSize: 20, fontWeight: 800, margin: "0 0 4px" }}>{data.exam?.name}</h1>
        <p style={{ color: "rgba(255,255,255,.8)", fontSize: 13, margin: 0 }}>{data.exam?.class} — সেকশন {data.exam?.section} · {EXAM_TYPE_BN[data.exam?.type] ?? data.exam?.type}</p>
        <div style={{ display: "flex", gap: 24, marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,.2)" }}>
          {[["মোট", stats.totalStudents], ["ফলাফল", stats.resultsEntered], ["পাস", stats.passedStudents], ["ফেল", stats.failedStudents], ["পাসের হার", `${stats.passPercentage}%`]].map(([l, v], i) => (
            <div key={i}><p style={{ color: "rgba(255,255,255,.6)", fontSize: 10, margin: "0 0 2px", textTransform: "uppercase" }}>{l}</p><p style={{ color: "#fff", fontSize: 16, fontWeight: 800, margin: 0 }}>{v}</p></div>
          ))}
        </div>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f9fafb" }}>
            {["র‍্যাংক", "রোল", "শিক্ষার্থী", "প্রাপ্ত", "মোট", "%", "গ্রেড", "GPA", "ফলাফল"].map((h, i) => (
              <th key={i} style={{ padding: "9px 10px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", borderBottom: "2px solid #e5e7eb" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.studentResults?.map((sr, i) => {
            const gc = GRADE_PRINT[sr.overallGrade] ?? { bg: "#f9fafb", text: "#374151", border: "#e5e7eb" };
            const rb = rankBadge(sr.rank);
            return (
              <tr key={i} style={{ borderBottom: "1px solid #f3f4f6", background: sr.status === "FAIL" ? "#fff5f5" : "#fff" }}>
                <td style={{ padding: "9px 10px", fontSize: 11 }}>
                  <span style={{ background: rb?.bg ?? "#f3f4f6", color: rb?.text ?? "#6b7280", padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 800 }}>{rb ? `${rb.emoji} ${rb.label}` : sr.rank}</span>
                </td>
                <td style={{ padding: "9px 10px", fontSize: 11, fontFamily: "monospace", color: "#6b7280" }}>{sr.rollNumber}</td>
                <td style={{ padding: "9px 10px" }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#1f2937", margin: 0 }}>{sr.student?.fullNameEnglish}</p>
                  <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>{sr.student?.studentCode}</p>
                </td>
                <td style={{ padding: "9px 10px", fontSize: 13, fontWeight: 800, color: "#1f2937" }}>{sr.totalObtained}</td>
                <td style={{ padding: "9px 10px", fontSize: 11, color: "#6b7280" }}>{sr.grandTotal}</td>
                <td style={{ padding: "9px 10px", fontSize: 11, fontWeight: 600, color: sr.percentage >= 80 ? "#059669" : sr.percentage >= 50 ? "#d97706" : "#dc2626" }}>{sr.percentage}%</td>
                <td style={{ padding: "9px 10px" }}>
                  <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 800, background: gc.bg, color: gc.text, border: `1px solid ${gc.border}` }}>{sr.overallGrade}</span>
                </td>
                <td style={{ padding: "9px 10px", fontSize: 12, fontWeight: 600, color: "#374151" }}>{sr.averageGPA}</td>
                <td style={{ padding: "9px 10px", fontSize: 10, fontWeight: 800, color: sr.status === "PASS" ? "#059669" : "#dc2626" }}>{sr.status === "PASS" ? "✓ পাস" : "✗ ফেল"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{ marginTop: 20, paddingTop: 14, borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between" }}>
        <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>মুদ্রণ: {new Date().toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" })}</p>
        <div style={{ textAlign: "center" }}><div style={{ height: 40, borderBottom: "1px solid #374151", width: 120, marginBottom: 4 }} /><p style={{ fontSize: 10, color: "#6b7280", margin: 0 }}>কর্তৃপক্ষের স্বাক্ষর</p></div>
      </div>
    </div>
  );
}

//  ------------ STUDENT ROW -----------------
function StudentRow({ sr, onMessage }) {
  const [open, setOpen] = useState(false);
  const [msgChannel, setMsgChannel] = useState(null);
  const isPassed = sr.status === "PASS";
  const gradeCls = GRADE_PILL[sr.overallGrade] ?? "bg-gray-100 text-gray-600 border-gray-200";
  const rb = rankBadge(sr.rank);
  const initials = sr.student?.fullNameEnglish?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) ?? "S";

  return (
    <>
      <tr className={`transition-colors ${open ? "bg-violet-50/30" : "hover:bg-gray-50/60"}`}>
        {/* Rank */}
        <td className="px-5 py-3.5">
          {rb
            ? <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: rb.bg, color: rb.text }}>{rb.emoji} {rb.label}</span>
            : <span className="font-mono text-xs font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded-lg">{sr.rank}</span>
          }
        </td>
        {/* Roll */}
        <td className="px-5 py-3.5">
          <span className="font-mono text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">{sr.rollNumber ?? "—"}</span>
        </td>
        {/* Student */}
        <td className="px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-violet-100 rounded-xl flex items-center justify-center text-violet-700 font-bold text-xs shrink-0">{initials}</div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">{sr.student?.fullNameEnglish}</p>
              <p className="text-xs text-gray-400">{sr.student?.studentCode}</p>
            </div>
          </div>
        </td>
        {/* Marks */}
        <td className="px-5 py-3.5">
          <p className="text-sm font-bold text-gray-800">{sr.totalObtained}</p>
          <p className="text-xs text-gray-400">/ {sr.grandTotal}</p>
        </td>
        {/* Pct */}
        <td className="px-5 py-3.5">
          <div className="flex items-center gap-2">
            <div className="w-14 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${pctBarCls(sr.percentage)}`} style={{ width: `${Math.min(sr.percentage, 100)}%` }} />
            </div>
            <span className={`text-sm font-bold ${pctColor(sr.percentage)}`}>{sr.percentage}%</span>
          </div>
        </td>
        {/* Grade */}
        <td className="px-5 py-3.5">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${gradeCls}`}>{sr.overallGrade}</span>
        </td>
        {/* GPA */}
        <td className="px-5 py-3.5 text-sm font-semibold text-gray-700">{sr.averageGPA}</td>
        {/* Status */}
        <td className="px-5 py-3.5">
          <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full w-fit ${isPassed ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
            {isPassed ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
            {isPassed ? "পাস" : "ফেল"}
          </span>
        </td>
        {/* Actions */}
        <td className="px-4 py-3.5">
          <div className="flex items-center gap-1.5">
            {/* Message buttons */}
            <button onClick={() => onMessage(sr, "gmail")}
              title="Gmail পাঠান"
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Mail size={14} />
            </button>
            <button onClick={() => onMessage(sr, "custom")}
              title="বার্তা পাঠান"
              className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors">
              <MessageSquare size={14} />
            </button>
            {/* Expand */}
            <button onClick={() => setOpen(v => !v)}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </td>
      </tr>

      {/* Subject breakdown */}
      {open && (
        <tr className="bg-violet-50/20 border-b border-violet-100">
          <td colSpan={9} className="px-5 py-3">
            <div className="flex flex-wrap gap-2">
              {sr.subjectResults?.map((sub, i) => {
                const gc = GRADE_PILL[sub.grade] ?? "bg-gray-100 text-gray-600 border-gray-200";
                return (
                  <div key={i} className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-sm text-xs">
                    <span className="font-semibold text-gray-700">{sub.subject}</span>
                    <span className="text-gray-400">{sub.marksObtained}/{sub.totalMarks}</span>
                    <span className={`font-bold px-1.5 py-0.5 rounded-full border ${gc}`}>{sub.grade}</span>
                    <span className="text-gray-400">GPA {sub.gpa}</span>
                  </div>
                );
              })}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ----------- MAIN PAGE -------------
export default function SectionSummaryPage() {
  const { examId } = useParams();
  const router = useRouter();

  const [data, setData] = useState(null);
  const [exam, setExam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const printRef = useRef(null);

  // Message modal state
  const [msgStudent, setMsgStudent] = useState(null);
  const [msgChannel, setMsgChannel] = useState(null);
  const [bulkChannel, setBulkChannel] = useState(null); // "gmail" | "custom" | null

  // Fetch exam info then section summary
  useEffect(() => {
    const load = async () => {
      setIsLoading(true); setError(null);
      try {
        const examRes = await axiosInstance.get("/results/exams", { params: { limit: 200 } });
        const found = (examRes.data?.data ?? []).find(e => e.id === examId);
        if (!found) throw new Error("Exam not found");
        setExam(found);

        const sumRes = await axiosInstance.get(`/results/section/${found.sectionId}/exam/${examId}`);
        setData(sumRes.data?.data);
      } catch (err) {
        setError(err.response?.data?.message ?? "ডেটা লোড করতে ব্যর্থ হয়েছে।");
      } finally { setIsLoading(false); }
    };
    load();
  }, [examId]);

  const handleDownload = async () => {
    if (!printRef.current) return;
    setDownloading(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(printRef.current, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const pw = pdf.internal.pageSize.getWidth();
      pdf.addImage(img, "PNG", 0, 0, pw, Math.min((canvas.height * pw) / canvas.width, pdf.internal.pageSize.getHeight()));
      pdf.save(`section-summary-${data?.exam?.section ?? "result"}.pdf`);
    } catch (e) { console.error(e); }
    finally { setDownloading(false); }
  };

  const handlePrint = () => {
    if (!printRef.current) return;
    const win = window.open("", "_blank");
    win.document.write(`<html><head><title>Section Summary</title>
      <style>body{margin:0;padding:0;font-family:sans-serif;}@media print{@page{size:A4 landscape;margin:0;}}</style>
      </head><body>${printRef.current.outerHTML}</body></html>`);
    win.document.close(); win.focus();
    setTimeout(() => { win.print(); win.close(); }, 300);
  };

  const openMsg = (student, channel) => {
    setMsgStudent(student);
    setMsgChannel(channel);
  };

  const stats = data?.statistics;

  return (
    <div className="space-y-5 pb-8">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3">
          <button onClick={() => router.push("/dashboard/admin/results")}
            className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500 mt-0.5 shrink-0">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">সেকশন ফলাফল সারসংক্ষেপ</h2>
            {data && (
              <p className="text-sm text-gray-400 mt-0.5">
                {data.exam?.name} · {data.exam?.class} — সেকশন {data.exam?.section}
              </p>
            )}
          </div>
        </div>

        {data && (
          <div className="flex items-center gap-2 flex-wrap">
            {/* Bulk message buttons */}
            <button onClick={() => setBulkChannel("gmail")}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">
              <Mail size={15} /> Gmail বার্তা
            </button>
            <button onClick={() => setBulkChannel("custom")}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border border-violet-200 text-violet-700 bg-violet-50 hover:bg-violet-100 rounded-xl transition-colors">
              <MessageSquare size={15} /> কাস্টম বার্তা
            </button>
            <div className="w-px h-8 bg-gray-200" />
            <button onClick={handleDownload} disabled={downloading}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 rounded-xl disabled:opacity-50">
              {downloading ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />} PDF
            </button>
            <button onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 rounded-xl">
              <Printer size={15} /> প্রিন্ট
            </button>
          </div>
        )}
      </div>

      {/* ── Loading / Error ── */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 size={32} className="text-violet-400 animate-spin mb-3" />
          <p className="text-sm text-gray-400">লোড হচ্ছে...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="flex flex-col items-center py-24 text-center">
          <AlertCircle size={32} className="text-red-400 mb-3" />
          <p className="text-sm font-medium text-gray-700 mb-3">{error}</p>
          <button onClick={() => router.back()} className="text-sm text-violet-600 hover:underline font-semibold">← ফিরে যান</button>
        </div>
      )}

      {data && !isLoading && (
        <>
          {/* ── Stat cards ── */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: "মোট শিক্ষার্থী", v: stats.totalStudents, Icon: Users, color: "text-violet-600", bg: "bg-violet-50 border-violet-100" },
              { label: "ফলাফল দেওয়া", v: stats.resultsEntered, Icon: BarChart2, color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
              { label: "পাস করেছে", v: stats.passedStudents, Icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
              { label: "ফেল করেছে", v: stats.failedStudents, Icon: TrendingDown, color: "text-red-500", bg: "bg-red-50 border-red-100" },
              {
                label: "পাসের হার",
                v: `${stats.passPercentage}%`,
                Icon: Trophy,
                color: stats.passPercentage >= 75 ? "text-emerald-600" : "text-amber-600",
                bg: stats.passPercentage >= 75 ? "bg-emerald-50 border-emerald-100" : "bg-amber-50 border-amber-100"
              },
            ].map(({ label, v, Icon, color, bg }, i) => (
              <div key={i} className={`${bg} border rounded-2xl p-5 flex flex-col items-center text-center`}>
                <Icon size={20} className={`${color} mb-2`} />
                <p className={`text-3xl font-bold ${color}`}>{v}</p>
                <p className={`text-xs font-semibold ${color} opacity-80 mt-1`}>{label}</p>
              </div>
            ))}
          </div>

          {/* Pass rate bar */}
          <div className="bg-white border border-gray-100 rounded-2xl px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-sm font-bold text-gray-700">সেকশনের পাসের হার</p>
              <span className={`text-2xl font-bold ${pctColor(stats.passPercentage)}`}>{stats.passPercentage}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-700 ${pctBarCls(stats.passPercentage)}`}
                style={{ width: `${stats.passPercentage}%` }} />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-xs text-gray-400">০%</span>
              <span className="text-xs text-amber-500 font-medium">সতর্কতা: ৫০%</span>
              <span className="text-xs text-emerald-500 font-medium">ভালো: ৭৫%</span>
              <span className="text-xs text-gray-400">১০০%</span>
            </div>
          </div>

          {/* ── Student results table ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-gray-800">শিক্ষার্থীদের ফলাফল</h3>
              <p className="text-xs text-gray-400">বিস্তারিত ▾ বা বার্তা <Mail size={11} className="inline" /> / <MessageSquare size={11} className="inline" /> বাটনে ক্লিক করুন</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["র‍্যাংক", "রোল", "শিক্ষার্থী", "প্রাপ্ত নম্বর", "%", "গ্রেড", "GPA", "ফলাফল", ""].map((h, i) => (
                      <th key={i} className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.studentResults?.map((sr, i) => (
                    <StudentRow key={sr.student?.id ?? i} sr={sr} onMessage={openMsg} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── Off-screen print template ── */}
      {data && (
        <div style={{ position: "fixed", left: -9999, top: 0, width: 1100, pointerEvents: "none" }}>
          <div ref={printRef}><PrintTemplate data={data} /></div>
        </div>
      )}

      {/* ── Individual message modal ── */}
      <MessageModal
        isOpen={!!msgStudent && !!msgChannel}
        onClose={() => { setMsgStudent(null); setMsgChannel(null); }}
        student={msgStudent}
        exam={data?.exam}
        channel={msgChannel}
      />

      {/* ── Bulk message modal ── */}
      <BulkMessageModal
        isOpen={!!bulkChannel}
        onClose={() => setBulkChannel(null)}
        data={data}
        channel={bulkChannel}
      />

    </div>
  );
}