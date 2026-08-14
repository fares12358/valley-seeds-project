"use client";

import { Trash2, ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import FieldEditor from "./FieldEditor";

/**
 * MessageRow — single contact submission row with expand/collapse
 */
export default function MessageRow({ message, onDelete, onMarkRead }) {
  return (
    <div
      className={`border rounded-xl overflow-hidden transition-colors ${
        message.read ? "border-gray-100 bg-white" : "border-[#037338]/20 bg-[#037338]/3"
      }`}
    >
      <div
        className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => onMarkRead?.(message._id)}
      >
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${message.read ? "bg-gray-300" : "bg-[#96C422]"}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-semibold text-gray-800">{message.name}</span>
            <span className="text-xs text-gray-400">{message.email}</span>
            {message.subject && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{message.subject}</span>
            )}
          </div>
          <p className="text-sm text-gray-500 truncate mt-0.5">{message.message}</p>
        </div>
        <span className="text-xs text-gray-400 flex-shrink-0">{message.date}</span>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete?.(message._id); }}
          className="p-1.5 text-gray-400 hover:text-[#d4183d] hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
          title="Delete message"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
