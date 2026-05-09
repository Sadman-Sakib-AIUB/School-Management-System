import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardList,
  CalendarDays,
  MessageSquare,
  CreditCard,
  Bell,
  FileText,
  UserCheck,
  School,
  BookMarked,
  Home,
  Users2,
  UserCircle,
  BookPlus,
  ListOrdered,
} from "lucide-react";
import { ROLES } from "../constants/roles";

/**
 * @description Role-keyed sidebar configuration.
 *
 * Each role has its own ordered array of menu items.
 * This guarantees correct order per role regardless of how
 * items are shared across roles.
 *
 * To get menu items for a role: SIDEBAR_CONFIG[activeRole] ?? []
 */
export const SIDEBAR_CONFIG = {
  [ROLES.PRINCIPAL]: [
    {
      id: "dashboard",
      label: "ড্যাশবোর্ড",
      icon: <LayoutDashboard size={20} />,
      href: "/dashboard/principal",
    },
    {
      id: "teachers",
      label: "শিক্ষকগণ",
      icon: <Users2 size={20} />,
      href: "/dashboard/principal/teachers",
    },
    {
      id: "students",
      label: "ছাত্রছাত্রী",
      icon: <Users size={20} />,
      href: "/dashboard/principal/students",
    },
    {
      id: "academic-classes",
      label: "একাডেমিক ক্লাস",
      icon: <GraduationCap size={20} />,
      href: "/dashboard/principal/academic-classes",
    },
    {
      id: "sections",
      label: "সেকশন",
      icon: <BookPlus size={20} />,
      href: "/dashboard/principal/sections",
    },
    {
      id: "institution",
      label: "প্রতিষ্ঠান",
      icon: <School size={20} />,
      href: "/dashboard/principal/institution",
    },
    // {
    //   id: "reports",
    //   label: "রিপোর্টস",
    //   icon: <BarChart3 size={20} />,
    //   href: "/dashboard/principal/reports",
    // },
    
    {
      id: "attendance",
      label: "উপস্থিতি",
      icon: <UserCheck size={20} />,
      href: "/dashboard/principal/attendance",
    },
    {
      id: "schedule",
      label: "সময়সূচি",
      icon: <CalendarDays size={20} />,
      href: "/dashboard/principal/schedule",
    },
    // {
    //   id: "fees",
    //   label: "ফি ও পেমেন্ট",
    //   icon: <CreditCard size={20} />,
    //   href: "/dashboard/principal/fees",
    // },
    {
      id: "notice",
      label: "নোটিশ",
      icon: <Bell size={20} />,
      href: "/dashboard/principal/notifications",
    },
    // {
    //   id: "messages",
    //   label: "বার্তা",
    //   icon: <MessageSquare size={20} />,
    //   href: "/dashboard/principal/messages",
    // },
    // {
    //   id: "settings",
    //   label: "সেটিংস",
    //   icon: <Settings size={20} />,
    //   href: "/dashboard/principal/settings",
    // },
  ],

  [ROLES.ADMIN]: [
    {
      id: "admin-dashboard",
      label: "ড্যাশবোর্ড",
      icon: <LayoutDashboard size={20} />,
      href: "/dashboard/admin",
    },
    {
      id: "admin-teachers",
      label: "শিক্ষকগণ",
      icon: <Users2 size={20} />,
      href: "/dashboard/admin/teachers",
    },
    {
      id: "admin-students",
      label: "ছাত্রছাত্রী",
      icon: <Users size={20} />,
      href: "/dashboard/admin/students",
    },
    {
      id: "admin-guardians",
      label: "অভিভাবকগণ",
      icon: <UserCheck size={20} />,
      href: "/dashboard/admin/guardians",
    },
    {
      id: "academic-classes",
      label: "একাডেমিক ক্লাস",
      icon: <GraduationCap size={20} />,
      href: "/dashboard/admin/academic-classes",
    },
    {
      id: "exams",
      label: "পরীক্ষা",
      icon: <ClipboardList size={20} />,
      href: "/dashboard/admin/exams",
    },
    {
      id: "results",
      label: "ফলাফল",
      icon: <GraduationCap size={20} />,
      href: "/dashboard/admin/results",
    },
    {
      id: "sections",
      label: "সেকশন",
      icon: <BookPlus size={20} />,
      href: "/dashboard/admin/sections",
    },
    {
      id: "admin-admission",
      label: "ভর্তি",
      icon: <UserCheck size={20} />,
      href: "/dashboard/admin/admission",
    },
    // {
    //   id: "admin-reports",
    //   label: "রিপোর্টস",
    //   icon: <BarChart3 size={20} />,
    //   href: "/dashboard/admin/reports",
    // },
    {
      id: "admin-notice",
      label: "নোটিশ",
      icon: <Bell size={20} />,
      href: "/dashboard/admin/notice",
    },
    // {
    //   id: "admin-messages",
    //   label: "বার্তা",
    //   icon: <MessageSquare size={20} />,
    //   href: "/dashboard/admin/messages",
    // },
    // {
    //   id: "admin-settings",
    //   label: "সেটিংস",
    //   icon: <Settings size={20} />,
    //   href: "/dashboard/admin/settings",
    // },
  ],

  [ROLES.TEACHER]: [
    {
      id: "teacher-dashboard",
      label: "ড্যাশবোর্ড",
      icon: <LayoutDashboard size={20} />,
      href: "/dashboard/teacher",
    },
    {
      id: "my-classes",
      label: "আমার ক্লাস",
      icon: <BookOpen size={20} />,
      href: "/dashboard/teacher/my-classes",
    },
    {
      id: "teacher-attendance",
      label: "উপস্থিতি",
      icon: <UserCheck size={20} />,
      href: "/dashboard/teacher/attendance",
    },
    // {
    //   id: "assignments",
    //   label: "অ্যাসাইনমেন্ট",
    //   icon: <ClipboardList size={20} />,
    //   href: "/dashboard/teacher/assignments",
    // },
    {
      id: "teacher-result",
      label: "রেজাল্ট",
      icon: <ListOrdered size={20}/>,
      href: "/dashboard/teacher/result",
    },
    {
      id: "teacher-notice",
      label: "নোটিশ",
      icon: <Bell size={20} />,
      href: "/dashboard/teacher/notice",
    },
    // {
    //   id: "teacher-messages",
    //   label: "বার্তা",
    //   icon: <MessageSquare size={20} />,
    //   href: "/dashboard/teacher/messages",
    // },
    {
      id: "teacher-profile",
      label: "আমার প্রোফাইল",
      icon: <UserCircle size={20} />,
      href: "/dashboard/teacher/profile",
    },
  ],

  [ROLES.STUDENT]: [
    {
      id: "student-dashboard",
      label: "ড্যাশবোর্ড",
      icon: <LayoutDashboard size={20} />,
      href: "/dashboard/student",
    },
    {
      id: "my-courses",
      label: "আমার কোর্স",
      icon: <BookMarked size={20} />,
      href: "/dashboard/student/my-courses",
    },
    {
      id: "student-attendance",
      label: "উপস্থিতি",
      icon: <UserCheck size={20} />,
      href: "/dashboard/student/attendance",
    },
    // {
    //   id: "student-assignments",
    //   label: "অ্যাসাইনমেন্ট",
    //   icon: <ClipboardList size={20} />,
    //   href: "/dashboard/student/assignments",
    // },
    {
      id: "results",
      label: "ফলাফল",
      icon: <GraduationCap size={20} />,
      href: "/dashboard/student/results",
    },
    // {
    //   id: "student-schedule",
    //   label: "সময়সূচি",
    //   icon: <CalendarDays size={20} />,
    //   href: "/dashboard/student/schedule",
    // },
    {
      id: "student-fees",
      label: "ফি ও পেমেন্ট",
      icon: <CreditCard size={20} />,
      href: "/dashboard/student/fees",
    },
    {
      id: "student-notice",
      label: "নোটিশ",
      icon: <Bell size={20} />,
      href: "/dashboard/student/notice",
    },
    // {
    //   id: "student-messages",
    //   label: "বার্তা",
    //   icon: <MessageSquare size={20} />,
    //   href: "/dashboard/student/messages",
    // },
    {
      id: "student-profile",
      label: "আমার প্রোফাইল",
      icon: <UserCircle size={20} />,
      href: "/dashboard/student/profile",
    },
  ],

  [ROLES.GUARDIAN]: [
    {
      id: "guardian-dashboard",
      label: "ড্যাশবোর্ড",
      icon: <LayoutDashboard size={20} />,
      href: "/dashboard/guardian",
    },
    // {
    //   id: "my-children",
    //   label: "আমার সন্তান",
    //   icon: <Home size={20} />,
    //   href: "/dashboard/parent/my-children",
    // },
    {
      id: "parent-results",
      label: "ফলাফল",
      icon: <GraduationCap size={20} />,
      href: "/dashboard/parent/results",
    },
    {
      id: "parent-fees",
      label: "ফি ও পেমেন্ট",
      icon: <CreditCard size={20} />,
      href: "/dashboard/parent/fees",
    },
    {
      id: "parent-notice",
      label: "নোটিশ",
      icon: <Bell size={20} />,
      href: "/dashboard/parent/notice",
    },
    {
      id: "parent-profile",
      label: "আমার প্রোফাইল",
      icon: <UserCircle size={20} />,
      href: "/dashboard/parent/profile",
    },
    // {
    //   id: "parent-messages",
    //   label: "বার্তা",
    //   icon: <MessageSquare size={20} />,
    //   href: "/dashboard/parent/messages",
    // },
    
  ],

  [ROLES.STAFF]: [
    {
      id: "staff-dashboard",
      label: "ড্যাশবোর্ড",
      icon: <LayoutDashboard size={20} />,
      href: "/dashboard/staff",
    },
    {
      id: "staff-duties",
      label: "দায়িত্ব",
      icon: <FileText size={20} />,
      href: "/dashboard/staff/duties",
    },
    {
      id: "staff-schedule",
      label: "সময়সূচি",
      icon: <CalendarDays size={20} />,
      href: "/dashboard/staff/schedule",
    },
    {
      id: "staff-notifications",
      label: "নোটিশ",
      icon: <Bell size={20} />,
      href: "/dashboard/staff/notifications",
    },
    {
      id: "staff-messages",
      label: "বার্তা",
      icon: <MessageSquare size={20} />,
      href: "/dashboard/staff/messages",
    },
  ],
};