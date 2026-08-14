"use client";

export default function DashboardError({ error, reset }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mx-auto mb-4">
        <span className="text-red-500 text-xl font-bold">!</span>
      </div>
      <h2 className="text-base font-semibold text-gray-800 mb-2">Something went wrong</h2>
      <p className="text-sm text-gray-400 mb-6 max-w-xs">
        {error?.message || "Failed to load this section. Please try again."}
      </p>
      <button
        onClick={reset}
        className="px-5 py-2 bg-[#037338] text-white rounded-xl text-sm font-medium hover:bg-[#025c2e] transition-colors"
      >
        Retry
      </button>
    </div>
  );
}
