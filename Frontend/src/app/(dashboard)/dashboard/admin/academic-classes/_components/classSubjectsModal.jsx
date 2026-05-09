"use client";
import { useState, useEffect, useCallback } from "react";
import {
  X, BookOpen, Plus, AlertCircle,
} from "lucide-react";

import axiosInstance from "@/src/lib/axiosInstance";
import AssignTeacherModal from "./AssignTeacherModal";
import SubjectCard from "./SubjectCard";
import AddSubjectForm from "./AddSubjectForm";


export const inputCls = (err) =>
  `w-full px-3 py-2.5 text-sm rounded-xl border bg-gray-50 outline-none transition-all
   focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-transparent ${err ? "border-red-300 bg-red-50" : "border-gray-200"
  }`;

const ClassSubjectsModal = ({ isOpen, onClose, cls }) => {
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [assignTeacherFor, setAssignTeacherFor] = useState(null);

  const fetchSubjects = useCallback(async () => {
    if (!cls?.id) return;
    setIsLoading(true); 
    setError(null);
    try {
      const res = await axiosInstance.get(`/academic-classes/${cls.id}/subjects`);
      // console.log(res);
      const raw = res.data.data.subjects ?? res.data ?? [];
      // console.log(raw);
      setSubjects(Array.isArray(raw) ? raw : []);
    } catch {
      setError("বিষয়গুলো লোড করতে ব্যর্থ হয়েছে।");
    } finally {
      setIsLoading(false);
    }
  }, [cls?.id]);

  useEffect(() => {
    if (isOpen && cls?.id) {
      fetchSubjects();
      setShowAddForm(false);
    }
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen, cls?.id, fetchSubjects]);

  if (!isOpen || !cls) return null;

  const handleAddSuccess = () => {
    setShowAddForm(false);
    fetchSubjects();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">
        <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center">
                <BookOpen size={17} className="text-violet-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">বিষয় তালিকা</h2>
                <p className="text-xs text-gray-400 mt-0.5">{cls.name} · {cls.academicYear}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!showAddForm && (
                <button onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-violet-600 rounded-xl hover:bg-violet-700 active:scale-95 shadow-md shadow-violet-200">
                  <Plus size={15} /> বিষয় যোগ
                </button>
              )}
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">

            {/* Add form */}
            {showAddForm && (
              <div className="bg-gray-50 border border-dashed border-violet-200 rounded-2xl p-5">
                <AddSubjectForm
                  cls={cls}
                  onSuccess={handleAddSuccess}
                  onCancel={() => setShowAddForm(false)}
                />
              </div>
            )}

            {/* Loading */}
            {isLoading && !showAddForm && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="h-36 bg-gray-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            )}

            {/* Error */}
            {error && !isLoading && (
              <div className="flex flex-col items-center py-12 text-center">
                <AlertCircle size={24} className="text-red-400 mb-3" />
                <p className="text-sm text-gray-600 mb-3">{error}</p>
                <button onClick={fetchSubjects} className="text-sm text-violet-600 hover:underline font-semibold">
                  আবার চেষ্টা করুন
                </button>
              </div>
            )}

            {/* Empty state */}
            {!isLoading && !error && subjects.length === 0 && !showAddForm && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center mb-4">
                  <BookOpen size={28} className="text-violet-400" />
                </div>
                <p className="font-bold text-gray-700 mb-1">কোনো বিষয় যুক্ত নেই</p>
                <p className="text-sm text-gray-400 mb-5">{cls.name}-এ এখনো কোনো বিষয় নির্ধারিত হয়নি।</p>
                <button onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-violet-600 rounded-xl hover:bg-violet-700 active:scale-95 shadow-lg shadow-violet-200">
                  <Plus size={15} /> প্রথম বিষয় যোগ করুন
                </button>
              </div>
            )}

            {/* Subject cards grid */}
            {!isLoading && !error && subjects.length > 0 && (
              <>
                <div className="flex items-center justify-between px-1">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {subjects.length}টি বিষয় নির্ধারিত
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {subjects.map((item) => (
                    <SubjectCard
                      key={item.id}
                      item={item}
                      onAssignTeacher={setAssignTeacherFor}
                    />
                  ))}
                </div>
              </>
            )}
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

      {/* Assign teacher sub-modal */}
      <AssignTeacherModal
        isOpen={!!assignTeacherFor}
        onClose={() => setAssignTeacherFor(null)}
        onSuccess={() => { setAssignTeacherFor(null); fetchSubjects(); }}
        classSubject={assignTeacherFor}
      />
    </>
  );
}

export default ClassSubjectsModal;