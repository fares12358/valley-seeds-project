"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { MessagesProvider } from "@/context/MessagesContext";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";

const PAGE_TITLES = {
  "/dashboard":            "Overview",
  "/dashboard/hero":       "Hero Section",
  "/dashboard/about":      "About Section",
  "/dashboard/why-us":     "Why Us Section",
  "/dashboard/mission":    "Mission & Vision",
  "/dashboard/services":   "Core Values",
  "/dashboard/technology": "Technology Section",
  "/dashboard/erp":        "ERP Section",
  "/dashboard/contact":    "Contact Section",
  "/dashboard/footer":     "Footer",
  "/dashboard/messages":   "Messages",
  "/dashboard/settings":   "Settings",
};

const PUBLIC_PATHS = [
  "/dashboard/login",
  "/dashboard/forgot-password",
  "/dashboard/reset-password",
];

// ── Inner shell — can safely call useAuth() because AuthProvider is above it ──
function DashboardShell({ children }) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isPublicPath = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Auth pages (login, forgot, reset) — render directly, no shell, no MessagesProvider
  if (isPublicPath) {
    return (
      <>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: { fontFamily: "Alexandria, sans-serif", fontSize: "14px" },
          }}
        />
        {children}
      </>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-[#037338]" />
      </div>
    );
  }

  if (!user) return null;

  const pageTitle = PAGE_TITLES[pathname] || "Dashboard";

  return (
    <MessagesProvider>
      <div className="min-h-screen bg-gray-50">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: { fontFamily: "Alexandria, sans-serif", fontSize: "14px" },
            success: { iconTheme: { primary: "#037338", secondary: "#fff" } },
          }}
        />
        <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
        <div className="lg:pl-64 flex flex-col min-h-screen">
          <TopBar title={pageTitle} onMenuClick={() => setMobileOpen(true)} />
          <main className="flex-1 flex flex-col">
            <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </MessagesProvider>
  );
}

// ── Outer layout — provides AuthProvider, renders shell inside ──
export default function DashboardLayout({ children }) {
  return (
    <AuthProvider>
      <DashboardShell>{children}</DashboardShell>
    </AuthProvider>
  );
}
