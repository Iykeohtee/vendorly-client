import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 🔒 Refresh control
let isRefreshing = false;
let refreshSubscribers: ((value?: unknown) => void)[] = [];

function onRefreshed() {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
}

function addSubscriber(cb: () => void) {
  refreshSubscribers.push(cb);
}

// Helper function to check if URL is an auth endpoint that shouldn't trigger refresh
const isAuthEndpoint = (url: string | undefined): boolean => {
  if (!url) return false;
  
  const authPaths = [
    "/auth/login",
    "/auth/signup",
    "/auth/register",
    "/auth/verify-email",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/refresh",
    "/auth/logout",
    "/auth/me",
  ];
  
  return authPaths.some(path => url.includes(path));
};

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh for all auth-related endpoints
    if (isAuthEndpoint(originalRequest.url)) {
      return Promise.reject(error);
    }

    // Prevent infinite loop on refresh endpoint itself
    if (originalRequest.url?.includes("/auth/refresh")) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    // Only handle 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If already refreshing, wait for it to complete
      if (isRefreshing) {
        return new Promise((resolve) => {
          addSubscriber(() => {
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        console.log("🔄 Refreshing token...");
        await axiosInstance.post("/auth/refresh");
        console.log("✅ Refresh success");

        isRefreshing = false;
        onRefreshed();

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.log("❌ Refresh failed");
        isRefreshing = false;

        // Clear any stored auth data
        localStorage.removeItem("accessToken");
        
        // Redirect to login only if not already there
        if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;