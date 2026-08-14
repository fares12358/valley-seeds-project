"use client";

export default function SaveBar({ isDirty, isSaving, onSave, onDiscard }) {
  if (!isDirty) return null;

  return (
    <div
      className="sticky bottom-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur-sm px-6 py-4"
      style={{ marginLeft: 0 }}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <p className="text-sm text-amber-600 font-medium flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
          You have unsaved changes
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={onDiscard}
            disabled={isSaving}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Discard
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="text-sm font-semibold px-5 py-2 rounded-lg bg-[#037338] text-white hover:bg-[#025c2e] transition-colors disabled:opacity-60 flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
