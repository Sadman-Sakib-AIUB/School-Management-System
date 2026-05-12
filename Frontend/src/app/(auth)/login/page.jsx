"use client";
import {
  ArrowLeft, ChevronRight, Lock, ShieldCheck, UserIcon,
  AlertCircle, Loader2, CheckCircle2, X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { loginThunk, selectRoleThunk } from "../../../store/thunks/authThunk";
import {
  selectIsLoading, selectAuthError, selectIsAuthenticated,
  selectActiveRole, selectUserRoles, clearError,
  clearAuthFromStorage,
} from "../../../store/slices/authSlice";
import { ROLE_ROUTES } from "../../../constants/routes";
import Link from "next/link";

const ROLE_DISPLAY = {
  PRINCIPAL: { label: "প্রধান শিক্ষক", color: "bg-violet-100 text-violet-700 border-violet-200", dot: "bg-violet-500" },
  ADMIN: { label: "প্রশাসক", color: "bg-blue-100 text-blue-700 border-blue-200", dot: "bg-blue-500" },
  TEACHER: { label: "শিক্ষক", color: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  STUDENT: { label: "শিক্ষার্থী", color: "bg-amber-100 text-amber-700 border-amber-200", dot: "bg-amber-500" },
  PARENT: { label: "অভিভাবক", color: "bg-rose-100 text-rose-700 border-rose-200", dot: "bg-rose-500" },
  STAFF: { label: "কর্মচারী", color: "bg-gray-100 text-gray-700 border-gray-200", dot: "bg-gray-500" },
};

const RoleSelectionModal = ({ roles, onSelect, onClose }) => {
  const [selected, setSelected] = React.useState(null);
  const [isRedirecting, setIsRedirecting] = React.useState(false);

  const handleConfirm = async () => {
    if (!selected) return;
    setIsRedirecting(true);
    await onSelect(selected);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 text-primary-700 rounded-2xl mb-4">
            <ShieldCheck size={28} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">ভূমিকা নির্বাচন করুন</h3>
          <p className="text-sm text-gray-500 mt-1">
            আপনার একাধিক ভূমিকা রয়েছে। কোন ভূমিকায় প্রবেশ করতে চান?
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {roles.map((roleName) => {
            const config = ROLE_DISPLAY[roleName] || {
              label: roleName,
              color: "bg-gray-100 text-gray-700 border-gray-200",
              dot: "bg-gray-400",
            };
            const isSelected = selected === roleName;

            return (
              <button
                key={roleName}
                onClick={() => setSelected(roleName)}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-all duration-150 ${isSelected
                    ? "border-primary-500 bg-primary-50 shadow-md shadow-primary-100"
                    : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${config.dot}`} />
                  <span className="font-semibold text-gray-800">{config.label}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${config.color}`}>
                    {roleName}
                  </span>
                </div>
                {isSelected && <CheckCircle2 size={20} className="text-primary-600 shrink-0" />}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleConfirm}
          disabled={!selected || isRedirecting}
          className="w-full bg-primary-600 text-white py-3.5 rounded-2xl font-bold hover:bg-primary-700 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {isRedirecting
            ? <><Loader2 size={18} className="animate-spin" /> <span>অপেক্ষা করুন...</span></>
            : <><ChevronRight size={18} /> <span>প্রবেশ করুন</span></>
          }
        </button>
      </div>
    </div>
  );
};

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const activeRole = useSelector(selectActiveRole);
  const userRoles = useSelector(selectUserRoles, shallowEqual);

  const [showRoleModal, setShowRoleModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated && activeRole) {
      router.replace(ROLE_ROUTES[activeRole] || "/dashboard");
    }
  }, [isAuthenticated, activeRole, router]);

  useEffect(() => {
    dispatch(clearError());
    // If the user landed on login page, their session is invalid.
    // Clear any stale localStorage so Redux doesn't rehydrate dead state.
    clearAuthFromStorage();
  }, [dispatch]);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    const result = await dispatch(loginThunk(data));
    if (loginThunk.fulfilled.match(result)) {
      const { needsRoleSelection } = result.payload;
      if (needsRoleSelection) {
        setShowRoleModal(true);
      }
    }
  };

  const handleRoleSelect = async (roleName) => {
    await dispatch(selectRoleThunk(roleName));
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-18 bg-primary-50">

      {showRoleModal && (
        <RoleSelectionModal
          roles={userRoles}
          onSelect={handleRoleSelect}
          onClose={() => setShowRoleModal(false)}
        />
      )}

      <div className="max-w-md w-full">
        <button
          onClick={() => router.back()}
          className="absolute flex items-center gap-2 text-primary-700 hover:text-primary-900 font-medium transition-all"
        >
          <div className="p-2 rounded-xl shadow-sm"><ArrowLeft size={20} /></div>
        </button>

        <div className="text-center mb-10">
          {/* <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-600 text-white rounded-3xl mb-6 shadow-xl shadow-primary-200">
            <ShieldCheck size={40} />
          </div> */}
          <Link href={"/"} className="text-4xl font-extrabold text-primary-900 tracking-tight mb-2">
            স্কুল পোর্টাল
          </Link>
          <p className="text-primary-700 pt-2 font-medium">স্কুল ম্যানেজমেন্ট সিস্টেম</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-primary-900/10 border border-primary-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">লগইন করুন</h2>

          {error && (
            <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">ইমেইল</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  {...register("email", {
                    required: "ইমেইল দিন",
                    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "সঠিক ইমেইল দিন" },
                  })}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all border ${errors.email ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                  placeholder="admin@school.com"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle size={12} />{errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">পাসওয়ার্ড</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  {...register("password", {
                    required: "পাসওয়ার্ড দিন",
                    minLength: { value: 6, message: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে" },
                  })}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all border ${errors.password ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle size={12} />{errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isLoading
                ? <><Loader2 size={20} className="animate-spin" /><span>অপেক্ষা করুন...</span></>
                : <><span>প্রবেশ করুন</span><ChevronRight size={20} /></>
              }
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-gray-400 text-sm">
          &copy; ২০২৬ স্কুল ম্যানেজমেন্ট সিস্টেম - সকল স্বত্ব সংরক্ষিত।
        </p>
      </div>
    </div>
  );
};

export default Login;
