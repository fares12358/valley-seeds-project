"use client";

import { useState, useMemo } from "react";
import {
  Inbox, Trash2, ChevronDown, ChevronUp,
  Loader2, MailOpen, Mail as MailClosed,
  Download, Calendar, X, ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import EmptyState   from "@/components/dashboard/EmptyState";
import ConfirmModal from "@/components/dashboard/ConfirmModal";
import { useMessagesContext } from "@/context/MessagesContext";
import {
  exportMessagesToExcel,
  filterByDateRange,
  getQuickRangeDates,
} from "@/utils/exportExcel";

/* ─── constants ─────────────────────────────────────────────── */

const READ_FILTERS  = ["All", "Unread", "Read"];
const QUICK_RANGES  = [
  { key: "alltime", label: "All Time"    },
  { key: "90d",     label: "Last 90 Days" },
  { key: "30d",     label: "Last 30 Days" },
  { key: "7d",      label: "Last 7 Days"  },
  { key: "today",   label: "Today"        },
  { key: "custom",  label: "Custom Range" },
];

/* ─── helpers ───────────────────────────────────────────────── */

function formatDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleString("en-EG", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit", timeZone: "Africa/Cairo",
    });
  } catch { return dateStr; }
}

/** format a Date as YYYY-MM-DD for <input type="date"> */
function toInputDate(date) {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/* ─── ExportPanel ────────────────────────────────────────────── */

function ExportPanel({ messages, onClose }) {
  const [quickRange,  setQuickRange]  = useState("alltime");
  const [customFrom,  setCustomFrom]  = useState("");
  const [customTo,    setCustomTo]    = useState("");
  const [exporting,   setExporting]   = useState(false);

  const isCustom = quickRange === "custom";

  /* preview count */
  const previewCount = useMemo(() => {
    let from = null, to = null;
    if (isCustom) {
      from = customFrom ? new Date(customFrom)                          : null;
      to   = customTo   ? new Date(customTo + "T23:59:59.999")         : null;
    } else {
      ({ from, to } = getQuickRangeDates(quickRange));
    }
    return filterByDateRange(messages, from, to).length;
  }, [messages, quickRange, customFrom, customTo, isCustom]);

  const handleExport = () => {
    setExporting(true);
    try {
      let from = null, to = null;
      if (isCustom) {
        from = customFrom ? new Date(customFrom)                        : null;
        to   = customTo   ? new Date(customTo + "T23:59:59.999")       : null;
      } else {
        ({ from, to } = getQuickRangeDates(quickRange));
      }

      const subset = filterByDateRange(messages, from, to);
      if (subset.length === 0) {
        toast.error("No messages in the selected range.");
        return;
      }

      const rangeLabel = isCustom
        ? `${customFrom || "start"}_to_${customTo || "now"}`
        : quickRange;

      exportMessagesToExcel(subset, `valley-seeds-leads_${rangeLabel}`);
      toast.success(`Exported ${subset.length} message${subset.length !== 1 ? "s" : ""}`);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    /* backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-[2px]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden">

        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#037338]/10 flex items-center justify-center">
              <Download size={15} className="text-[#037338]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Export Messages</p>
              <p className="text-xs text-gray-400">Download as Excel (.xls)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">

          {/* quick range pills */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2.5 uppercase tracking-wide">Date Range</p>
            <div className="grid grid-cols-3 gap-2">
              {QUICK_RANGES.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setQuickRange(key)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium transition-all border ${
                    quickRange === key
                      ? "bg-[#037338] text-white border-[#037338] shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[#037338]/40 hover:text-[#037338]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* custom date pickers */}
          {isCustom && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  From
                </label>
                <div className="relative">
                  <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="date"
                    value={customFrom}
                    max={customTo || toInputDate(new Date())}
                    onChange={(e) => setCustomFrom(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#037338]/25 focus:border-[#037338] transition-colors bg-gray-50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  To
                </label>
                <div className="relative">
                  <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="date"
                    value={customTo}
                    min={customFrom || undefined}
                    max={toInputDate(new Date())}
                    onChange={(e) => setCustomTo(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#037338]/25 focus:border-[#037338] transition-colors bg-gray-50"
                  />
                </div>
              </div>
            </div>
          )}

          {/* preview badge */}
          <div className="flex items-center justify-between bg-[#037338]/5 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2">
              <Inbox size={14} className="text-[#037338]" />
              <span className="text-xs text-gray-600">Messages to export</span>
            </div>
            <span className={`text-sm font-bold ${previewCount === 0 ? "text-gray-400" : "text-[#037338]"}`}>
              {previewCount}
            </span>
          </div>

          {/* action buttons */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={exporting || previewCount === 0}
              className="flex-1 py-2.5 text-sm font-semibold text-white bg-[#037338] rounded-xl hover:bg-[#025c2e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {exporting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Download size={14} />
              )}
              {exporting ? "Exporting…" : "Export"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── MessagesPage ───────────────────────────────────────────── */

export default function MessagesPage() {
  const { messages, loading, error, unreadCount, markRead, toggleRead, deleteMsg } =
    useMessagesContext();

  const [filter,       setFilter]       = useState("All");
  const [expanded,     setExpanded]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting,     setDeleting]     = useState(false);
  const [showExport,   setShowExport]   = useState(false);

  const filtered = messages.filter((m) => {
    if (filter === "Unread") return !m.read;
    if (filter === "Read")   return  m.read;
    return true;
  });

  const handleRowClick = async (id) => {
    const msg = messages.find((m) => m._id === id);
    if (msg && !msg.read) await markRead(id);
    setExpanded((prev) => (prev === id ? null : id));
  };

  const handleToggleRead = async (e, id) => {
    e.stopPropagation();
    await toggleRead(id);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteMsg(deleteTarget);
      if (expanded === deleteTarget) setExpanded(null);
      toast.success("Message deleted");
    } catch {
      toast.error("Failed to delete message");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={24} className="animate-spin text-[#037338]" />
      </div>
    );
  }
  if (error) return <p className="text-red-500 text-sm p-4">{error}</p>;

  return (
    <div className="space-y-6">

      {/* ── toolbar ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">

        {/* read-state filter tabs */}
        <div className="inline-flex bg-gray-100 rounded-xl p-1 gap-1">
          {READ_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === f
                  ? "bg-white text-[#037338] shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {f}
              {f === "Unread" && unreadCount > 0 && (
                <span className="ml-1.5 bg-[#96C422] text-[#012a14] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">
            {filtered.length} {filtered.length === 1 ? "message" : "messages"}
          </span>

          {/* export button */}
          <button
            onClick={() => setShowExport(true)}
            disabled={messages.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#037338] border border-[#037338]/30 bg-[#037338]/5 rounded-xl hover:bg-[#037338]/10 hover:border-[#037338]/60 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <Download size={14} />
            Export Excel
          </button>
        </div>
      </div>

      {/* ── list ── */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Inbox}
          heading="No messages"
          body={
            filter === "All"
              ? "Contact form submissions will appear here."
              : `No ${filter.toLowerCase()} messages.`
          }
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((message) => (
            <div
              key={message._id}
              className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                message.read
                  ? "border-gray-100 bg-white"
                  : "border-[#037338]/20 bg-[#037338]/[0.03]"
              }`}
            >
              <div
                className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50/80 transition-colors"
                onClick={() => handleRowClick(message._id)}
              >
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    message.read ? "bg-gray-200" : "bg-[#96C422]"
                  }`}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-sm ${
                        message.read ? "font-medium text-gray-700" : "font-semibold text-gray-900"
                      }`}
                    >
                      {message.name}
                    </span>
                    <span className="text-xs text-gray-400">{message.email}</span>
                    {message.subject && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {message.subject}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-sm truncate mt-0.5 ${
                      message.read ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {message.message}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-xs text-gray-400 hidden sm:block mr-1">
                    {formatDate(message.createdAt)}
                  </span>
                  <button
                    onClick={(e) => handleToggleRead(e, message._id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      message.read
                        ? "text-gray-300 hover:text-[#037338] hover:bg-[#037338]/8"
                        : "text-[#037338] hover:text-gray-400 hover:bg-gray-100"
                    }`}
                    title={message.read ? "Mark as unread" : "Mark as read"}
                  >
                    {message.read ? <MailClosed size={15} /> : <MailOpen size={15} />}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteTarget(message._id); }}
                    className="p-1.5 text-gray-300 hover:text-[#d4183d] hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                  {expanded === message._id
                    ? <ChevronUp size={16} className="text-gray-400" />
                    : <ChevronDown size={16} className="text-gray-400" />
                  }
                </div>
              </div>

              {expanded === message._id && (
                <div className="px-5 pb-5 border-t border-gray-100">
                  <div className="pt-4 space-y-3">
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-400">
                      <span>
                        <span className="font-medium text-gray-500">From:</span>{" "}
                        {message.name} &lt;{message.email}&gt;
                      </span>
                      {message.phone && (
                        <span>
                          <span className="font-medium text-gray-500">Phone:</span>{" "}
                          {message.phone}
                        </span>
                      )}
                      <span>
                        <span className="font-medium text-gray-500">Sent:</span>{" "}
                        {formatDate(message.createdAt)}
                      </span>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {message.message}
                    </div>
                    <a
                      href={`mailto:${message.email}?subject=Re: ${message.subject || "Your inquiry"}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-[#037338] hover:text-[#025c2e] transition-colors"
                    >
                      Reply via email →
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── modals ── */}
      {deleteTarget && (
        <ConfirmModal
          title="Delete this message?"
          message="This action cannot be undone."
          danger
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {showExport && (
        <ExportPanel
          messages={messages}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  );
}
