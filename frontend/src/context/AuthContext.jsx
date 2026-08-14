"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "@/services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,      setUser]      = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get("/auth/me")
      .then(({ data }) => {
        if (data?.data) setUser(data.data);
        else setUser(null);
      })
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  // RULE R4: never navigate inside login() — hard nav is in login/page.jsx via navigating ref
  const login = useCallback(async (email, password) => {
    try {
      await api.post("/auth/login", { email, password });
      // Don't setUser — AuthProvider re-mounts on /dashboard and fetches /me fresh
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.code === "ERR_NETWORK"
          ? "Cannot connect to server. Make sure the backend is running."
          : "Invalid email or password");
      return { success: false, message };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore — server clears the cookie regardless
    } finally {
      setUser(null);
      window.location.href = "/dashboard/login";
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside <AuthProvider>");
  return ctx;
}

export default AuthContext;
