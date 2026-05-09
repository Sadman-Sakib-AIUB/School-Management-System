"use client";

import { useEffect, useState } from "react";
import {
  User, Phone, MapPin, Droplets, Calendar,
  BadgeCheck, Building2, BookOpen, Hash,
  ShieldCheck, Mail, AtSign,
  Camera,
} from "lucide-react";
import axiosInstance from "@/src/lib/axiosInstance";
import ProfilePhoto from "@/src/app/components/dashboard/Shared/ProfilePhoto";


// ----- helpers -----

const GENDER_LABEL = { MALE: "পুরুষ", FEMALE: "মহিলা", OTHER: "অন্যান্য" };

const BLOOD_LABEL = (val) =>
({
  A_POSITIVE: "A+",
  A_NEGATIVE: "A−",
  B_POSITIVE: "B+",
  B_NEGATIVE: "B−",
  AB_POSITIVE: "AB+",
  AB_NEGATIVE: "AB−",
  O_POSITIVE: "O+",
  O_NEGATIVE: "O−"
}[val] || val || "—");

const ACTIVE_LABEL = { ACTIVE: "এক্টিভ", INACTIVE: "ইনএক্টিভ", SUSPENDED: "সাস্পেন্ডেড", BLOCKED: "ব্লকড" };

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" }) : "—";

// ------ skeleton ------

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />;
}

// ------ info row ------

function InfoRow({ icon: Icon, label, value, accent = "text-gray-400" }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <Icon size={15} className={`${accent} shrink-0 mt-0.5`} />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-gray-800 mt-0.5 break-words">{value || "—"}</p>
      </div>
    </div>
  );
}

// ------- section card -------

function SectionCard({ title, icon: Icon, color, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
        <Icon size={16} className={color} />
        <h3 className="text-sm font-bold text-gray-700">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// ------ loading skeleton for section card -------

function SectionCardSkeleton({ rows = 4 }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
        <Skeleton className="w-4 h-4" />
        <Skeleton className="w-28 h-4" />
      </div>
      <div className="space-y-4">
        {Array(rows).fill(0).map((_, i) => (
          <div key={i} className="flex items-start gap-3 py-1">
            <Skeleton className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="w-20 h-3" />
              <Skeleton className="w-40 h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


const StudentProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get("/students/me");
        setProfile(res.data?.data);
      } catch {
        setError("প্রোফাইল তথ্য লোড করতে সমস্যা হয়েছে।");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // derived
  const enrollment = profile?.enrollments?.[0];
  const user = profile?.user;
  const institution = profile?.institution;
  const guardian = profile?.guardianStudents?.[0];

  const initials = profile
    ? (profile.fullNameEnglish || profile.fullNameBangla || "S")
      .split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "—";

  const handlePhotoUploadSuccess = (newUrl) => {
    setProfile((prev) => prev ? { ...prev, profilePhotoUrl: newUrl } : prev);
  };

  return (
    <div className="space-y-6 mx-auto max-w-5xl">

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* ── Profile Header Card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Top accent bar */}
        <div className="h-2 bg-linear-to-r from-violet-400 to-violet-600" />

        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">

            {/* Avatar */}
            {isLoading ? (
              <Skeleton className="w-24 h-24 rounded-2xl shrink-0" />
            ) : (
              <ProfilePhoto
                photoUrl={profile.profilePhotoUrl}
                initials={initials}
                onUploadSuccess={handlePhotoUploadSuccess}
              />
            )}

            {/* Name + badges */}
            <div className="flex-1 min-w-0">
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="w-52 h-7" />
                  <Skeleton className="w-36 h-5" />
                  <div className="flex gap-2 mt-3">
                    <Skeleton className="w-24 h-7 rounded-full" />
                    <Skeleton className="w-24 h-7 rounded-full" />
                    <Skeleton className="w-20 h-7 rounded-full" />
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                    {profile?.fullNameEnglish}
                  </h1>
                  <p className="text-base text-gray-500 mt-0.5">{profile?.fullNameBangla}</p>

                  {/* upload hint */}
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Camera size={11} />
                    ছবিতে ক্লিক করে প্রোফাইল ফটো পরিবর্তন করুন
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    {/* Student code */}
                    <span className="text-xs font-semibold px-3 py-1.5 bg-violet-100 text-violet-700 rounded-full font-mono">
                      {profile?.studentCode}
                    </span>
                    {/* Class + Section */}
                    {enrollment && (
                      <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full">
                        <BookOpen size={12} />
                        {enrollment.section?.class?.name} — সেকশন {enrollment.section?.name}
                      </span>
                    )}
                    {/* Roll */}
                    {enrollment?.rollNumber && (
                      <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full">
                        <Hash size={12} />
                        রোল: {enrollment.rollNumber}
                      </span>
                    )}
                    {/* Status */}
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 ${user?.isActive === "ACTIVE"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-red-50 text-red-600"
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user?.isActive === "ACTIVE" ? "bg-emerald-500" : "bg-red-500"
                        }`} />
                      {ACTIVE_LABEL[user?.isActive] || user?.isActive}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Institution — right side */}
            <div className="hidden sm:flex flex-col items-end text-right shrink-0">
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="w-36 h-4" />
                  <Skeleton className="w-20 h-5 rounded-lg" />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Building2 size={14} />
                    <span className="text-sm font-medium">{institution?.name}</span>
                  </div>
                  <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                    {institution?.code}
                  </span>
                </>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ── Info Grid ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SectionCardSkeleton rows={5} />
          <SectionCardSkeleton rows={4} />
          <SectionCardSkeleton rows={3} />
          <SectionCardSkeleton rows={3} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Personal Info */}
          <SectionCard title="ব্যক্তিগত তথ্য" icon={User} color="text-blue-600">
            <InfoRow icon={Calendar} label="জন্ম তারিখ" value={formatDate(profile?.dateOfBirth)} accent="text-blue-400" />
            <InfoRow icon={User} label="লিঙ্গ" value={GENDER_LABEL[profile?.gender]} accent="text-blue-400" />
            <InfoRow icon={Droplets} label="রক্তের গ্রুপ" value={BLOOD_LABEL(profile?.bloodGroup)} accent="text-blue-400" />
            <InfoRow icon={Phone} label="মোবাইল নম্বর" value={profile?.phone} accent="text-blue-400" />
            <InfoRow icon={MapPin} label="ঠিকানা" value={profile?.address} accent="text-blue-400" />
          </SectionCard>

          {/* Account Info */}
          <SectionCard title="অ্যাকাউন্ট তথ্য" icon={ShieldCheck} color="text-emerald-600">
            <InfoRow icon={AtSign} label="ব্যবহারকারীর নাম" value={user?.username} accent="text-emerald-400" />
            <InfoRow icon={Mail} label="ইমেইল" value={user?.email} accent="text-emerald-400" />
            <InfoRow icon={ShieldCheck} label="ভূমিকা" value={profile?.roles?.map((r) => r.name).join(", ")} accent="text-emerald-400" />
            <InfoRow icon={Calendar} label="নিবন্ধনের তারিখ" value={formatDate(profile?.createdAt)} accent="text-emerald-400" />
          </SectionCard>

          {/* Academic Info */}
          <SectionCard title="একাডেমিক তথ্য" icon={BookOpen} color="text-violet-600">
            <InfoRow icon={BookOpen} label="ক্লাস" value={enrollment?.section?.class?.name} accent="text-violet-400" />
            <InfoRow icon={Hash} label="সেকশন" value={enrollment?.section?.name ? `সেকশন ${enrollment.section.name}` : "—"} accent="text-violet-400" />
            <InfoRow icon={BadgeCheck} label="রোল নম্বর" value={enrollment?.rollNumber} accent="text-violet-400" />
            <InfoRow icon={Calendar} label="শিক্ষাবর্ষ" value={enrollment?.section?.class?.academicYear ? `${enrollment.section.class.academicYear}` : "—"} accent="text-violet-400" />
          </SectionCard>

          {/* Guardian Info */}
          <SectionCard title="অভিভাবক তথ্য" icon={User} color="text-amber-600">
            {!guardian ? (
              <div className="h-28 flex flex-col items-center justify-center text-gray-400 gap-2">
                <User size={28} className="text-gray-200" />
                <p className="text-sm">কোনো অভিভাবক সংযুক্ত নেই</p>
              </div>
            ) : (
              <>
                <InfoRow icon={User} label="অভিভাবকের নাম" value={guardian?.guardian?.fullNameBangla || guardian?.guardian?.fullNameEnglish} accent="text-amber-400" />
                <InfoRow icon={Phone} label="ফোন" value={guardian?.guardian?.phone} accent="text-amber-400" />
                <InfoRow icon={BadgeCheck} label="সম্পর্ক" value={guardian?.relationship} accent="text-amber-400" />
              </>
            )}
          </SectionCard>

        </div>
      )}

    </div>
  );
}

export default StudentProfilePage;