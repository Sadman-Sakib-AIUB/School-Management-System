"use client";

import { useEffect, useState, useRef } from "react";
import {
  User, Mail, Phone, MapPin, Briefcase, GraduationCap,
  Calendar, CreditCard, Building2, ShieldCheck, Hash,
  Droplets, BookOpen, BadgeCheck, AlertCircle,
  Camera, Loader2, CheckCircle2, X, BookMarked,
} from "lucide-react";

import ProfileSkeleton from "./ProfileSkeleton";
import InfoRow from "@/src/app/components/dashboard/InfoRow";
import SectionCard from "@/src/app/components/dashboard/SectionCard";
import axiosInstance from "@/src/lib/axiosInstance";
import AssignedSubjectsCard from "../my-classes/_components/AssignedSubjectsCard";
import ProfilePhoto from "@/src/app/components/dashboard/Shared/ProfilePhoto";

// ----- helpers ----
const GENDER_LABEL = { MALE: "পুরুষ", FEMALE: "মহিলা", OTHER: "অন্যান্য" };
const BLOOD_LABEL = (b) => b?.replace("_", " ") || "—";
const ACTIVE_LABEL = { ACTIVE: "এক্টিভ", INACTIVE: "ইনএক্টিভ" };


const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" }) : "—";

const formatSalary = (n) =>
  n ? "৳ " + Number(n).toLocaleString("bn-BD") : "—";


const TeacherProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get("/teachers/me");
        setProfile(res.data?.data);
      } catch {
        setError("প্রোফাইল লোড করতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handlePhotoUploadSuccess = (newUrl) => {
    setProfile((prev) => prev ? { ...prev, profilePhotoUrl: newUrl } : prev);
  };

  if (isLoading) return <ProfileSkeleton />;

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-64 text-center">
      <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
        <AlertCircle size={24} className="text-red-400" />
      </div>
      <p className="text-sm font-medium text-gray-700 mb-3">{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="text-sm text-violet-600 hover:underline font-semibold"
      >
        আবার চেষ্টা করুন
      </button>
    </div>
  );

  if (!profile) return <h1>No Profile get from server</h1>;

  const initials = profile.fullNameEnglish
    ?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "T";

  return (
    <div className="space-y-6 mx-auto max-w-5xl">

      {/* ── Profile Header Card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        <div className="h-2 bg-linear-to-r from-violet-400 to-violet-600" />

        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">

            {/* Avatar with upload */}
            <ProfilePhoto
              photoUrl={profile.profilePhotoUrl}
              initials={initials}
              onUploadSuccess={handlePhotoUploadSuccess}
            />

            {/* Name + badges */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                {profile.fullNameEnglish}
              </h1>
              <p className="text-base text-gray-500 mt-0.5">{profile.fullNameBangla}</p>

              {/* upload hint */}
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <Camera size={11} />
                ছবিতে ক্লিক করে প্রোফাইল ফটো পরিবর্তন করুন
              </p>

              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full">
                  <BadgeCheck size={13} />
                  {profile.designation}
                </span>
                <span className="text-xs font-semibold px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full">
                  {profile.department}
                </span>
                <span className="text-xs font-semibold px-3 py-1.5 bg-violet-100 text-violet-700 rounded-full font-mono">
                  {profile.teacherCode}
                </span>
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 ${profile.user?.isActive === "ACTIVE"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-600"
                  }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${profile.user?.isActive === "ACTIVE" ? "bg-emerald-500" : "bg-red-500"
                    }`} />
                  {ACTIVE_LABEL[profile.user?.isActive] || profile.user?.isActive}
                </span>
              </div>
            </div>

            {/* Institution */}
            <div className="hidden sm:flex flex-col items-end text-right shrink-0">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Building2 size={14} />
                <span className="text-sm font-medium">{profile.institution?.name}</span>
              </div>
              <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                {profile.institution?.code}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Info Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Personal Info */}
        <SectionCard title="ব্যক্তিগত তথ্য" icon={User} color="text-blue-600">
          <InfoRow icon={Calendar} label="জন্ম তারিখ" value={formatDate(profile.dateOfBirth)} accent="text-blue-400" />
          <InfoRow icon={User} label="লিঙ্গ" value={GENDER_LABEL[profile.gender]} accent="text-blue-400" />
          <InfoRow icon={Droplets} label="রক্তের গ্রুপ" value={BLOOD_LABEL(profile.bloodGroup)} accent="text-blue-400" />
          <InfoRow icon={Hash} label="জাতীয় পরিচয়পত্র" value={profile.nid} accent="text-blue-400" />
          <InfoRow icon={MapPin} label="ঠিকানা" value={profile.address} accent="text-blue-400" />
        </SectionCard>

        {/* Contact Info */}
        <SectionCard title="যোগাযোগের তথ্য" icon={Phone} color="text-emerald-600">
          <InfoRow icon={Phone} label="মোবাইল নম্বর" value={profile.phone} accent="text-emerald-400" />
          <InfoRow icon={Mail} label="ব্যক্তিগত ইমেইল" value={profile.email} accent="text-emerald-400" />
          <InfoRow icon={Mail} label="লগইন ইমেইল" value={profile.user?.email} accent="text-emerald-400" />
          <InfoRow icon={User} label="ইউজারনেম" value={profile.user?.username} accent="text-emerald-400" />
        </SectionCard>

        {/* Professional Info */}
        <SectionCard title="পেশাগত তথ্য" icon={Briefcase} color="text-violet-600">
          <InfoRow icon={Briefcase} label="পদবি" value={profile.designation} accent="text-violet-400" />
          <InfoRow icon={Building2} label="বিভাগ" value={profile.department} accent="text-violet-400" />
          <InfoRow icon={BookOpen} label="বিষয়" value={profile.subject} accent="text-violet-400" />
          <InfoRow icon={GraduationCap} label="শিক্ষাগত যোগ্যতা" value={profile.qualification} accent="text-violet-400" />
          <InfoRow icon={Calendar} label="যোগদানের তারিখ" value={formatDate(profile.joiningDate)} accent="text-violet-400" />
        </SectionCard>

        {/* Account & Financial */}
        <SectionCard title="অ্যাকাউন্ট ও আর্থিক তথ্য" icon={ShieldCheck} color="text-amber-600">
          <InfoRow icon={ShieldCheck} label="ভূমিকা" value={profile.roles?.map((r) => r.name).join(", ")} accent="text-amber-400" />
          <InfoRow icon={Building2} label="প্রতিষ্ঠান" value={profile.institution?.name} accent="text-amber-400" />
          <InfoRow icon={Hash} label="প্রতিষ্ঠান কোড" value={profile.institution?.code} accent="text-amber-400" />
          <InfoRow icon={CreditCard} label="মাসিক বেতন" value={formatSalary(profile.salary)} accent="text-amber-400" />
          <InfoRow icon={Calendar} label="নিবন্ধনের তারিখ" value={formatDate(profile.createdAt)} accent="text-amber-400" />
        </SectionCard>

        

      </div>
    </div>
  );
};

export default TeacherProfilePage;