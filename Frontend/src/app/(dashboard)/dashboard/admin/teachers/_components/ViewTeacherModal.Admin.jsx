"use client";
import { useEffect, useState } from "react";
import {
  X, User, Mail, Phone, MapPin, Briefcase, GraduationCap,
  Calendar, CreditCard, Building2, ShieldCheck, Hash,
  Droplets, BookOpen, BadgeCheck, Loader2, AlertCircle,
} from "lucide-react";
import axiosInstance from "../../../../../../lib/axiosInstance";

// -------------------- HELPERS --------------------
const GENDER_LABEL = { MALE: "পুরুষ", FEMALE: "মহিলা", OTHER: "অন্যান্য" };
const BLOOD_LABEL = (b) => b?.replace("_", " ") || "—";
const ACTIVE_LABEL = { ACTIVE: "সক্রিয়", INACTIVE: "নিষ্ক্রিয়" };

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("bn-BD", {
    year: "numeric", month: "long", day: "numeric",
  });
};

const formatSalary = (n) =>
  n ? "৳ " + Number(n).toLocaleString("en-BD") : "—";

// -------------------- SMALL COMPONENTS --------------------
const InfoRow = ({ icon: Icon, label, value, accent = "text-gray-400" }) => (
  <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
    <div className={`mt-0.5 shrink-0 ${accent}`}>
      <Icon size={15} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-800 break-words">{value || "—"}</p>
    </div>
  </div>
);

const SectionCard = ({ title, icon: Icon, colorClass, children }) => (
  <div className="bg-gray-50 rounded-2xl overflow-hidden">
    <div className={`flex items-center gap-2 px-4 py-3 ${colorClass}`}>
      <Icon size={15} />
      <h3 className="text-xs font-bold uppercase tracking-wider">{title}</h3>
    </div>
    <div className="px-4 pb-2">{children}</div>
  </div>
);

// -------------------- SKELETON --------------------
const Skeleton = () => (
  <div className="animate-pulse space-y-4 p-6">
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 shrink-0" />
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


const ViewTeacherModal = ({ isOpen, onClose, teacherId }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !teacherId) return;
    const fetchTeacher = async () => {
      setIsLoading(true);
      setError(null);
      setProfile(null);
      try {
        const res = await axiosInstance.get(`/teachers/${teacherId}`);
        setProfile(res.data?.data);
      } catch {
        setError("শিক্ষকের তথ্য লোড করতে ব্যর্থ হয়েছে।");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeacher();
  }, [isOpen, teacherId]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const initials = profile?.fullNameEnglish
    ?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "T";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-lg font-bold text-gray-900">শিক্ষকের বিস্তারিত তথ্য</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto">

          {isLoading && <Skeleton />}

          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-3">
                <AlertCircle size={22} className="text-red-400" />
              </div>
              <p className="text-sm font-medium text-gray-700 mb-3">{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-sm text-violet-600 hover:underline font-semibold"
              >
                আবার চেষ্টা করুন
              </button>
            </div>
          )}

          {profile && !isLoading && (
            <div className="p-6 space-y-4">

              {/* ── Profile header ── */}
              <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xl shrink-0">
                  {
                    profile.profilePhotoUrl
                      ? <img src={profile.profilePhotoUrl} alt={profile.fullNameEnglish} className="w-full h-full object-cover rounded-lg" />
                      : initials
                  }
                  
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">
                    {profile.fullNameEnglish}
                  </h3>
                  <p className="text-sm text-gray-400 mt-0.5">{profile.fullNameBangla}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                      <BadgeCheck size={11} /> {profile.designation}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {profile.department}
                    </span>
                    <span className="text-xs font-mono font-semibold px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">
                      {profile.teacherCode}
                    </span>
                    <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${profile.user?.isActive === "ACTIVE"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-red-50 text-red-600"
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${profile.user?.isActive === "ACTIVE" ? "bg-emerald-500" : "bg-red-500"
                        }`} />
                      {ACTIVE_LABEL[profile.user?.isActive] || profile.user?.isActive}
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Info grid ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <SectionCard title="ব্যক্তিগত তথ্য" icon={User} colorClass="text-blue-600 bg-blue-50">
                  <InfoRow icon={Calendar} label="জন্ম তারিখ" value={formatDate(profile.dateOfBirth)} accent="text-blue-400" />
                  <InfoRow icon={User} label="লিঙ্গ" value={GENDER_LABEL[profile.gender]} accent="text-blue-400" />
                  <InfoRow icon={Droplets} label="রক্তের গ্রুপ" value={BLOOD_LABEL(profile.bloodGroup)} accent="text-blue-400" />
                  <InfoRow icon={Hash} label="NID" value={profile.nid} accent="text-blue-400" />
                  <InfoRow icon={MapPin} label="ঠিকানা" value={profile.address} accent="text-blue-400" />
                </SectionCard>

                <SectionCard title="যোগাযোগ" icon={Phone} colorClass="text-emerald-600 bg-emerald-50">
                  <InfoRow icon={Phone} label="মোবাইল" value={profile.phone} accent="text-emerald-400" />
                  <InfoRow icon={Mail} label="ব্যক্তিগত ইমেইল" value={profile.email} accent="text-emerald-400" />
                  <InfoRow icon={Mail} label="লগইন ইমেইল" value={profile.user?.email} accent="text-emerald-400" />
                  <InfoRow icon={User} label="ইউজারনেম" value={profile.user?.username} accent="text-emerald-400" />
                </SectionCard>

                <SectionCard title="পেশাগত তথ্য" icon={Briefcase} colorClass="text-violet-600 bg-violet-50">
                  <InfoRow icon={BookOpen} label="বিষয়" value={profile.subject} accent="text-violet-400" />
                  <InfoRow icon={GraduationCap} label="শিক্ষাগত যোগ্যতা" value={profile.qualification} accent="text-violet-400" />
                  <InfoRow icon={Calendar} label="যোগদানের তারিখ" value={formatDate(profile.joiningDate)} accent="text-violet-400" />
                </SectionCard>

                <SectionCard title="আর্থিক ও প্রতিষ্ঠান" icon={CreditCard} colorClass="text-amber-600 bg-amber-50">
                  <InfoRow icon={CreditCard} label="মাসিক বেতন" value={formatSalary(profile.salary)} accent="text-amber-400" />
                  <InfoRow icon={Building2} label="প্রতিষ্ঠান" value={profile.institution?.name} accent="text-amber-400" />
                  <InfoRow icon={ShieldCheck} label="ভূমিকা" value={profile.roles?.map((r) => r.name).join(", ")} accent="text-amber-400" />
                  <InfoRow icon={Calendar} label="যোগ করা হয়েছে" value={formatDate(profile.createdAt)} accent="text-amber-400" />
                </SectionCard>

              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex justify-end px-6 py-4 border-t border-gray-100 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
}

export default ViewTeacherModal;