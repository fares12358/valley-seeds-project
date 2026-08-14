import axios from "axios";

const api = axios.create({
  baseURL:         process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  timeout:         10000,
});

// 401 interceptor — redirect to login ONLY when not already on a public auth page
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      typeof window !== "undefined"
    ) {
      const pathname = window.location.pathname;

      const isDashboardPage = pathname.startsWith("/dashboard");
      const isAuthPage =
        pathname.includes("/dashboard/login") ||
        pathname.includes("/dashboard/forgot-password") ||
        pathname.includes("/dashboard/reset-password");

      // Only redirect if we're inside the dashboard AND not already on a login page
      if (isDashboardPage && !isAuthPage) {
        window.location.href = "/dashboard/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
