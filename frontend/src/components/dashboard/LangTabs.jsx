"use client";

export default function LangTabs({ active, onChange }) {
  return (
    <div className="inline-flex bg-gray-100 rounded-xl p-1 gap-1">
      {[
        { key: "en", label: "English", native: "EN" },
        { key: "ar", label: "العربية", native: "AR" },
      ].map((lang) => (
        <button
          key={lang.key}
          onClick={() => onChange?.(lang.key)}
          className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
            active === lang.key
              ? "bg-white text-[#037338] shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
