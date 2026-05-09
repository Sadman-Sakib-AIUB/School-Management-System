"use client";
import React, { useState, useRef, useEffect } from "react";
import { Bell, ChevronDown, Menu, UserIcon, Check } from "lucide-react";
import Link from "next/link";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { SIDEBAR_CONFIG } from "../../../config/sidebarConfig";
import {
  selectCurrentUser,
  selectActiveRole,
  selectUserRoles,
  selectIsMultiRole,
} from "../../../store/slices/authSlice";
import { selectRoleThunk } from "../../../store/thunks/authThunk";
import { ROLE_ROUTES, ROUTE_ROLE_MAP } from "../../../constants/routes";

const ROLE_DISPLAY = {
  PRINCIPAL: { label: "প্রধান শিক্ষক", dot: "bg-violet-500" },
  ADMIN: { label: "এডমিন", dot: "bg-blue-500" },
  GUARDIAN: { label: "শিক্ষক", dot: "bg-emerald-500" },
  STUDENT: { label: "শিক্ষার্থী", dot: "bg-amber-500" },
  PARENT: { label: "অভিভাবক", dot: "bg-rose-500" },
  STAFF: { label: "কর্মচারী", dot: "bg-gray-500" },
};

const ROLE_PROFILE_ROUTES = {
  TEACHER: "/dashboard/teacher/profile",
  ADMIN: "/dashboard/admin/profile",
  PRINCIPAL: "/dashboard/principal/profile",
  STUDENT: "/dashboard/student/profile",
  PARENT: "/dashboard/parent/profile",
};

const ROLE_ROOTS = [
  "/dashboard/principal", "/dashboard/admin", "/dashboard/teacher",
  "/dashboard/student", "/dashboard/parent", "/dashboard/staff",
];

const TopbarDashboard = ({ setIsSidebarOpen }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const user = useSelector(selectCurrentUser);
  // console.log(user);
  const activeRole = useSelector(selectActiveRole);
  const userRoles = useSelector(selectUserRoles, shallowEqual); //
  const isMultiRole = useSelector(selectIsMultiRole); // true if user has more than 1 role
  // console.log(isMultiRole);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Derive page title from current pathname using role-specific menu items
  const menuItems = SIDEBAR_CONFIG[activeRole] ?? [];
  const currentItem = menuItems.find((item) => {
    if (ROLE_ROOTS.includes(item.href)) return pathname === item.href;
    return pathname.startsWith(item.href);
  });
  const currentTitle = currentItem?.label || "ড্যাশবোর্ড";

  const displayName = user?.username || "ব্যবহারকারী";
  const displayPhoto = user?.profilePhoto?.url || null;
  // console.log(displayPhoto);
  const activeConfig = ROLE_DISPLAY[activeRole] || { label: activeRole || "", dot: "bg-gray-400" };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRoleSwitch = async (roleName) => {
    if (roleName === activeRole) { setDropdownOpen(false); return; }
    setDropdownOpen(false);
    await dispatch(selectRoleThunk(roleName));
    const matchedRoute = Object.keys(ROUTE_ROLE_MAP)
      .find((route) => pathname.startsWith(route));
    if (matchedRoute && ROUTE_ROLE_MAP[matchedRoute].includes(roleName)) return;
    router.replace(ROLE_ROUTES[roleName] || "/dashboard");
  };


  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8 shrink-0 z-30">
      <div className="flex items-center gap-4">
        <button
          className="p-2 text-gray-500 lg:hidden hover:bg-gray-100 rounded-lg"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu size={24} />
        </button>
        <h2 className="text-lg font-semibold text-gray-800">{currentTitle}</h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>

        <div className="relative pl-4 border-l border-gray-200" ref={dropdownRef}>
          <button
            onClick={() => isMultiRole && setDropdownOpen(!dropdownOpen)}
            className={`flex items-center gap-3 ${isMultiRole ? "cursor-pointer group" : "cursor-default"}`}
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900 leading-none mb-1">{displayName}</p>
              <div className="flex items-center justify-end gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${activeConfig.dot}`} />
                <p className="text-xs text-gray-500 font-medium">{activeConfig.label}</p>
              </div>
            </div>


            {/* Profile Picture */}
            {ROLE_PROFILE_ROUTES[activeRole] ? (
              <Link
                href={ROLE_PROFILE_ROUTES[activeRole]}
                className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-sm hover:bg-emerald-200 transition-colors"
                title="প্রোফাইল দেখুন"
              >
                {displayPhoto ? (
                  <img
                    src={displayPhoto}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <UserIcon size={20} />
                )}

              </Link>
            ) : (
              <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-sm">
                <UserIcon size={20} />
              </div>
            )}
            {isMultiRole && (
              <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""} group-hover:text-emerald-600`} />
            )}
          </button>


          {/* Role Switcher Dropdown */}
          {isMultiRole && dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-2">
                ভূমিকা পরিবর্তন করুন
              </p>
              {userRoles.map((roleName) => {
                const config = ROLE_DISPLAY[roleName] || { label: roleName, dot: "bg-gray-400" };
                const isActiveRole = roleName === activeRole;
                return (
                  <button
                    key={roleName}
                    onClick={() => handleRoleSwitch(roleName)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${isActiveRole ? "bg-primary-50 text-primary-700" : "text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
                      <span className="font-medium">{config.label}</span>
                    </div>
                    {isActiveRole && <Check size={15} className="text-primary-600" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default TopbarDashboard;