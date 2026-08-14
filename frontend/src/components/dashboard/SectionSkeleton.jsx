"use client";

export default function SectionSkeleton({ rows = 4 }) {
  return (
    <div className="space-y-8 animate-pulse">
      {[...Array(2)].map((_, s) => (
        <div key={s} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <div className="h-4 w-32 bg-gray-200 rounded-lg" />
          {[...Array(rows)].map((_, r) => (
            <div key={r} className="space-y-2">
              <div className="h-3 w-24 bg-gray-200 rounded" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="h-11 bg-gray-100 rounded-xl" />
                <div className="h-11 bg-gray-100 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
