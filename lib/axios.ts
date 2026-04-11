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

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthRoute =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/verify-email");

    if (isAuthRoute) {
      return Promise.reject(error);
    }

    // Prevent infinite loop
    if (originalRequest.url?.includes("/auth/refresh")) {
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // 🚀 If already refreshing → wait
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
