"use client";
import React, { useMemo, useState } from "react";
import { demoData } from "../../data/mockData";


const StudentsStats = () => {
  const [selectedClass, setSelectedClass] = useState("All");
  const [selectedSection, setSelectedSection] = useState("All");
  const [selectedShift, setSelectedShift] = useState("All");

  const filteredData = useMemo(() => {
    return demoData.filter((item) => {
      if (selectedClass !== "All" && item.class !== selectedClass) return false;
      if (selectedSection !== "All" && item.section !== selectedSection) return false;
      if (selectedShift !== "All" && item.shift !== selectedShift) return false;

      return true;
    });
  }, [selectedClass, selectedSection, selectedShift]);

  return (
    <section>
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <span className="text-primary-600 font-bold tracking-widest uppercase text-sm block mb-2">
            শিক্ষার্থী পরিসংখ্যান
          </span>
          <h3 className="text-4xl font-black text-slate-800">
            শ্রেণি ও বিভাগভিত্তিক শিক্ষার্থী তথ্য
          </h3>
        </div>

        {/* ---------------- Filters ---------------- */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 mb-8 flex justify-center flex-col md:flex-row gap-4">
          <select
            className="border border-slate-200 rounded-xl px-4 py-2"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="All">সব ক্লাস</option>
            <option value="Nine">Nine</option>
            <option value="Ten">Ten</option>
          </select>

          <select
            className="border border-slate-200 rounded-xl px-4 py-2"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
          >
            <option value="All">সব সেকশন</option>
            <option value="A">A</option>
            <option value="B">B</option>
          </select>

          <select
            className="border border-slate-200 rounded-xl px-4 py-2"
            value={selectedShift}
            onChange={(e) => setSelectedShift(e.target.value)}
          >
            <option value="All">সব শিফট</option>
            <option value="Morning">Morning</option>
            <option value="Day">Day</option>
          </select>
        </div>

        {/* ---------------- Table ---------------- */}
        <div className="overflow-x-auto bg-white rounded-xl border border-slate-100 shadow-sm">
          <table className="min-w-full text-sm text-center">
            <thead className="bg-primary-700 text-white">
              <tr>
                <th className="p-4">ক্লাস</th>
                <th className="p-4">শিফট</th>
                <th className="p-4">সেকশন</th>
                <th className="p-4">বিভাগ</th>
                <th className="p-4">ছাত্র</th>
                <th className="p-4">ছাত্রী</th>
                <th className="p-4">মুসলিম</th>
                <th className="p-4">হিন্দু</th>
                <th className="p-4">বৌদ্ধ</th>
                <th className="p-4">খ্রিষ্টান</th>
                <th className="p-4">প্রতিবন্ধী</th>
                <th className="p-4">সর্বমোট</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.map((row, idx) => {
                const total = row.male + row.female;

                return (
                  <tr
                    key={idx}
                    className="border-b border-slate-200 hover:bg-primary-50 transition-colors"
                  >
                    <td className="p-3 font-bold">{row.class}</td>
                    <td className="p-3">{row.shift}</td>
                    <td className="p-3">{row.section}</td>
                    <td className="p-3">{row.department}</td>
                    <td className="p-3">{row.male}</td>
                    <td className="p-3">{row.female}</td>
                    <td className="p-3">{row.muslim}</td>
                    <td className="p-3">{row.hindu}</td>
                    <td className="p-3">{row.buddhist}</td>
                    <td className="p-3">{row.christian}</td>
                    <td className="p-3">{row.disabled}</td>
                    <td className="p-3 font-black text-primary-700">
                      {total}
                    </td>
                  </tr>
                );
              })}

              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="12" className="p-6 text-slate-500">
                    কোনো তথ্য পাওয়া যায়নি
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-center text-slate-500 italic">
          তথ্যসূত্র: বিদ্যালয় রেকর্ড (ডেমো ডাটা)
        </p>
      </div>
    </section>
  );
};

export default StudentsStats;
