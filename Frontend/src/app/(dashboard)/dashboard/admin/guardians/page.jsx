"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Plus, Search, RefreshCw, AlertCircle,
  ChevronLeft, ChevronRight, Eye, Pencil, Users,
  Link2,
} from "lucide-react";

import Swal from "sweetalert2";
import axiosInstance from "@/src/lib/axiosInstance";
import ViewGuardianModal from "./_components/view/ViewGuardianModal";
import CreateGuardianModal from "./_components/create/CreateGuardianModal";
import EditGuardianModal from "./_components/update/EditGuardianModal";
import LinkStudentModal from "./_components/link/LinkStudentModal";
import LinkedStudentsPanel from "./_components/link/LinkedStudentPanel";

// -------------- CONSTANTS --------------
const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "এক্টিভ" },
  { value: "INACTIVE", label: "ইনএক্টিভ" },
  { value: "SUSPENDED", label: "স্থগিত" },
  { value: "BLOCKED", label: "ব্লকড" },
];

const statusCls = (s) => ({
  ACTIVE: "bg-emerald-100 text-emerald-700",
  INACTIVE: "bg-gray-100 text-gray-600",
  SUSPENDED: "bg-amber-100 text-amber-700",
  BLOCKED: "bg-red-100 text-red-600",
}[s] ?? "bg-gray-100 text-gray-600");

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("bn-BD", { year: "numeric", month: "short", day: "numeric" });
};

const ITEMS_PER_PAGE = 10;

const SkeletonRow = () => (
  <tr className="border-b border-gray-50">
    {[44, 28, 32, 36, 20, 24, 30].map((w, i) => (
      <td key={i} className="px-5 py-4">
        <div className="h-4 bg-gray-100 rounded-lg animate-pulse" style={{ width: `${w * 3}px` }} />
      </td>
    ))}
  </tr>
);


const GuardiansPage = () => {
  const [allGuardians, setAllGuardians] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalFromServer, setTotalFromServer] = useState(0);
  const [page, setPage] = useState(1);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  // Modals
  const [viewGuardianId, setViewGuardianId] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editGuardian, setEditGuardian] = useState(null);
  const [linkGuardian, setLinkGuardian] = useState(null);
  const [linkedPanel, setLinkedPanel] = useState(null);

  // ------------- Fetch all guardians ----------------
  const fetchGuardians = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get("/guardians", { params: { limit: 500, page: 1 } });
      // console.log(res);
      setAllGuardians(res.data?.data ?? []);
      setTotalFromServer(res.data?.meta?.total ?? 0);
    } catch {
      setError("গার্ডিয়ানদের তথ্য লোড করতে ব্যর্থ হয়েছে।");
    } finally {
      setIsLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchGuardians();
  }, [fetchGuardians]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // ------------------- Client-side filter -------------------
  const filtered = useMemo(() => {
    if (!search.trim()) return allGuardians;

    const q = search.trim().toLowerCase();
    return allGuardians.filter((g) =>
      g.fullNameEnglish?.toLowerCase().includes(q) ||
      g.fullNameBangla?.toLowerCase().includes(q) ||
      g.guardianCode?.toLowerCase().includes(q) ||
      g.phone?.includes(q) ||
      g.email?.toLowerCase().includes(q) ||
      g.user?.email?.toLowerCase().includes(q)
      // || g.occupation?.toLowerCase().includes(q)
    );
  }, [allGuardians, search]);

  // ------------------- Pagination -------------------
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  // ------------------- Status change -----------------
  const handleStatusChange = async (guardian, newStatus) => {
    if (guardian.user?.isActive === newStatus) return;
    const opt = STATUS_OPTIONS.find((o) => o.value === newStatus);

    // SweetAlert confirmation
    const { isConfirmed } = await Swal.fire({
      title: "স্ট্যাটাস পরিবর্তন করবেন?",
      html: `<strong>${guardian.fullNameEnglish}</strong>-এর অ্যাকাউন্ট <strong>${opt?.label}</strong> করা হবে।`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, পরিবর্তন করুন",
      cancelButtonText: "বাতিল",
      confirmButtonColor: "#7c3aed", cancelButtonColor: "#6b7280",
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-xl px-5 py-2.5 font-semibold",
        cancelButton: "rounded-xl px-5 py-2.5 font-semibold",
      },
    });
    if (!isConfirmed) return;

    try {
      await axiosInstance.patch(`/guardians/${guardian.id}/status`, { status: newStatus });
      setAllGuardians((prev) =>
        prev.map((g) =>
          g.id === guardian.id ? { ...g, user: { ...g.user, isActive: newStatus } } : g
        )
      );

      Swal.fire({
        icon: "success", title: "সফল!",
        html: `অ্যাকাউন্ট <strong>${opt?.label}</strong> করা হয়েছে।`,
        confirmButtonText: "ঠিক আছে", confirmButtonColor: "#7c3aed",
        timer: 2000, timerProgressBar: true,
        customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl px-5 py-2.5 font-semibold" },
      });
    } catch (err) {
      Swal.fire({
        icon: "error", title: "ব্যর্থ!",
        text: err.response?.data?.message ?? "স্ট্যাটাস পরিবর্তন করতে ব্যর্থ হয়েছে।",
        confirmButtonText: "ঠিক আছে", confirmButtonColor: "#7c3aed",
        customClass: { popup: "rounded-2xl", confirmButton: "rounded-xl px-5 py-2.5 font-semibold" },
      });
    }
  };

  // After linking/unlinking refresh count in table
  const handleLinkChanged = async () => {
    // Refresh just the counts by re-fetching all
    fetchGuardians();
  };

  return (
    <div className="space-y-5">

      {/* -- Header -- */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">অভিভাবক ব্যবস্থাপনা</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {search
              ? `${filtered.length} জন পাওয়া গেছে (মোট ${totalFromServer} জন)`
              : `মোট ${totalFromServer} জন অভিভাবক`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchGuardians} disabled={isLoading}
            className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500 disabled:opacity-40">
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          </button>
          <button onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-all shadow-lg shadow-violet-200/60 active:scale-95">
            <Plus size={16} /> নতুন অভিভাবক
          </button>
        </div>
      </div>

      {/* -- Search -- */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="নাম, কোড, ফোন বা পেশা..."
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-violet-400"
        />
      </div>

      {/* -- Error -- */}
      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
            <AlertCircle size={24} className="text-red-400" />
          </div>
          <p className="text-sm font-medium text-gray-700 mb-3">{error}</p>
          <button onClick={fetchGuardians} className="text-sm text-violet-600 hover:underline font-semibold">
            আবার চেষ্টা করুন
          </button>
        </div>
      )}

      {/* -- Table -- */}
      {!error && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["অভিভাবক", "কোড", "যোগাযোগ", "সংযুক্ত শিক্ষার্থী", "অ্যাকাউন্ট স্ট্যাটাস", "একশন"].map((h, i) => (
                    <th key={i} className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading
                  ? Array(5).fill(0).map((_, i) => <SkeletonRow key={i} />)
                  : paginated.length === 0
                    ? (
                      <tr><td colSpan={7} className="px-5 py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center">
                            <Users size={24} className="text-violet-400" />
                          </div>
                          <p className="font-semibold text-gray-600">
                            {search ? `"${search}" খুঁজে পাওয়া যায়নি` : "কোনো অভিভাবক নেই"}
                          </p>
                          {!search && (
                            <button onClick={() => setIsCreateOpen(true)}
                              className="flex items-center gap-1.5 text-sm font-semibold text-violet-600 hover:underline">
                              <Plus size={14} /> প্রথম অভিভাবক যোগ করুন
                            </button>
                          )}
                        </div>
                      </td></tr>
                    )
                    : paginated.map((guardian) => {
                      const initials = guardian.fullNameEnglish?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) ?? "G";
                      const userStatus = guardian.user?.isActive ?? "ACTIVE";
                      const linkedCount = guardian.linkedStudentsCount ?? 0;

                      return (
                        <tr key={guardian.id} className="hover:bg-gray-50/50 transition-colors">

                          {/* Guardian */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-sm shrink-0">
                                {
                                  guardian.profilePhotoUrl
                                    ? <img src={guardian.profilePhotoUrl} alt={guardian.fullNameEnglish} className="w-full h-full object-cover rounded-lg" />
                                    : initials
                                }
                                {/* {initials} */}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800">{guardian.fullNameEnglish}</p>
                                <p className="text-xs text-gray-400">{guardian.fullNameBangla}</p>
                              </div>
                            </div>
                          </td>

                          {/* Code */}
                          <td className="px-5 py-4">
                            <span className="font-mono text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                              {guardian.guardianCode}
                            </span>
                          </td>

                          {/* Contact */}
                          <td className="px-5 py-4">
                            <p className="text-sm text-gray-700">{guardian.phone || "—"}</p>
                            <p className="text-xs text-gray-400">{guardian.email || "—"}</p>
                          </td>

                          {/* Occupation */}
                          {/* <td className="px-5 py-4">
                            <p className="text-sm text-gray-700">{guardian.occupation || "—"}</p>
                            <p className="text-xs text-gray-400">{formatDate(guardian.createdAt)}</p>
                          </td> */}

                          {/* Linked students — clickable */}
                          <td className="px-5 py-4">
                            <button
                              onClick={() => setLinkedPanel(guardian)}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${linkedCount > 0
                                  ? "bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer"
                                  : "bg-gray-100 text-gray-500 hover:bg-gray-200 cursor-pointer"
                                }`}
                              title={linkedCount > 0 ? "শিক্ষার্থীদের দেখুন" : "কোনো শিক্ষার্থী সংযুক্ত নেই"}
                            >
                              <Users size={11} />
                              {linkedCount} জন
                            </button>
                            {/* <p className="text-xs text-gray-400 pt-1.5">{"দেখতে ক্লিক করুন"}</p> */}
                          </td>

                          {/* Status dropdown */}
                          <td className="px-5 py-4">
                            <select
                              value={userStatus}
                              onChange={(e) => handleStatusChange(guardian, e.target.value)}
                              className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border-0 outline-none cursor-pointer ${statusCls(userStatus)}`}
                            >
                              {STATUS_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                              ))}
                            </select>
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setViewGuardianId(guardian.id)}
                                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                              >
                                <Eye size={12} /> দেখুন
                              </button>
                              <button
                                onClick={() => setEditGuardian(guardian)}
                                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 border border-violet-200 text-violet-700 bg-violet-50 hover:bg-violet-100 rounded-lg transition-colors"
                              >
                                <Pencil size={12} /> এডিট
                              </button>
                              <button
                                onClick={() => setLinkGuardian(guardian)}
                                className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                              >
                                <Link2 size={11} /> লিঙ্ক করুন
                              </button>
                            </div>
                          </td>

                        </tr>
                      );
                    })
                }
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-50">
              <p className="text-sm text-gray-400">
                পৃষ্ঠা {safePage} / {totalPages} · মোট {filtered.length} জন
              </p>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage <= 1}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                  <ChevronLeft size={15} /> পূর্ববর্তী
                </button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                  পরবর্তী <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* -- Modal -- */}
      <ViewGuardianModal
        isOpen={!!viewGuardianId}
        onClose={() => setViewGuardianId(null)}
        guardianId={viewGuardianId}
      />

      <CreateGuardianModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => fetchGuardians()}
      />

      <EditGuardianModal
        isOpen={!!editGuardian}
        onClose={() => setEditGuardian(null)}
        onSuccess={() => { setEditGuardian(null); fetchGuardians(); }}
        guardian={editGuardian}
      />

      <LinkStudentModal
        isOpen={!!linkGuardian}
        onClose={() => setLinkGuardian(null)}
        onSuccess={() => { setLinkGuardian(null); fetchGuardians(); }}
        guardian={linkGuardian}
      />
      <LinkedStudentsPanel
        isOpen={!!linkedPanel}
        onClose={() => setLinkedPanel(null)}
        guardian={linkedPanel}
        onChanged={handleLinkChanged}
      />

    </div>
  );
}

export default GuardiansPage;
