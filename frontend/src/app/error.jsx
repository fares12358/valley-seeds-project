"use client";

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <div className="text-[var(--brand-primary)] text-5xl mb-4">⚠</div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
      <p className="text-gray-500 text-sm mb-6 max-w-sm">
        {error?.message || "An unexpected error occurred. Please try again."}
      </p>
      <button
        onClick={reset}
        className="px-6 py-2.5 bg-[var(--brand-primary)] text-white rounded-xl text-sm font-medium hover:bg-[#025c2e] transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
