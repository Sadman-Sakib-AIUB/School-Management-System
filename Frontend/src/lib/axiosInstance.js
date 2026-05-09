import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9090/api/v1";

/**
 * Axios instance configured for the school management API.
 * - withCredentials: true ensures httpOnly cookies are sent automatically.
 * - Response interceptor handles silent token refresh on 401.
 * - On refresh failure: clears ALL local state before redirecting to login.
 */
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// ---------------------- HELPERS ----------------------
/**
 * Clears all localStorage auth keys and redirects to login.
 * Called when refresh token is also expired — session is truly dead.
 */
const clearSessionAndRedirect = () => {
  try {
    localStorage.removeItem("school_user");
    localStorage.removeItem("school_active_role");
    localStorage.removeItem("school_active_tab");
  } catch { /* ignore */ }

  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

//---------------------- RESPONSE INTERCEPTOR ----------------------
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve()));
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {

      // If the failing request IS the refresh endpoint itself,
      // session is truly expired — clear everything and redirect
      if (originalRequest.url?.includes("/auths/refresh")) {
        processQueue(error);
        isRefreshing = false;
        clearSessionAndRedirect();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt silent refresh — refreshToken cookie sent automatically
        await axiosInstance.post("/auths/refresh");
        processQueue(null);
        isRefreshing = false;
        // Retry the original request with the new accessToken
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed — both tokens are expired
        processQueue(refreshError);
        isRefreshing = false;
        clearSessionAndRedirect();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;