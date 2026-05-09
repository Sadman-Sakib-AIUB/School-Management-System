"use client";
import { useState, useEffect, useRef } from "react";
import {
  X, Loader2, Download, Printer, AlertCircle,
  Trophy, Users, TrendingUp, TrendingDown,
  CheckCircle2, XCircle, ChevronDown, ChevronUp,
  ClipboardList,
} from "lucide-react";
import axiosInstance from "@/src/lib/axiosInstance";


// ─── HELPERS ──────────────────────────────────────────────────────────────
const GRADE_PILL = {
  "A+": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "A":  "bg-emerald-100 text-emerald-700 border-emerald-200",
  "A-": "bg-teal-100 text-teal-700 border-teal-200",
  "B":  "bg-blue-100 text-blue-700 border-blue-200",
  "C":  "bg-amber-100 text-amber-700 border-amber-200",
  "D":  "bg-orange-100 text-orange-700 border-orange-200",
  "F":  "bg-red-100 text-red-600 border-red-200",
};
const GRADE_PRINT = {
  "A+": { bg: "#d1fae5", text: "#065f46", border: "#a7f3d0" },
  "A":  { bg: "#d1fae5", text: "#065f46", border: "#a7f3d0" },
  "A-": { bg: "#ccfbf1", text: "#134e4a", border: "#99f6e4" },
  "B":  { bg: "#dbeafe", text: "#1e3a8a", border: "#93c5fd" },
  "C":  { bg: "#fef3c7", text: "#78350f", border: "#fcd34d" },
  "D":  { bg: "#ffedd5", text: "#9a3412", border: "#fdba74" },
  "F":  { bg: "#fee2e2", text: "#7f1d1d", border: "#fca5a5" },
};
const EXAM_TYPE_BN = {
  MIDTERM: "মিডটার্ম", FINAL: "ফাইনাল", UNIT_TEST: "ইউনিট টেস্ট",
  MOCK: "মক", QUARTERLY: "ত্রৈমাসিক", HALF_YEARLY: "অর্ধ-বার্ষিক",
  YEARLY: "বার্ষিক", WEEKLY_TEST: "সাপ্তাহিক", OTHER: "অন্যান্য",
};
const rankBadge = (rank) => {
  if (rank === 1) return { emoji: "🥇", label: "১ম",  textColor: "#78350f", bgColor: "#fef3c7" };
  if (rank === 2) return { emoji: "🥈", label: "২য়",  textColor: "#374151", bgColor: "#f3f4f6" };
  if (rank === 3) return { emoji: "🥉", label: "৩য়",  textColor: "#7c2d12", bgColor: "#ffedd5" };
  return null;
};
const pctColor = (p) => p >= 80 ? "text-emerald-600" : p >= 50 ? "text-amber-600" : "text-red-500";
const pctBar   = (p) => p >= 80 ? "bg-emerald-500"  : p >= 50 ? "bg-amber-500"   : "bg-red-500";

// ─── STUDENT ROW (expandable) ─────────────────────────────────────────────
function StudentRow({ sr }) {
  const [open, setOpen] = useState(false);
  const isPassed  = sr.status === "PASS";
  const gradeCls  = GRADE_PILL[sr.overallGrade] ?? "bg-gray-100 text-gray-600 border-gray-200";
  const rb        = rankBadge(sr.rank);
  const initials  = sr.student?.fullNameEnglish?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) ?? "S";

  return (
    <>
      <tr
        onClick={() => setOpen(v => !v)}
        className={`hover:bg-gray-50/60 cursor-pointer transition-colors ${open ? "bg-violet-50/30" : ""}`}
      >
        {/* Rank */}
        <td className="px-5 py-3.5">
          {rb
            ? <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: rb.bgColor, color: rb.textColor }}>
                {rb.emoji} {rb.label}
              </span>
            : <span className="font-mono text-xs font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded-lg">{sr.rank}</span>
          }
        </td>
        {/* Roll */}
        <td className="px-5 py-3.5">
          <span className="font-mono text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
            {sr.rollNumber ?? "—"}
          </span>
        </td>
        {/* Student */}
        <td className="px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-violet-100 rounded-xl flex items-center justify-center text-violet-700 font-bold text-xs shrink-0">
              {initials}
            </div>
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
        {/* Percentage + bar */}
        <td className="px-5 py-3.5">
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${pctBar(sr.percentage)}`} style={{ width: `${Math.min(sr.percentage, 100)}%` }} />
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
        {/* Toggle */}
        <td className="px-4 py-3.5 text-gray-400">
          {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
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

// ─── PRINT TEMPLATE ───────────────────────────────────────────────────────
function PrintTemplate({ data }) {
  const stats = data.statistics;
  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", background: "#fff", padding: 28 }}>
      {/* Gradient header */}
      <div style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)", borderRadius: 16, padding: "20px 24px", marginBottom: 20 }}>
        <p style={{ color: "rgba(255,255,255,.7)", fontSize: 11, fontWeight: 600, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: 1 }}>সেকশন ফলাফল সারসংক্ষেপ</p>
        <h1 style={{ color: "#fff", fontSize: 20, fontWeight: 800, margin: "0 0 4px" }}>{data.exam?.name}</h1>
        <p style={{ color: "rgba(255,255,255,.8)", fontSize: 13, margin: 0 }}>{data.exam?.class} — সেকশন {data.exam?.section} · {EXAM_TYPE_BN[data.exam?.type] ?? data.exam?.type}</p>
        <div style={{ display: "flex", gap: 24, marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,.2)" }}>
          {[["মোট",stats.totalStudents],["ফলাফল",stats.resultsEntered],["পাস",stats.passedStudents],["ফেল",stats.failedStudents],["পাসের হার",`${stats.passPercentage}%`]].map(([l,v],i) => (
            <div key={i}>
              <p style={{ color: "rgba(255,255,255,.6)", fontSize: 10, margin: "0 0 2px", textTransform: "uppercase" }}>{l}</p>
              <p style={{ color: "#fff", fontSize: 16, fontWeight: 800, margin: 0 }}>{v}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Table */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f9fafb" }}>
            {["র‍্যাংক","রোল","শিক্ষার্থী","প্রাপ্ত","মোট","%","গ্রেড","GPA","ফলাফল"].map((h,i) => (
              <th key={i} style={{ padding: "9px 10px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: .5, borderBottom: "2px solid #e5e7eb" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.studentResults?.map((sr, i) => {
            const gc = GRADE_PRINT[sr.overallGrade] ?? { bg: "#f9fafb", text: "#374151", border: "#e5e7eb" };
            const rb = rankBadge(sr.rank);
            return (
              <tr key={i} style={{ borderBottom: "1px solid #f3f4f6", background: sr.status === "FAIL" ? "#fff5f5" : "#fff" }}>
                <td style={{ padding: "9px 10px", fontSize: 11, fontWeight: 700 }}>
                  <span style={{ background: rb?.bgColor ?? "#f3f4f6", color: rb?.textColor ?? "#6b7280", padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 800 }}>
                    {rb ? `${rb.emoji} ${rb.label}` : sr.rank}
                  </span>
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
                <td style={{ padding: "9px 10px", fontSize: 10, fontWeight: 800, color: sr.status === "PASS" ? "#059669" : "#dc2626" }}>
                  {sr.status === "PASS" ? "✓ পাস" : "✗ ফেল"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* Footer */}
      <div style={{ marginTop: 20, paddingTop: 14, borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between" }}>
        <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>মুদ্রণ: {new Date().toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" })}</p>
        <div style={{ textAlign: "center" }}>
          <div style={{ height: 40, borderBottom: "1px solid #374151", width: 120, marginBottom: 4 }} />
          <p style={{ fontSize: 10, color: "#6b7280", margin: 0 }}>কর্তৃপক্ষের স্বাক্ষর</p>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN MODAL ───────────────────────────────────────────────────────────
export default function SectionSummaryModal({ isOpen, onClose, sectionId, examId }) {
  const [data, setData]             = useState(null);
  const [isLoading, setIsLoading]   = useState(false);
  const [error, setError]           = useState(null);
  const [downloading, setDownloading] = useState(false);
  const printRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !sectionId || !examId) return;
    setIsLoading(true); setError(null); setData(null);
    axiosInstance.get(`/results/section/${sectionId}/exam/${examId}`)
      .then(res => setData(res.data?.data))
      .catch(err => setError(err.response?.data?.message ?? "সারসংক্ষেপ লোড করতে ব্যর্থ হয়েছে।"))
      .finally(() => setIsLoading(false));
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen, sectionId, examId]);

  const handleDownload = async () => {
    if (!printRef.current) return;
    setDownloading(true);
    try {
      const { default: jsPDF }       = await import("jspdf");
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(printRef.current, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const pw = pdf.internal.pageSize.getWidth();
      const ph = (canvas.height * pw) / canvas.width;
      pdf.addImage(img, "PNG", 0, 0, pw, Math.min(ph, pdf.internal.pageSize.getHeight()));
      pdf.save(`section-summary-${data?.exam?.section ?? sectionId}.pdf`);
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

  if (!isOpen) return null;

  const stats = data?.statistics;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">
      <div className="bg-white w-full max-w-5xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-white shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">সেকশন ফলাফল সারসংক্ষেপ</h2>
            {data && <p className="text-xs text-gray-400 mt-0.5">{data.exam?.name} · {data.exam?.class} — সেকশন {data.exam?.section}</p>}
          </div>
          <div className="flex items-center gap-2">
            {data && (
              <>
                <button onClick={handleDownload} disabled={downloading}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-violet-200 text-violet-700 bg-violet-50 hover:bg-violet-100 rounded-xl disabled:opacity-50">
                  {downloading ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />} PDF
                </button>
                <button onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl">
                  <Printer size={13} /> প্রিন্ট
                </button>
              </>
            )}
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400"><X size={20} /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 size={28} className="text-violet-400 animate-spin mb-3" />
              <p className="text-sm text-gray-400">লোড হচ্ছে...</p>
            </div>
          )}

          {error && !isLoading && (
            <div className="flex flex-col items-center py-20 text-center px-6">
              <AlertCircle size={28} className="text-red-400 mb-3" />
              <p className="text-sm text-gray-600">{error}</p>
            </div>
          )}

          {data && !isLoading && (
            <div className="p-6 space-y-5">

              {/* Stats cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { label: "মোট শিক্ষার্থী",  v: stats.totalStudents,  icon: Users,         color: "text-violet-600",  bg: "bg-violet-50"  },
                  { label: "ফলাফল দেওয়া",     v: stats.resultsEntered, icon: ClipboardList, color: "text-blue-600",    bg: "bg-blue-50"    },
                  { label: "পাস করেছে",        v: stats.passedStudents, icon: TrendingUp,    color: "text-emerald-600", bg: "bg-emerald-50" },
                  { label: "ফেল করেছে",        v: stats.failedStudents, icon: TrendingDown,  color: "text-red-500",     bg: "bg-red-50"     },
                  { label: "পাসের হার",         v: `${stats.passPercentage}%`, icon: Trophy,
                    color: stats.passPercentage >= 75 ? "text-emerald-600" : "text-amber-600",
                    bg:    stats.passPercentage >= 75 ? "bg-emerald-50"    : "bg-amber-50"    },
                ].map(({ label, v, icon: Icon, color, bg }, i) => (
                  <div key={i} className={`${bg} rounded-2xl p-4 flex flex-col items-center text-center`}>
                    <Icon size={18} className={`${color} mb-2`} />
                    <p className={`text-2xl font-bold ${color}`}>{v}</p>
                    <p className={`text-xs font-medium ${color} opacity-80 mt-0.5`}>{label}</p>
                  </div>
                ))}
              </div>

              {/* Pass rate bar */}
              <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-gray-700">সেকশনের পাসের হার</p>
                  <span className={`text-xl font-bold ${stats.passPercentage >= 75 ? "text-emerald-600" : "text-amber-600"}`}>
                    {stats.passPercentage}%
                  </span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700 ${pctBar(stats.passPercentage)}`}
                    style={{ width: `${stats.passPercentage}%` }} />
                </div>
              </div>

              {/* Student table */}
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                <div className="px-5 py-3.5 border-b border-gray-50 flex items-center justify-between">
                  <h3 className="font-bold text-gray-800">শিক্ষার্থীদের ফলাফল</h3>
                  <p className="text-xs text-gray-400">সারি ক্লিক করলে বিষয়ভিত্তিক বিস্তারিত দেখাবে</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        {["র‍্যাংক","রোল","শিক্ষার্থী","প্রাপ্ত নম্বর","%","গ্রেড","GPA","ফলাফল",""].map((h, i) => (
                          <th key={i} className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {data.studentResults?.map((sr, i) => (
                        <StudentRow key={sr.student?.id ?? i} sr={sr} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Off-screen print template */}
      {data && (
        <div style={{ position: "fixed", left: -9999, top: 0, width: 1100, pointerEvents: "none" }}>
          <div ref={printRef}>
            <PrintTemplate data={data} />
          </div>
        </div>
      )}
    </div>
  );
}



