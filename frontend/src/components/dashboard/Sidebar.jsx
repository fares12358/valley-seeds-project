"use client";

import React, { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Layers, Info, CheckCircle, Target,
  Star, FlaskConical, Database, Mail, PanelBottom,
  Inbox, Settings, LogOut, X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const NAV_SECTIONS = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
];
const NAV_CONTENT = [
  { label: "Hero",            href: "/dashboard/hero",       icon: Layers       },
  { label: "About",           href: "/dashboard/about",      icon: Info         },
  { label: "Why Us",          href: "/dashboard/why-us",     icon: CheckCircle  },
  { label: "Mission",         href: "/dashboard/mission",    icon: Target       },
  { label: "Core Values",     href: "/dashboard/services",   icon: Star         },
  { label: "Technology",      href: "/dashboard/technology", icon: FlaskConical },
  { label: "ERP",             href: "/dashboard/erp",        icon: Database     },
  { label: "Contact Section", href: "/dashboard/contact",    icon: Mail         },
  { label: "Footer",          href: "/dashboard/footer",     icon: PanelBottom  },
];
const NAV_ADMIN = [
  { label: "Messages", href: "/dashboard/messages", icon: Inbox,    badge: null },
  { label: "Settings", href: "/dashboard/settings", icon: Settings              },
];

function NavItem({ item, active, onClick }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
        transition-all duration-150 group relative ${
          active
            ? "bg-[#037338]/25 text-white border-l-[3px] border-[#037338] pl-[calc(0.75rem-3px)]"
            : "text-white/60 hover:text-white hover:bg-white/8"
        }`}
    >
      <Icon size={17} className={active ? "text-[#96C422]" : "text-white/50 group-hover:text-white/80"} />
      <span className="flex-1 truncate">{item.label}</span>
      {item.badge != null && item.badge > 0 && (
        <span className="ml-auto bg-[#96C422] text-[#012a14] text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
          {item.badge > 99 ? "99+" : item.badge}
        </span>
      )}
    </Link>
  );
}

// Memoised — props only change when mobileOpen/onMobileClose change,
// not on every pathname change in the parent DashboardShell
const Sidebar = memo(function Sidebar({ mobileOpen, onMobileClose }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    onMobileClose?.();
    logout();
  };

  const isActive = (href) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-4 py-5 border-b border-white/10 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-32 h-8">
            <Image src="/images/logo-white.svg" alt="Valley Seeds" fill className="object-contain object-left" priority />
          </div>
        </Link>
        <button onClick={onMobileClose} className="lg:hidden text-white/50 hover:text-white p-1">
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV_SECTIONS.map((item) => (
          <NavItem key={item.href} item={item} active={isActive(item.href)} onClick={onMobileClose} />
        ))}
        <div className="pt-4 pb-1 px-3">
          <span className="text-[10px] tracking-[0.15em] uppercase text-white/30 font-medium">Content</span>
        </div>
        {NAV_CONTENT.map((item) => (
          <NavItem key={item.href} item={item} active={isActive(item.href)} onClick={onMobileClose} />
        ))}
        <div className="pt-4 pb-1 px-3">
          <span className="text-[10px] tracking-[0.15em] uppercase text-white/30 font-medium">Admin</span>
        </div>
        {NAV_ADMIN.map((item) => (
          <NavItem key={item.href} item={item} active={isActive(item.href)} onClick={onMobileClose} />
        ))}
      </nav>

      <div className="border-t border-white/10 px-4 py-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-[#037338]/40 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-[#96C422]">{user?.email?.[0]?.toUpperCase() || "A"}</span>
          </div>
          <span className="text-xs text-white/50 truncate flex-1">{user?.email || "Admin"}</span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 text-xs text-white/40 hover:text-white/80 transition-colors py-1.5 px-2 rounded-lg hover:bg-white/8"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-64 bg-[#012a14] z-30">
        <SidebarContent />
      </aside>
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onMobileClose} />
          <aside className="fixed inset-y-0 left-0 w-72 bg-[#012a14] z-50 flex flex-col lg:hidden">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
});

export default Sidebar;
