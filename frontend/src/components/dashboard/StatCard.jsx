"use client";

import Link from "next/link";

export default function StatCard({ icon: Icon, label, value, sub, color = "#037338", href }) {
  const inner = (
    <div className={`bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-start gap-4 transition-all duration-200 ${href ? "hover:border-[#037338]/20 hover:shadow-md cursor-pointer" : ""}`}>
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: color + "18" }}
      >
        <Icon size={20} style={{ color }} />
      </div>
      <div className="min-w-0">
        <div className="text-2xl font-bold text-gray-900 leading-none mb-1">{value}</div>
        <div className="text-sm font-medium text-gray-600">{label}</div>
        {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
      </div>
    </div>
  );

  if (href) return <Link href={href}>{inner}</Link>;
  return inner;
}
