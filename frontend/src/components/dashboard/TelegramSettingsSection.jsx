"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Loader2, Send, Hash, Link2, CheckCircle2, XCircle } from "lucide-react";
import api from "@/services/api";

const DEFAULTS = { chatId: "", tokenSet: false };

const INPUT = "w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm " +
  "focus:outline-none focus:border-[#037338] focus:bg-white focus:shadow-[0_0_0_4px_rgba(3,115,56,0.08)] transition-all";

export default function TelegramSettingsSection() {
  const [cfg,          setCfg]          = useState(DEFAULTS);
  const [saved,        setSaved]        = useState(DEFAULTS);
  const [token,        setToken]        = useState(""); // never pre-filled — write-only field
  const [webhookUrl,   setWebhookUrl]   = useState("");
  const [webhookInfo,  setWebhookInfo]  = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [isSaving,     setIsSaving]     = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isTesting,    setIsTesting]    = useState(false);

  const isDirty = token !== "" || cfg.chatId !== saved.chatId;

  useEffect(() => {
    api.get("/settings/telegram")
      .then(({ data }) => {
        const c = { ...DEFAULTS, ...data.data };
        setCfg(c);
        setSaved(c);
      })
      .catch(() => toast.error("Failed to load Telegram settings"))
      .finally(() => setLoading(false));

    api.get("/telegram/webhook-info")
      .then(({ data }) => setWebhookInfo(data.data))
      .catch(() => {}); // best-effort — no token saved yet is a normal state
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = { chatId: cfg.chatId };
      if (token) payload.botToken = token; // omit entirely when blank — backend keeps the existing token

      const { data } = await api.put("/settings/telegram", payload);
      const next = { ...DEFAULTS, ...data.data };
      setCfg(next);
      setSaved(next);
      setToken("");
      toast.success("Telegram settings saved!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save Telegram settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegisterWebhook = async () => {
    setIsRegistering(true);
    try {
      await api.post("/telegram/register-webhook", webhookUrl ? { webhookUrl } : {});
      const { data } = await api.get("/telegram/webhook-info");
      setWebhookInfo(data.data);
      toast.success("Webhook registered!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to register webhook");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    try {
      await api.get("/telegram/test");
      toast.success("Test message sent — check your Telegram chat!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send test message");
    } finally {
      setIsTesting(false);
    }
  };

  if (loading) {
    return (
      <section className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-center py-12">
        <Loader2 size={20} className="animate-spin text-[#037338]" />
      </section>
    );
  }

  const webhookRegistered = Boolean(webhookInfo?.url);
  const canTest = (cfg.tokenSet || token) && cfg.chatId;

  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
      <div>
        <h2 className="text-base font-semibold text-gray-800">Telegram Bot Settings</h2>
        <p className="text-sm text-gray-400 mt-1">
          Sends a Telegram message for every contact-form submission, in addition to email.
        </p>
      </div>

      <ol className="text-xs text-gray-500 space-y-1.5 list-decimal list-inside bg-gray-50 rounded-xl p-4">
        <li>Create a bot via <span className="font-medium text-gray-600">@BotFather</span> on Telegram and copy its token.</li>
        <li>Paste the token below and save.</li>
        <li>Enter your deployed server URL and click &quot;Register Webhook&quot;.</li>
        <li>Message your bot <span className="font-mono">/start</span> — it replies with your numeric chat ID.</li>
        <li>Paste that chat ID below, save again, then send a test message.</li>
      </ol>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="relative">
          <Send size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder={cfg.tokenSet ? "•••••••• (leave blank to keep current)" : "Bot token from @BotFather"}
            className={INPUT + " pl-10"}
            autoComplete="new-password"
          />
          <span className="block text-xs mt-1 ml-1">
            {cfg.tokenSet ? (
              <span className="text-emerald-600 flex items-center gap-1"><CheckCircle2 size={12} /> Token is set</span>
            ) : (
              <span className="text-amber-600">No token saved yet</span>
            )}
          </span>
        </div>
        <div className="relative">
          <Hash size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
          <input
            type="text"
            value={cfg.chatId || ""}
            onChange={(e) => setCfg((prev) => ({ ...prev, chatId: e.target.value }))}
            placeholder="Numeric chat ID (from /start)"
            className={INPUT + " pl-10"}
          />
          <span className="block text-xs text-gray-400 mt-1 ml-1">Destination chat ID</span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
        {isDirty && <span className="text-xs text-amber-600 mr-auto">Unsaved changes</span>}
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || !isDirty}
          className="text-sm font-semibold px-5 py-2 rounded-lg bg-[#037338] text-white hover:bg-[#025c2e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            "Save Telegram Settings"
          )}
        </button>
      </div>

      <div className="space-y-3 pt-2 border-t border-gray-100">
        <div className="relative">
          <Link2 size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
          <input
            type="url"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://your-backend.example.com (defaults to WEBHOOK_BASE_URL)"
            className={INPUT + " pl-10"}
          />
          <span className="block text-xs text-gray-400 mt-1 ml-1">Server URL for the Telegram webhook</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className={`flex items-center gap-2 text-xs font-medium ${webhookRegistered ? "text-emerald-600" : "text-gray-400"}`}>
            {webhookRegistered ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
            {webhookRegistered ? "Webhook registered" : "Webhook not registered"}
            {webhookInfo?.last_error_message && (
              <span className="text-red-500">— {webhookInfo.last_error_message}</span>
            )}
          </div>
          <button
            type="button"
            onClick={handleRegisterWebhook}
            disabled={isRegistering || !(cfg.tokenSet || token)}
            className="text-sm font-semibold px-4 py-2 rounded-lg border-2 border-gray-200 text-gray-700 hover:border-[#037338] hover:text-[#037338] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRegistering ? "Registering..." : "Register Webhook"}
          </button>
        </div>
      </div>

      <div className="flex justify-end pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={handleTest}
          disabled={isTesting || !canTest}
          className="text-sm font-semibold px-4 py-2 rounded-lg border-2 border-gray-200 text-gray-700 hover:border-[#037338] hover:text-[#037338] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isTesting ? "Sending..." : "Send Test Message"}
        </button>
      </div>
    </section>
  );
}
