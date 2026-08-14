"use client";

import { useRef, useState } from "react";
import { Upload, Trash2, RefreshCw, AlertCircle, Info } from "lucide-react";
import { useImageUpload } from "@/hooks/useImageUpload";
import { deleteImage } from "@/services/upload.service";
import ConfirmModal from "./ConfirmModal";

export default function ImageManager({
  value,        // { url, publicId } | null
  label = "Image",
  hint  = null, // e.g. "1920 × 1080 px · landscape" — shown as a size recommendation badge
  folder = "general",
  slot = null,  // stable slot id (e.g. "background", "card-0") — deterministic filename on the server
  onChange,     // (newValue: { url, publicId } | null) => void
}) {
  const inputRef = useRef(null);
  const { upload, uploading, progress, error: uploadError } = useImageUpload();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting,    setDeleting]    = useState(false);

  const isEmpty = !value?.url;

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    try {
      const result = await upload(file, folder, slot);
      onChange?.(result);
    } catch {
      // uploadError state shows the error
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      if (value?.publicId && value.publicId.trim()) {
        await deleteImage(value.publicId);
      }
      onChange?.(null);
    } catch (err) {
      console.error("Delete failed:", err.message);
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <div className="space-y-2">
        {/* Label row + size hint badge */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {label && <p className="text-sm font-medium text-gray-700">{label}</p>}
          {hint && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#037338]/6 border border-[#037338]/15 text-[11px] font-medium text-[#037338]/80 leading-none">
              <Info size={10} className="flex-shrink-0 opacity-70" />
              {hint}
            </span>
          )}
        </div>

        <div
          className={`relative rounded-xl border-2 overflow-hidden transition-colors ${
            isEmpty
              ? "border-dashed border-gray-200 bg-gray-50 hover:border-[#037338]/40 hover:bg-[#037338]/3 cursor-pointer"
              : "border-gray-200 bg-gray-50"
          }`}
          onClick={() => isEmpty && !uploading && inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />

          {uploading && (
            <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
              <div className="w-10 h-10 rounded-xl bg-[#037338]/10 flex items-center justify-center mb-3">
                <div className="w-5 h-5 border-2 border-[#037338]/30 border-t-[#037338] rounded-full animate-spin" />
              </div>
              <p className="text-sm font-medium text-gray-600 mb-3">Uploading...</p>
              <div className="w-full max-w-[200px] bg-gray-200 rounded-full h-1.5">
                <div className="bg-[#037338] h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {!uploading && isEmpty && (
            <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
                <Upload size={18} className="text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-500 mb-1">Click to upload</p>
              <p className="text-xs text-gray-400">PNG, JPG, WebP — max 5MB</p>
            </div>
          )}

          {!uploading && !isEmpty && (
            <div className="relative group">
              <img src={value.url} alt={label} className="w-full h-48 object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                  className="p-2 bg-white rounded-lg shadow text-gray-700 hover:text-[#037338] transition-colors"
                  title="Replace image"
                >
                  <RefreshCw size={16} />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setShowConfirm(true); }}
                  className="p-2 bg-white rounded-lg shadow text-gray-700 hover:text-[#d4183d] transition-colors"
                  title="Delete image"
                  disabled={deleting}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )}

          {uploadError && (
            <div className="px-4 py-2 bg-red-50 border-t border-red-200 flex items-center gap-2">
              <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
              <p className="text-xs text-red-600">{uploadError}</p>
            </div>
          )}
        </div>
      </div>

      {showConfirm && (
        <ConfirmModal
          title="Delete this image?"
          message="The image will be permanently removed from the server."
          danger
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
