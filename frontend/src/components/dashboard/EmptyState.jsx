"use client";

export default function EmptyState({ icon: Icon, heading, body, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
          <Icon size={24} className="text-gray-400" />
        </div>
      )}
      <h3 className="text-base font-semibold text-gray-700 mb-1">{heading}</h3>
      {body && <p className="text-sm text-gray-400 max-w-xs">{body}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-5 px-5 py-2.5 rounded-xl bg-[#037338] text-white text-sm font-semibold hover:bg-[#025c2e] transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
