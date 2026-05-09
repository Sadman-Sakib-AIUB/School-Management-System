"use client";
import { useEffect, useState } from "react";
import {
  X, User, Mail, Phone, MapPin, Briefcase,
  CreditCard, Building2, Hash, ShieldCheck,
  Users, AlertCircle, Loader2,
} from "lucide-react";
import axiosInstance from "@/src/lib/axiosInstance";
import SkeletonView from "./SkeletonView";
import SectionCardView from "./SectionCardView";
import InfoRowView from "./InfoRowView";

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" });
};


const ViewGuardianModal = ({ isOpen, onClose, guardianId }) => {
  const [guardian, setGuardian] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !guardianId) return;

    setIsLoading(true);
    setError(null);
    setGuardian(null);

    // Fetch guardian details
    axiosInstance.get(`/guardians/${guardianId}`)
      .then(res => setGuardian(res.data?.data))
      .catch(() => setError("অভিভাবকের তথ্য লোড করতে ব্যর্থ হয়েছে।"))
      .finally(() => setIsLoading(false));
  }, [isOpen, guardianId]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const initials = guardian?.fullNameEnglish?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "G";
  const isActive = guardian?.user?.isActive === "ACTIVE";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-lg font-bold text-gray-900">অভিভাবকের বিস্তারিত তথ্য</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading && <SkeletonView />}

          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <AlertCircle size={24} className="text-red-400 mb-3" />
              <p className="text-sm font-medium text-gray-700">{error}</p>
            </div>
          )}

          {guardian && !isLoading && (
            <div className="p-6 space-y-4">

              {/* Profile header */}
              <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-xl shrink-0">
                  {
                    guardian.profilePhotoUrl
                      ? <img src={guardian.profilePhotoUrl} alt={guardian.fullNameEnglish} className="w-full h-full object-cover rounded-lg" />
                      : initials
                  }
                  {/* {initials} */}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900">{guardian.fullNameEnglish}</h3>
                  <p className="text-sm text-gray-400 mt-0.5">{guardian.fullNameBangla}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs font-mono font-semibold px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">
                      {guardian.guardianCode}
                    </span>
                    <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${isActive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-red-500"}`} />
                      {isActive ? "এক্টিভ" : "ইনএক্টিভ"}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full">
                      <Users size={11} />
                      {guardian.students?.length ?? 0} জন শিক্ষার্থী যুক্ত
                    </span>
                  </div>
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <SectionCardView title="ব্যক্তিগত তথ্য" icon={User} colorClass="text-blue-600 bg-blue-50">
                  <InfoRowView icon={Phone} label="মোবাইল" value={guardian.phone} accent="text-blue-400" />
                  <InfoRowView icon={Mail} label="ব্যক্তিগত ইমেইল" value={guardian.email} accent="text-blue-400" />
                  <InfoRowView icon={MapPin} label="ঠিকানা" value={guardian.address} accent="text-blue-400" />
                  <InfoRowView icon={CreditCard} label="NID" value={guardian.nid} accent="text-blue-400" />
                </SectionCardView>

                <SectionCardView title="পেশাগত ও আর্থিক তথ্য" icon={Briefcase} colorClass="text-violet-600 bg-violet-50">
                  <InfoRowView icon={Briefcase} label="পেশা" value={guardian.occupation} accent="text-violet-400" />
                  <InfoRowView icon={CreditCard} label="মাসিক আয়" value={guardian.monthlyIncome ? `৳ ${Number(guardian.monthlyIncome).toLocaleString("bn-BD")}` : "—"} accent="text-violet-400" />
                  <InfoRowView icon={Building2} label="প্রতিষ্ঠান" value={guardian.institution?.name} accent="text-violet-400" />
                  <InfoRowView icon={Hash} label="যোগ দিয়েছে" value={formatDate(guardian.createdAt)} accent="text-violet-400" />
                </SectionCardView>

                <SectionCardView title="অ্যাকাউন্ট তথ্য" icon={ShieldCheck} colorClass="text-emerald-600 bg-emerald-50">
                  <InfoRowView icon={User} label="ইউজারনেম" value={guardian.user?.username} accent="text-emerald-400" />
                  <InfoRowView icon={Mail} label="লগইন ইমেইল" value={guardian.user?.email} accent="text-emerald-400" />
                </SectionCardView>

                {/* Linked students */}
                <SectionCardView title="সংযুক্ত শিক্ষার্থী" icon={Users} colorClass="text-amber-600 bg-amber-50">
                  {guardian.students?.length > 0 ? (
                    <div className="py-2 space-y-2">
                      {guardian.students.map((s, i) => (
                        <div key={i} className="flex items-center gap-2 py-1">
                          <div className="w-7 h-7 bg-amber-100 rounded-lg flex items-center justify-center text-amber-700 font-bold text-xs">
                            {
                              s.profilePhotoUrl
                                ? <img src={s.profilePhotoUrl} alt={s.fullNameEnglish} className="w-full h-full object-cover rounded-lg" />
                                : s.fullNameEnglish?.charAt(0) || "S"
                            }
                            
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-700">{s.fullNameEnglish}</p>
                            <p className="text-xs text-gray-400">{s.studentCode}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="py-4 text-sm text-gray-400 text-center italic">
                      কোনো শিক্ষার্থী সংযুক্ত নেই।
                    </p>
                  )}
                </SectionCardView>

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

export default ViewGuardianModal;