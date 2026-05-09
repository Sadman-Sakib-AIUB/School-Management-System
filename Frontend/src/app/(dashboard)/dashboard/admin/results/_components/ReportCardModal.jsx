"use client";
import { useState, useEffect, useRef } from "react";
import { X, Loader2, Download, Printer, AlertCircle} from "lucide-react";
import axiosInstance from "@/src/lib/axiosInstance";


const GRADE_COLORS = {
  "A+": { bg: "#d1fae5", text: "#065f46", border: "#a7f3d0" },
  "A": { bg: "#d1fae5", text: "#065f46", border: "#a7f3d0" },
  "A-": { bg: "#ccfbf1", text: "#134e4a", border: "#99f6e4" },
  "B": { bg: "#dbeafe", text: "#1e3a8a", border: "#93c5fd" },
  "C": { bg: "#fef3c7", text: "#78350f", border: "#fcd34d" },
  "D": { bg: "#ffedd5", text: "#9a3412", border: "#fdba74" },
  "F": { bg: "#fee2e2", text: "#7f1d1d", border: "#fca5a5" },
};

const EXAM_TYPE_BN = {
  MIDTERM: "মিডটার্ম",
  FINAL: "ফাইনাল",
  WEEKLY_TEST: "সাপ্তাহিক",
  CLASS_TEST: "ক্লাস টেস্ট",
};

const fmtDate = (iso) => iso
  ? new Date(iso).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" })
  : "—";

const ReportCardModal = ({ isOpen, onClose, studentId, studentName, examId, exam }) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !studentId || !examId) return;

    setIsLoading(true);
    setError(null);
    setData(null);

    axiosInstance.get(`/results/student/${studentId}/exam/${examId}`)
      .then(res => setData(res.data?.data))
      .catch(err => setError(err.response?.data?.message ?? "রিপোর্ট কার্ড লোড করতে ব্যর্থ হয়েছে।"))
      .finally(() => setIsLoading(false));

    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen, studentId, examId]);

  // console.log(data);


  // PDF generation using jsPDF and html2canvas
  const handleDownload = async () => {

    if (!cardRef.current) return;
    setDownloading(true);

    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: html2canvas } = await import("html2canvas");

      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const pw = pdf.internal.pageSize.getWidth();
      const ph = (canvas.height * pw) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pw, ph);
      pdf.save(`report-card-${data?.student?.studentCode}.pdf`);
    }
    catch (e) {
      console.error(e);
      alert("PDF ডাউনলোড করতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
    }
    finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    if (!cardRef.current) return;
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title> Report Card </title>
            <style>body{margin:0;padding:0;font-family:sans-serif;}
              @media print{@page{size:A4;margin:0;}}</style>
        </head>
      <body>${cardRef.current.outerHTML}</body>
      </html>`);
    win.document.close();
    win.focus();
    setTimeout(() => {
      win.print();
      win.close();
    }, 300);
  };

  if (!isOpen) return null;

  const d = data;
  console.log(d);
  const isPassed = d?.overallResult?.status === "PASS";
  // console.log(isPassed);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">
      <div className="bg-white w-full max-w-2xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">

        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="font-bold text-gray-900 text-lg">রিপোর্ট কার্ড</h2>
          <div className="flex items-center gap-2">
            {d && (
              <>
                <button onClick={handleDownload} disabled={downloading}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-violet-200 text-violet-700 bg-violet-50 hover:bg-violet-100 rounded-xl transition-colors disabled:opacity-50">
                  {downloading ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
                  PDF
                </button>
                <button onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                  <Printer size={13} /> প্রিন্ট
                </button>
              </>
            )}
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 size={28} className="text-violet-400 animate-spin mb-3" />
              <p className="text-sm text-gray-400">লোড হচ্ছে...</p>
            </div>
          )}

          {error && !isLoading && (
            <div className="flex flex-col items-center py-16 text-center">
              <AlertCircle size={24} className="text-red-400 mb-3" />
              <p className="text-sm text-gray-600">{error}</p>
            </div>
          )}

          {d && !isLoading && (
            /* ------------- PRINTABLE CARD -------------- */
            <div
              ref={cardRef}
              style={{ fontFamily: "'Segoe UI', Arial, sans-serif", background: "#fff", padding: "28px" }}
            >
              {/* Card header */}
              <div style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)", borderRadius: 16, padding: "20px 24px", marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: 600, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: 1 }}>
                      রিপোর্ট কার্ড
                    </p>
                    <h1 style={{ color: "#fff", fontSize: 20, fontWeight: 800, margin: 0 }}>{d.student?.fullName}</h1>
                    <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, margin: "4px 0 0" }}>
                      রোল: {d.student?.rollNumber} · কোড: {d.student?.studentCode}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{
                      display: "inline-block",
                      background: isPassed ? "#10b981" : "#ef4444",
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: 13,
                      padding: "6px 14px",
                      borderRadius: 20,
                    }}>
                      {isPassed ? "উত্তীর্ণ" : "অনুত্তীর্ণ"}
                    </div>
                    <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, margin: "8px 0 0" }}>
                      Overall GPA: {d.overallResult?.averageGPA?.toFixed(2) ?? "—"}
                    </p>
                  </div>
                </div>
                <div style={{
                  marginTop: 12,
                  paddingTop: 12,
                  borderTop: "1px solid rgba(255,255,255,0.2)",
                  display: "flex",
                  gap: 20
                }}>
                  <p style={{
                    color: "rgba(255,255,255,0.7)",
                    fontSize: 11,
                    margin: 0
                  }}>
                    পরীক্ষা: <span style={{
                      color: "#fff",
                      fontWeight: 700
                    }}>{d.exam?.name}</span>
                  </p>
                  <p style={{
                    color: "rgba(255,255,255,0.7)",
                    fontSize: 11,
                    margin: 0
                  }}>
                    শ্রেণী: <span style={{ color: "#fff", fontWeight: 700 }}>{d.exam?.class} — সেকশন {d.exam?.section}</span>
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, margin: 0 }}>
                    {EXAM_TYPE_BN[d.exam?.type] ?? d.exam?.type}
                  </p>
                </div>
              </div>

              {/* Subjects table */}
              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
                <thead>
                  <tr style={{ background: "#f9fafb" }}>
                    {["বিষয়", "কোড", "প্রাপ্ত", "মোট", "%", "গ্রেড", "মন্তব্য"].map((h, i) => (
                      <th key={i} style={{
                        padding: "10px 12px",
                        textAlign: "left",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#6b7280",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        borderBottom: "2px solid #e5e7eb"
                      }}>

                        {h}

                      </th>
                    ))}

                  </tr>
                </thead>
                <tbody>
                  {d.subjectResults?.map((sr, i) => {
                    const gc = GRADE_COLORS[sr.grade] ?? { bg: "#f9fafb", text: "#374151", border: "#e5e7eb" };
                    return (
                      <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                        <td style={{ padding: "10px 12px", fontSize: 13, fontWeight: 600, color: "#1f2937" }}>
                          {sr.subject}
                        </td>
                        <td style={{ padding: "10px 12px", fontSize: 11, fontFamily: "monospace", color: "#6b7280" }}>
                          {sr.subjectCode}
                        </td>
                        <td style={{ padding: "10px 12px", fontSize: 14, fontWeight: 800, color: "#1f2937" }}>
                          {sr.marksObtained}
                        </td>
                        <td style={{ padding: "10px 12px", fontSize: 12, color: "#6b7280" }}>
                          {sr.totalMarks}
                        </td>
                        <td style={{ padding: "10px 12px", fontSize: 12, fontWeight: 600, color: "#1f2937" }}>
                          {sr.percentage}%
                        </td>
                        
                        <td style={{ padding: "10px 12px" }}>
                          <span style={{
                            display: "inline-block",
                            padding: "2px 10px",
                            borderRadius: 20,
                            fontSize: 11,
                            fontWeight: 800,
                            background: gc.bg,
                            color: gc.text,
                            border: `1px solid ${gc.border}`
                          }}>

                            {sr.grade}
                          </span>
                        </td>
                        <td style={{ padding: "10px 12px", fontSize: 11, color: "#9ca3af" }}>
                          {sr.remarks || "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Summary row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
                {[
                  { label: "সার্বিক গ্রেড", value: d.overallResult?.overallGrade ?? "—", color: "#7c3aed" },
                  { label: "গড় GPA", value: d.overallResult?.averageGPA?.toFixed(2) ?? "—", color: "#2563eb" },
                  { label: "ফলাফল", value: isPassed ? "উত্তীর্ণ" : "অনুত্তীর্ণ", color: isPassed ? "#059669" : "#dc2626" },
                  { label: "ফেল বিষয়", value: d.overallResult?.failedSubjects?.length ?? "Absent", color: "#dc2626" },
                ].map((item, i) => (
                  <div key={i} style={{
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: 12,
                    padding: "14px 16px",
                    textAlign: "center"
                  }}>
                    <p style={{
                      fontSize: 10,
                      color: "#9ca3af",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      margin: "0 0 6px"
                    }}>
                      {item.label}
                    </p>
                    <p style={{ fontSize: 20, fontWeight: 800, color: item.color, margin: 0 }}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Failed subjects */}
              {d.overallResult?.failedSubjects?.length > 0 && (
                <div style={{
                  background: "#fee2e2",
                  border: "1px solid #fca5a5",
                  borderRadius: 12,
                  padding: "12px 16px",
                  marginBottom: 20
                }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#7f1d1d", margin: "0 0 4px" }}>
                    অকৃতকার্য বিষয়সমূহ
                  </p>
                  <p style={{ fontSize: 12, color: "#991b1b", margin: 0 }}>
                    {d.overallResult.failedSubjects.join(" · ")}
                  </p>
                </div>
              )}

              {/* Footer */}
              <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <p style={{ fontSize: 10, color: "#9ca3af", margin: 0 }}>
                  মুদ্রণের তারিখ: {new Date().toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" })}
                </p>
                <div style={{ textAlign: "center" }}>
                  <div style={{ height: 40, borderBottom: "1px solid #374151", width: 120, marginBottom: 4 }} />
                  <p style={{ fontSize: 10, color: "#6b7280", margin: 0 }}>
                    কর্তৃপক্ষের স্বাক্ষর
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReportCardModal;