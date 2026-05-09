import React, { useState } from "react";

const demoResults = [
  {
    exam: "SSC",
    roll: "123456",
    reg: "2023123456",
    year: "2024",
    name: "সাদমান হোসাইন",
    group: "বিজ্ঞান",
    gpa: "5.00",
    status: "পাস",
    subjects: [
      { name: "বাংলা", mark: 85, grade: "A" },
      { name: "ইংরেজি", mark: 78, grade: "A-" },
      { name: "গণিত", mark: 95, grade: "A+" },
      { name: "পদার্থবিজ্ঞান", mark: 88, grade: "A" },
      { name: "রসায়ন", mark: 90, grade: "A+" },
    ],
  },
  {
    exam: "HSC",
    roll: "654321",
    reg: "2022987654",
    year: "2023",
    name: "রাফি ইসলাম",
    group: "ব্যবসায় শিক্ষা",
    gpa: "4.50",
    status: "পাস",
    subjects: [
      { name: "বাংলা", mark: 72, grade: "A-" },
      { name: "ইংরেজি", mark: 70, grade: "A-" },
      { name: "হিসাববিজ্ঞান", mark: 88, grade: "A" },
      { name: "ব্যবসায় সংগঠন", mark: 80, grade: "A" },
    ],
  },
];

const PublicExamResult = () => {
  const [exam, setExam] = useState("SSC");
  const [roll, setRoll] = useState("");
  const [reg, setReg] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = () => {
    const found = demoResults.find(
      (r) => r.exam === exam && r.roll === roll && r.reg === reg
    );

    if (found) {
      setResult(found);
      setError("");
    } else {
      setResult(null);
      setError("ফলাফল পাওয়া যায়নি। তথ্য যাচাই করুন।");
    }
  };

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-4xl font-black text-slate-800 mb-10 text-center">
          পাবলিক পরীক্ষার ফলাফল
        </h2>

        {/* Search Box */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <select
              value={exam}
              onChange={(e) => setExam(e.target.value)}
              className="border rounded-xl px-4 py-3 font-semibold"
            >
              <option value="JSC">JSC</option>
              <option value="SSC">SSC</option>
              <option value="HSC">HSC</option>
            </select>

            <input
              type="text"
              placeholder="রোল নম্বর"
              value={roll}
              onChange={(e) => setRoll(e.target.value)}
              className="border rounded-xl px-4 py-3"
            />

            <input
              type="text"
              placeholder="রেজিস্ট্রেশন নম্বর"
              value={reg}
              onChange={(e) => setReg(e.target.value)}
              className="border rounded-xl px-4 py-3"
            />
          </div>

          <button
            onClick={handleSearch}
            className="mt-6 w-full bg-emerald-600 text-white py-3 rounded-2xl font-bold hover:bg-emerald-700 transition"
          >
            ফলাফল দেখুন
          </button>

          {error && (
            <p className="text-red-600 text-center mt-4 font-semibold">
              {error}
            </p>
          )}
        </div>

        {/* Result Card */}
        {result && (
          <div className="bg-white p-8 rounded-3xl border border-slate-100">
            <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
              <div>
                <h3 className="text-2xl font-black text-slate-800">
                  {result.name}
                </h3>
                <p className="text-slate-600">
                  পরীক্ষা: {result.exam} | গ্রুপ: {result.group}
                </p>
                <p className="text-slate-600">
                  রোল: {result.roll} | রেজি: {result.reg}
                </p>
              </div>

              <div className="text-right">
                <div className="text-4xl font-black text-emerald-700">
                  GPA {result.gpa}
                </div>
                <div
                  className={`inline-block mt-2 px-4 py-1 rounded-full text-sm font-bold ${
                    result.status === "পাস"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {result.status}
                </div>
              </div>
            </div>

            {/* Subject Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700">
                    <th className="p-3 text-left">বিষয়</th>
                    <th className="p-3 text-center">নম্বর</th>
                    <th className="p-3 text-center">গ্রেড</th>
                  </tr>
                </thead>
                <tbody>
                  {result.subjects.map((sub, idx) => (
                    <tr
                      key={idx}
                      className="border-b hover:bg-slate-50"
                    >
                      <td className="p-3">{sub.name}</td>
                      <td className="p-3 text-center">{sub.mark}</td>
                      <td className="p-3 text-center font-bold">
                        {sub.grade}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PublicExamResult;
