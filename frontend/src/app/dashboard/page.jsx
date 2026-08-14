"use client";

import Link from "next/link";
import {
  Layers, Info, CheckCircle, Target,
  Star, FlaskConical, Database, Mail, PanelBottom,
  Inbox, Settings, ArrowRight, FileText, MessageSquare,
} from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import { useMessagesContext } from "@/context/MessagesContext";

const SECTIONS = [
  { label: "Hero",            href: "/dashboard/hero",       icon: Layers,      desc: "Heading, subheading, CTAs, stats, hero image" },
  { label: "About",           href: "/dashboard/about",      icon: Info,        desc: "Who we are, story, images" },
  { label: "Why Us",          href: "/dashboard/why-us",     icon: CheckCircle, desc: "5 reasons with titles and descriptions" },
  { label: "Mission & Vision",href: "/dashboard/mission",    icon: Target,      desc: "Vision card and mission card" },
  { label: "Core Values",     href: "/dashboard/services",   icon: Star,        desc: "Value cards with images" },
  { label: "Technology",      href: "/dashboard/technology", icon: FlaskConical,desc: "R&D and technical support cards" },
  { label: "ERP",             href: "/dashboard/erp",        icon: Database,    desc: "Digital infrastructure section" },
  { label: "Contact Section", href: "/dashboard/contact",    icon: Mail,        desc: "Form labels, info cards, success text" },
  { label: "Footer",          href: "/dashboard/footer",     icon: PanelBottom, desc: "Tagline, links, services, contact" },
  { label: "Settings",        href: "/dashboard/settings",   icon: Settings,    desc: "Brand colors, social links, logos" },
];

export default function DashboardOverviewPage() {
  // Uses shared MessagesContext — no extra API call (MessagesProvider already fetched)
  const { messages, loading, unreadCount } = useMessagesContext();

  const totalMessages = messages.length;
  const latestMessage = messages[0];

  const latestDate = latestMessage
    ? new Date(latestMessage.createdAt).toLocaleDateString("en-EG", {
        day: "2-digit", month: "short", year: "numeric",
        timeZone: "Africa/Cairo",
      })
    : null;

  return (
    <div className="space-y-8">

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FileText}
          label="Sections managed"
          value="10"
          sub="All content sections"
          color="#037338"
        />
        <StatCard
          icon={Inbox}
          label="Unread messages"
          value={loading ? "…" : String(unreadCount)}
          sub={unreadCount > 0 ? "Needs your attention" : "All caught up"}
          color="#96C422"
          href="/dashboard/messages"
        />
        <StatCard
          icon={MessageSquare}
          label="Total messages"
          value={loading ? "…" : String(totalMessages)}
          sub={totalMessages === 0 ? "No submissions yet" : "Contact submissions"}
          color="#037338"
          href="/dashboard/messages"
        />
        <StatCard
          icon={Settings}
          label="Latest message"
          value={loading ? "…" : (latestDate || "—")}
          sub={latestMessage ? latestMessage.name : "No messages yet"}
          color="#96C422"
          href="/dashboard/messages"
        />
      </div>

      {/* Unread preview panel */}
      {!loading && unreadCount > 0 && (
        <div className="bg-[#037338]/5 border border-[#037338]/15 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#96C422]" />
              <span className="text-sm font-semibold text-[#037338]">
                {unreadCount} unread {unreadCount === 1 ? "message" : "messages"}
              </span>
            </div>
            <Link href="/dashboard/messages" className="text-xs font-medium text-[#037338] hover:underline">
              View all →
            </Link>
          </div>
          <div className="space-y-2">
            {messages.filter((m) => !m.read).slice(0, 3).map((m) => (
              <Link
                key={m._id}
                href="/dashboard/messages"
                className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 hover:shadow-sm transition-all border border-[#037338]/10"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-gray-800">{m.name}</span>
                  <span className="text-xs text-gray-400 ml-2">{m.email}</span>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{m.message}</p>
                </div>
                <ArrowRight size={14} className="text-[#037338] flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quick access grid */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Content sections
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.href}
                href={section.href}
                className="group flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-5 hover:border-[#037338]/20 hover:shadow-sm transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-[#037338]/8 flex items-center justify-center flex-shrink-0 group-hover:bg-[#037338]/15 transition-colors">
                  <Icon size={18} className="text-[#037338]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-800 group-hover:text-[#037338] transition-colors">
                    {section.label}
                  </div>
                  <div className="text-xs text-gray-400 truncate mt-0.5">{section.desc}</div>
                </div>
                <ArrowRight size={16} className="text-gray-300 group-hover:text-[#037338] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
