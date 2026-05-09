"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Sidebar from "../components/dashboard/Sidebar";
import TopbarDashboard from "../components/dashboard/TopbarDashboard";
import {
  selectIsAuthenticated,
  selectActiveRole,
} from "../../store/slices/authSlice";
import { ROLE_ROUTES, ROUTE_ROLE_MAP } from "../../constants/routes";

const DashboardLayout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const activeRole = useSelector(selectActiveRole);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !activeRole) {
      router.replace("/login");
      return;
    }

    const matchedRoute = Object.keys(ROUTE_ROLE_MAP)
      .sort((a, b) => b.length - a.length)
      .find((route) => pathname.startsWith(route));

    if (matchedRoute) {
      const allowedRoles = ROUTE_ROLE_MAP[matchedRoute];
      const hasAccess = allowedRoles.includes(activeRole);

      if (!hasAccess) {
        router.replace(ROLE_ROUTES[activeRole] || "/login");
      }
    }
  }, [isAuthenticated, activeRole, pathname, router]);

  if (!isAuthenticated || !activeRole) return null;

  const matchedRoute = Object.keys(ROUTE_ROLE_MAP)
    .sort((a, b) => b.length - a.length)
    .find((route) => pathname.startsWith(route));

  if (matchedRoute) {
    const allowedRoles = ROUTE_ROLE_MAP[matchedRoute];
    if (!allowedRoles.includes(activeRole)) return null;
  }

  return (
    // FIX: Lock the entire screen height and hide page-level overflow
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopbarDashboard setIsSidebarOpen={setIsSidebarOpen} />

        {/* // FIX: Make only the main content area scrollable */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;