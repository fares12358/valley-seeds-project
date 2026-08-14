"use client";

import Link from "next/link";
import { Menu, ExternalLink } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function TopBar({ title, onMenuClick }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 h-16 bg-white border-b border-gray-200 flex items-center px-4 sm:px-6 gap-4">
      {/* Mobile hamburger */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 -ml-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Page title */}
      <h1 className="text-base sm:text-lg font-semibold text-gray-900 flex-1 truncate">
        {title}
      </h1>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 text-sm text-[#037338] font-medium hover:text-[#025c2e] transition-colors"
        >
          View site
          <ExternalLink size={14} />
        </Link>

        <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-[#037338]/10 flex items-center justify-center">
            <span className="text-xs font-bold text-[#037338]">
              {user?.email?.[0]?.toUpperCase() || "A"}
            </span>
          </div>
          <span className="hidden sm:block text-sm text-gray-600 max-w-[160px] truncate">
            {user?.email || "Admin"}
          </span>
        </div>
      </div>
    </header>
  );
}
