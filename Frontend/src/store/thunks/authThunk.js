import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../lib/axiosInstance";
import {
  setCredentials,
  setActiveRole,
  clearCredentials,
  setLoading,
  setError,
  saveUserToStorage,
  saveActiveRoleToStorage,
  clearAuthFromStorage,
} from "../slices/authSlice";

/**
 * @description Login thunk.
 *
 * Single-role user  -> auto-sets activeRole, returns { user, needsRoleSelection: false }
 * Multi-role user   -> does NOT set activeRole, returns { user, needsRoleSelection: true }
 *                     Login page detects this and shows the role selection modal.
 */
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));

      const response = await axiosInstance.post("/auths/login", credentials);
      const { user } = response.data.data;
      // console.log(user);

      // Save user to localStorage for reload rehydration
      saveUserToStorage(user);

      // Store user in Redux
      dispatch(setCredentials(user));
      dispatch(setLoading(false));

      const roles = user.roles || [];
      const isMultiRole = roles.length > 1;

      if (!isMultiRole) {
        // Single role — auto select it, save to storage, ready to redirect
        const roleName = roles[0]?.name;
        dispatch(setActiveRole(roleName));
        saveActiveRoleToStorage(roleName);
        return { user, needsRoleSelection: false };
      }

      // Multiple roles — let the login page show the role selection modal
      return { user, needsRoleSelection: true };
    } catch (error) {
      const message =
        error.response?.data?.message || "লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।";
      dispatch(setError(message));
      return rejectWithValue(message);
    }
  }
);

/**
 * @description Role selection thunk.
 * Called when the user picks a role from the selection modal
 * or switches role from the Topbar.
 * Saves the chosen role to localStorage and updates Redux.
 */
export const selectRoleThunk = createAsyncThunk(
  "auth/selectRole",
  async (roleName, { dispatch }) => {
    dispatch(setActiveRole(roleName));
    saveActiveRoleToStorage(roleName);
    return roleName;
  }
);

/**
 * @description Logout thunk.
 * Clears httpOnly cookies (via API), localStorage, and Redux — all three.
 */
export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    try {
      await axiosInstance.post("/auths/logout");
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      clearAuthFromStorage();
      dispatch(clearCredentials());
    }
  }
);