"use client";

// Full-page loading state shown while the public site waits for GET /api/content.
// Deliberately doesn't use useTranslation() — content isn't loaded yet.
export default function ContentLoader() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white gap-4">
      <div
        className="w-10 h-10 rounded-full border-4 border-gray-200 animate-spin"
        style={{ borderTopColor: "var(--brand-primary)" }}
      />
      <p className="text-sm text-gray-400 tracking-wide">Loading…</p>
    </div>
  );
}
