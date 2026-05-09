"use client";
import { useEffect, useState } from "react";
import {
  X, User, Mail, Phone, MapPin, Calendar,
  Droplets, BookOpen, Building2, ShieldCheck,
  Hash, AlertCircle, GraduationCap,
  Briefcase
} from "lucide-react";
import axiosInstance from "@/src/lib/axiosInstance";


const GENDER_LABEL = { MALE: "পুরুষ", FEMALE: "মহিলা", OTHER: "অন্যান্য" };
const SHIFT_LABEL = { MORNING: "সকাল", DAY: "দিন", EVENING: "বিকাল" };
const ACTIVE_LABEL = { ACTIVE: "এক্টিভ", INACTIVE: "ইনএক্টিভ", SUSPENDED: "সাসপেন্ড" };

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" });
};

const InfoRow = ({ icon: Icon, label, value, accent = "text-gray-400" }) => (
  <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
    <div className={`mt-0.5 shrink-0 ${accent}`}><Icon size={14} /></div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-800 break-words">{value || "—"}</p>
    </div>
  </div>
);

const SectionCard = ({ title, icon: Icon, colorClass, children }) => (
  <div className="bg-gray-50 rounded-2xl overflow-hidden">
    <div className={`flex items-center gap-2 px-4 py-3 ${colorClass}`}>
      <Icon size={14} /><h3 className="text-xs font-bold uppercase tracking-wider">{title}</h3>
    </div>
    <div className="px-4 pb-2">{children}</div>
  </div>
);

const Skeleton = () => (
  <div className="animate-pulse p-6 space-y-4">
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl shrink-0" />
      <div className="space-y-2 flex-1">
        <div className="h-5 bg-gray-100 rounded-lg w-40" />
        <div className="h-3 bg-gray-100 rounded-lg w-28" />
        <div className="flex gap-2">
          <div className="h-6 w-20 bg-gray-100 rounded-full" />
          <div className="h-6 w-16 bg-gray-100 rounded-full" />
        </div>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-gray-50 rounded-2xl p-4 space-y-2">
          <div className="h-3 bg-gray-100 rounded w-20" />
          {[1, 2, 3].map((j) => <div key={j} className="h-3 bg-gray-100 rounded w-full" />)}
        </div>
      ))}
    </div>
  </div>
);

const ViewStudentModal = ({ isOpen, onClose, studentId }) => {
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !studentId) return;
    setIsLoading(true); setError(null); setStudent(null);
    axiosInstance.get(`/students/${studentId}`)
      .then((res) => setStudent(res.data?.data))
      .catch(() => setError("শিক্ষার্থীর তথ্য লোড করতে ব্যর্থ হয়েছে।"))
      .finally(() => setIsLoading(false));
  }, [isOpen, studentId]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const initials = student?.fullNameEnglish?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "S";
  const enrollment = student?.currentEnrollment;
  const guardian = student?.guardians;
  // console.log(guardian;
  const isActive = student?.user?.isActive === "ACTIVE";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-lg font-bold text-gray-900">শিক্ষার্থীর বিস্তারিত তথ্য</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading && <Skeleton />}

          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-3">
                <AlertCircle size={22} className="text-red-400" />
              </div>
              <p className="text-sm font-medium text-gray-700">{error}</p>
            </div>
          )}

          {student && !isLoading && (
            <div className="p-6 space-y-4">

              {/* Profile header */}
              <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-xl shrink-0">
                  {
                    student.profilePhotoUrl
                      ? <img src={student.profilePhotoUrl} alt={student.fullNameEnglish} className="w-full h-full object-cover rounded-lg" />
                      : initials
                  }
                  {/* {initials} */}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900">{student.fullNameEnglish}</h3>
                  <p className="text-sm text-gray-400 mt-0.5">{student.fullNameBangla}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs font-mono font-semibold px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">
                      {student.studentCode}
                    </span>
                    <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${isActive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-red-500"}`} />
                      {ACTIVE_LABEL[student.user?.isActive] || student.user?.isActive}
                    </span>
                    {enrollment && (
                      <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-violet-100 text-violet-700 rounded-full">
                        <GraduationCap size={11} />
                        {enrollment.section?.class?.name} — সেকশন {enrollment.section?.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <SectionCard title="ব্যক্তিগত তথ্য" icon={User} colorClass="text-blue-600 bg-blue-50">
                  <InfoRow icon={Calendar} label="জন্ম তারিখ" value={formatDate(student.dateOfBirth)} accent="text-blue-400" />
                  <InfoRow icon={User} label="লিঙ্গ" value={GENDER_LABEL[student.gender]} accent="text-blue-400" />
                  <InfoRow icon={Droplets} label="রক্তের গ্রুপ" value={student.bloodGroup?.replace("_", " ")} accent="text-blue-400" />
                  <InfoRow icon={MapPin} label="ঠিকানা" value={student.address} accent="text-blue-400" />
                </SectionCard>

                <SectionCard title="যোগাযোগ ও অ্যাকাউন্ট" icon={Phone} colorClass="text-emerald-600 bg-emerald-50">
                  <InfoRow icon={Phone} label="মোবাইল" value={student.phone} accent="text-emerald-400" />
                  <InfoRow icon={Mail} label="ইমেইল" value={student.user?.email} accent="text-emerald-400" />
                  <InfoRow icon={User} label="ইউজারনেম" value={student.user?.username} accent="text-emerald-400" />
                  <InfoRow icon={Building2} label="প্রতিষ্ঠান" value={student.institution?.name} accent="text-emerald-400" />
                </SectionCard>

                {/* Enrollment card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:col-span-2">
                  {/* Enrollment card */}
                  <SectionCard title="বর্তমান ভর্তির তথ্য" icon={GraduationCap} colorClass="text-violet-600 bg-violet-50">
                    {enrollment ? (
                      <div className="grid grid-cols-2 gap-x-4">
                        <InfoRow icon={BookOpen} label="ক্লাস" value={enrollment.section?.class?.name} accent="text-violet-400" />
                        <InfoRow icon={Hash} label="সেকশন" value={`সেকশন ${enrollment.section?.name}`} accent="text-violet-400" />
                        <InfoRow icon={Calendar} label="শিফট" value={SHIFT_LABEL[enrollment.section?.shift]} accent="text-violet-400" />
                        <InfoRow icon={Hash} label="রোল নম্বর" value={enrollment.rollNumber} accent="text-violet-400" />
                        <InfoRow icon={Calendar} label="শিক্ষাবর্ষ" value={String(enrollment.academicYear)} accent="text-violet-400" />
                        <InfoRow icon={ShieldCheck} label="স্ট্যাটাস" value={enrollment.status} accent="text-violet-400" />
                      </div>
                    ) : (
                      <div className="py-4 text-center text-sm text-gray-400 italic">
                        এই শিক্ষার্থী এখনো কোনো সেকশনে ভর্তি হয়নি।
                      </div>
                    )}
                  </SectionCard>
                  {/* Guardian card */}
                  <SectionCard
                    title="অভিভাবকের তথ্য"
                    icon={User}
                    colorClass="text-amber-600 bg-amber-50"
                  >
                    {student.guardians?.map((guardian) => (
                      <div key={guardian.id} className="mb-4 last:mb-0">
                        {/* Guardian Name & Relation */}
                        <InfoRow
                          icon={User}
                          label={`${guardian.relationship === 'FATHER' ? 'পিতা' : guardian.relationship === 'MOTHER' ? 'মা' : 'অভিভাবক'}${guardian.isPrimary ? ' - ☆ (Primary Guardian)' : ''}`}
                          value={`${guardian.fullNameEnglish} (${guardian.fullNameBangla})`}
                          accent="text-amber-400"
                        />

                        {/* Phone */}
                        <InfoRow
                          icon={Phone}
                          label="মোবাইল"
                          value={guardian.phone}
                          accent="text-amber-400"
                        />

                        {/* Email */}
                        <InfoRow
                          icon={Mail}
                          label="ইমেইল"
                          value={guardian.email || "N/A"}
                          accent="text-amber-400"
                        />

                        {/* Occupation */}
                        <InfoRow
                          icon={Briefcase}
                          label="পেশা"
                          value={guardian.occupation}
                          accent="text-amber-400"
                        />

                        {/* Divider if there are multiple guardians */}
                        {student.guardians.length > 1 && <hr className="my-2 border-amber-100" />}
                      </div>
                    ))}
                  </SectionCard>


                </div>


              </div>
            </div>
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
  );
}


export default ViewStudentModal;