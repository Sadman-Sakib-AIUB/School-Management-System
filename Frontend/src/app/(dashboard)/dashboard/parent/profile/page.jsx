"use client";

import { useEffect, useState } from "react";
import {
  User, Mail, Phone, MapPin, Hash, Building2,
  ShieldCheck, AlertCircle, Briefcase, Wallet,
  Calendar, BookOpen, Star, AtSign,
  Camera,
} from "lucide-react";
import axiosInstance from "@/src/lib/axiosInstance";

import InfoRow from "@/src/app/components/dashboard/InfoRow";
import SectionCard from "@/src/app/components/dashboard/SectionCard";
import ProfilePhoto from "@/src/app/components/dashboard/Shared/ProfilePhoto";
import ProfileSkeleton from "../../teacher/_components/ProfileSkeleton";

// -------- helpers --------

const ACTIVE_LABEL = { ACTIVE: "এক্টিভ", INACTIVE: "ইনএক্টিভ" };
const GENDER_BN = { MALE: "পুরুষ", FEMALE: "মহিলা", OTHER: "অন্যান্য" };
const RELATION_BN = {
  FATHER: "বাবা", MOTHER: "মা", GRANDFATHER: "দাদা", GRANDMOTHER: "দাদি",
  UNCLE: "চাচা", AUNT: "চাচি", SIBLING: "ভাই/বোন", GUARDIAN: "অভিভাবক", OTHER: "অন্যান্য",
};

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" }) : "—";

const formatIncome = (n) =>
  n ? "৳ " + Number(n).toLocaleString("bn-BD") : "—";

// ------ linked students card -------

// function LinkedStudentsCard({ students }) {
//   if (!students?.length) return null;

//   return (
//     <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:col-span-2">
//       <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
//         <BookOpen size={16} className="text-violet-600" />
//         <h3 className="text-sm font-bold text-gray-700">সংযুক্ত শিক্ষার্থীসমূহ</h3>
//         <span className="ml-auto text-xs font-semibold px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full">
//           {students.length} জন
//         </span>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         {students.map((s) => {
//           const initials = (s.fullNameEnglish || s.fullNameBangla || "S")
//             .split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
//           const enrollment = s.currentEnrollment;

//           return (
//             <div key={s.id} className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 flex items-start gap-3">
//               {/* avatar */}
//               <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-sm shrink-0">
//                 {initials}
//               </div>

//               <div className="min-w-0 flex-1">
//                 <div className="flex items-center gap-2 flex-wrap">
//                   <p className="text-sm font-bold text-gray-800 truncate">{s.fullNameBangla}</p>
//                   {s.isPrimary && (
//                     <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full shrink-0">
//                       <Star size={10} fill="currentColor" />
//                       প্রাথমিক
//                     </span>
//                   )}
//                 </div>
//                 <p className="text-xs text-gray-400 mt-0.5">{s.fullNameEnglish}</p>

//                 <div className="flex flex-wrap gap-1.5 mt-2">
//                   <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-violet-50 border border-violet-200 text-violet-700 rounded-full">
//                     {s.studentCode}
//                   </span>
//                   <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full">
//                     {RELATION_BN[s.relationship] || s.relationship}
//                   </span>
//                   <span className="text-xs font-semibold px-2 py-0.5 bg-gray-100 border border-gray-200 text-gray-600 rounded-full">
//                     {GENDER_BN[s.gender] || s.gender}
//                   </span>
//                 </div>

//                 {enrollment && (
//                   <div className="flex flex-wrap gap-1.5 mt-1.5">
//                     <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-full">
//                       {enrollment.section?.class?.name}
//                     </span>
//                     <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-600 rounded-full">
//                       সেকশন {enrollment.section?.name}
//                     </span>
//                     <span className="text-xs font-semibold px-2 py-0.5 bg-gray-100 border border-gray-200 text-gray-500 rounded-full">
//                       রোল: {enrollment.rollNumber}
//                     </span>
//                     <span className="text-xs font-semibold px-2 py-0.5 bg-gray-100 border border-gray-200 text-gray-500 rounded-full">
//                       {enrollment.academicYear}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

const GuardianProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get("/guardians/me");
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

  if (!profile) return null;

  const initials = (profile.fullNameEnglish || profile.fullNameBangla || "G")
    .split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="space-y-6 mx-auto max-w-5xl">

      {/* ── Profile Header Card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-violet-400 to-violet-600" />

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

              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <Camera size={11} />
                ছবিতে ক্লিক করে প্রোফাইল ফটো পরিবর্তন করুন
              </p>

              <div className="flex flex-wrap items-center gap-2 mt-3">
                {/* guardian code */}
                <span className="text-xs font-semibold px-3 py-1.5 bg-violet-100 text-violet-700 rounded-full font-mono">
                  {profile.guardianCode}
                </span>
                {/* occupation */}
                {profile.occupation && (
                  <span className="text-xs font-semibold px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full">
                    {profile.occupation}
                  </span>
                )}
                {/* role */}
                {profile.roles?.[0] && (
                  <span className="text-xs font-semibold px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full">
                    {profile.roles[0].name}
                  </span>
                )}
                {/* status */}
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

            {/* Institution — right */}
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
          <InfoRow icon={Phone} label="মোবাইল নম্বর" value={profile.phone} accent="text-blue-400" />
          <InfoRow icon={Mail} label="ব্যক্তিগত ইমেইল" value={profile.email} accent="text-blue-400" />
          <InfoRow icon={MapPin} label="ঠিকানা" value={profile.address} accent="text-blue-400" />
          <InfoRow icon={Hash} label="জাতীয় পরিচয়পত্র" value={profile.nid} accent="text-blue-400" />
        </SectionCard>

        {/* Professional & Financial */}
        <SectionCard title="পেশাগত ও আর্থিক তথ্য" icon={Briefcase} color="text-emerald-600">
          <InfoRow icon={Briefcase} label="পেশা" value={profile.occupation} accent="text-emerald-400" />
          <InfoRow icon={Wallet} label="মাসিক আয়" value={formatIncome(profile.monthlyIncome)} accent="text-emerald-400" />
          <InfoRow icon={Calendar} label="নিবন্ধনের তারিখ" value={formatDate(profile.createdAt)} accent="text-emerald-400" />
        </SectionCard>

        {/* Account Info */}
        <SectionCard title="অ্যাকাউন্ট তথ্য" icon={ShieldCheck} color="text-violet-600">
          <InfoRow icon={AtSign} label="ব্যবহারকারীর নাম" value={profile.user?.username} accent="text-violet-400" />
          <InfoRow icon={Mail} label="লগইন ইমেইল" value={profile.user?.email} accent="text-violet-400" />
          <InfoRow icon={ShieldCheck} label="ভূমিকা" value={profile.roles?.map((r) => r.name).join(", ")} accent="text-violet-400" />
        </SectionCard>

        {/* Institution */}
        <SectionCard title="প্রতিষ্ঠান তথ্য" icon={Building2} color="text-amber-600">
          <InfoRow icon={Building2} label="প্রতিষ্ঠানের নাম" value={profile.institution?.name} accent="text-amber-400" />
          <InfoRow icon={Hash} label="প্রতিষ্ঠান কোড" value={profile.institution?.code} accent="text-amber-400" />
        </SectionCard>

        {/* Linked Students — full width */}
        {/* <LinkedStudentsCard students={profile.students} /> */}

      </div>
    </div>
  );
};

export default GuardianProfilePage;