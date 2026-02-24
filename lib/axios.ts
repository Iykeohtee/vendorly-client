import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor for debugging
axiosInstance.interceptors.request.use(
  (config) => {
    if (!config.url?.includes("/auth/refresh")) {
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling and token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loop - don't retry refresh requests
    if (originalRequest.url?.includes("/auth/refresh")) {
      // Refresh failed - redirect to login
      console.log("🔄 Refresh token failed, redirecting to login");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    // If error is 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log("🔄 Attempting to refresh token...");
        // Attempt to refresh tokens
        await axiosInstance.post("/auth/refresh");

        console.log("✅ Token refreshed, retrying original request");
        // Retry original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.log("❌ Refresh failed, redirecting to login");
        // Refresh failed, redirect to login
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
