import { createSlice } from "@reduxjs/toolkit";

// -------------------------------- LOCAL STORAGE HELPERS ------------------------
const STORAGE_KEY = "school_user";
const ACTIVE_ROLE_KEY = "school_active_role";

export const saveUserToStorage = (user) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch { /* fail silently */ }
};

export const loadUserFromStorage = () => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    return serialized ? JSON.parse(serialized) : null;
  } catch {
    return null;
  }
};

export const saveActiveRoleToStorage = (role) => {
  try {
    localStorage.setItem(ACTIVE_ROLE_KEY, role);
  } catch { /* fail silently */ }
};

export const loadActiveRoleFromStorage = () => {
  try {
    return localStorage.getItem(ACTIVE_ROLE_KEY) || null;
  } catch {
    return null;
  }
};

export const clearAuthFromStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ACTIVE_ROLE_KEY);
  } catch { /* fail silently */ }
};


const initialState = {
  user: null,           // { id, username, email, isActive, roles, institutionId }
  activeRole: null,     // string — the role context currently in use e.g. "PRINCIPAL"
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    /**
     * Called once on app boot by providers
     */
    initializeAuth: (state) => {
      const user = loadUserFromStorage();
      const activeRole = loadActiveRoleFromStorage();
      if (user) {
        state.user = user;
        state.isAuthenticated = true;
        // Restore activeRole only if it's still a valid role for this user
        const validRoles = user.roles?.map((r) => r.name) || [];
        state.activeRole = validRoles.includes(activeRole) ? activeRole : null;
      }
    },

    /**
     * Called after successful login.
     * Payload: the full user object from the API response.
     */
    setCredentials: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },

    /**
     * Sets the currently active role context.
     * Called after login (single role: auto, multi role: user picks)
     */
    setActiveRole: (state, action) => {
      state.activeRole = action.payload;
    },

    /**
     * Called after logout or session expiry.
     * Resets everything back to initial state.
     */
    clearCredentials: (state) => {
      state.user = null;
      state.activeRole = null;
      state.isAuthenticated = false;
      state.error = null;
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  initializeAuth,
  setCredentials,
  setActiveRole,
  clearCredentials,
  setLoading,
  setError,
  clearError,
} = authSlice.actions;

// -------------------------------- SELECTORS ----------------------------
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
export const selectActiveRole = (state) => state.auth.activeRole;

/**
 * Returns all role name strings for the current user.
 * e.g. ["PRINCIPAL", "TEACHER", "PARENT"]
 */
export const selectUserRoles = (state) =>
  state.auth.user?.roles?.map((r) => r.name) || [];

/**
 * Returns true if the user has more than one role.
 */
export const selectIsMultiRole = (state) =>
  (state.auth.user?.roles?.length || 0) > 1;

export default authSlice.reducer;