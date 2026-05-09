"use client";
import React, { useEffect } from "react";
import {
  LogOut, X, ChevronLeft, ChevronRight, BookOpenCheck, Loader2,
} from "lucide-react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { SIDEBAR_CONFIG } from "../../../config/sidebarConfig";
import { logoutThunk } from "../../../store/thunks/authThunk";
import {
  selectActiveRole,
  selectIsLoading,
} from "../../../store/slices/authSlice";

const ROLE_ROOTS = [
  "/dashboard/principal",
  "/dashboard/admin",
  "/dashboard/teacher",
  "/dashboard/student",
  "/dashboard/parent",
  "/dashboard/staff",
];

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const activeRole = useSelector(selectActiveRole);
  const isLoading = useSelector(selectIsLoading);

  const menuItems = SIDEBAR_CONFIG[activeRole] ?? [];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsSidebarOpen]);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    router.replace("/login");
  };

  const isActive = (href) => {
    if (ROLE_ROOTS.includes(href)) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-primary-800 text-white transition-all duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? "w-64 translate-x-0" : "w-0 lg:w-20 -translate-x-full lg:translate-x-0"}`}
      >
        {/* FIX: Removed sticky hacks, just standard flex column taking full height */}
        <div className="flex flex-col h-full overflow-hidden w-full">

          {/* HEADER */}
          <div className={`p-4 h-16 flex items-center border-b border-primary-700 ${isSidebarOpen ? "justify-between" : "justify-center"}`}>
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-primary-800 font-bold text-xl shrink-0">
                <BookOpenCheck />
              </div>
              {isSidebarOpen && (
                <h1 className="text-xl font-bold whitespace-nowrap">অপার্স স্কুল</h1>
                
              )}
            </div>
            <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
              <X size={24} />
            </button>
            <button
              className="hidden lg:block hover:bg-primary-700 p-1 rounded transition-colors"
              onClick={toggleSidebar}
            >
              {isSidebarOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
            </button>
          </div>

          {/* NAV */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto overflow-x-hidden">
            {menuItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative ${active
                    ? "bg-primary-600 text-white shadow-lg"
                    : "text-primary-100 hover:bg-primary-700/50"
                    }`}
                >
                  <div className={`shrink-0 ${!isSidebarOpen && "mx-auto"}`}>
                    {item.icon}
                  </div>
                  {isSidebarOpen && (
                    <span className="font-medium whitespace-nowrap">{item.label}</span>
                  )}
                  {!isSidebarOpen && (
                    <div className="absolute left-full ml-4 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 hidden lg:block z-50 pointer-events-none whitespace-nowrap">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* LOGOUT */}
          <div className="p-3 border-t border-primary-700 shrink-0">
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-primary-100 hover:bg-red-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <div className={`shrink-0 ${!isSidebarOpen ? "mx-auto" : ""}`}>
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <LogOut size={20} />}
              </div>
              {isSidebarOpen && <span className="whitespace-nowrap">লগআউট</span>}
            </button>
          </div>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;