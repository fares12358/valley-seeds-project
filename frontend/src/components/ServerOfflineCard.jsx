"use client";

import { FaExclamationTriangle, FaSyncAlt } from "react-icons/fa";

// Full-page alert shown when GET /api/content fails outright (server unreachable,
// non-2xx response, etc). Deliberately doesn't use useTranslation() — content isn't
// loaded yet, so this stays in plain English rather than depending on the thing that's down.
export default function ServerOfflineCard({ onRetry }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white px-4">
      <div className="max-w-sm w-full bg-white border border-gray-100 rounded-2xl shadow-xl p-8 text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-5">
          <FaExclamationTriangle size={24} className="text-red-500" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Server is offline</h2>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          We couldn&apos;t reach the server right now. Please check your connection and try again in a moment.
        </p>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[var(--brand-primary)] hover:opacity-90 transition-opacity"
        >
          <FaSyncAlt size={13} />
          Retry
        </button>
      </div>
    </div>
  );
}
