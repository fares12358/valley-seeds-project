"use client";

/**
 * ConfirmModal — uses faux-viewport overlay (NOT position:fixed)
 * Required by the design system for embedded rendering environments.
 */
export default function ConfirmModal({ title, message, onConfirm, onCancel, danger = false }) {
  return (
    <div
      style={{ minHeight: "100vh" }}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
        {message && <p className="text-sm text-gray-500 mb-6">{message}</p>}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2 text-sm font-semibold rounded-lg text-white transition-colors ${
              danger
                ? "bg-[#d4183d] hover:bg-[#b01030]"
                : "bg-[#037338] hover:bg-[#025c2e]"
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
