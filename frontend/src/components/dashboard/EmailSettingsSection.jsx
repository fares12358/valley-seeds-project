"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Loader2, Mail, Lock, Server, Send, Inbox, CheckCircle2 } from "lucide-react";
import api from "@/services/api";

const DEFAULTS = {
  provider: "smtp", host: "", port: 587, secure: false,
  user: "", from: "", to: "", passSet: false,
};

const INPUT = "w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm " +
  "focus:outline-none focus:border-[#037338] focus:bg-white focus:shadow-[0_0_0_4px_rgba(3,115,56,0.08)] transition-all";

export default function EmailSettingsSection() {
  const [cfg,      setCfg]      = useState(DEFAULTS);
  const [saved,    setSaved]    = useState(DEFAULTS);
  const [pass,     setPass]     = useState(""); // never pre-filled — write-only field
  const [loading,  setLoading]  = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const isDirty = pass !== "" || JSON.stringify(cfg) !== JSON.stringify(saved);

  useEffect(() => {
    api.get("/settings/email")
      .then(({ data }) => {
        const c = { ...DEFAULTS, ...data.data };
        setCfg(c);
        setSaved(c);
      })
      .catch(() => toast.error("Failed to load email settings"))
      .finally(() => setLoading(false));
  }, []);

  const set = (key, val) => setCfg((prev) => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = { ...cfg };
      delete payload.passSet;
      if (pass) payload.pass = pass; // omit entirely when blank — backend keeps the existing password

      const { data } = await api.put("/settings/email", payload);
      const next = { ...DEFAULTS, ...data.data };
      setCfg(next);
      setSaved(next);
      setPass("");
      toast.success("Email settings saved!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save email settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-center py-12">
        <Loader2 size={20} className="animate-spin text-[#037338]" />
      </section>
    );
  }

  const isAppPassword = cfg.provider === "app_password";

  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
      <div>
        <h2 className="text-base font-semibold text-gray-800">Email Sending</h2>
        <p className="text-sm text-gray-400 mt-1">
          Configures the account contact-form and password-reset emails are sent from. Overrides the server&apos;s .env defaults.
        </p>
      </div>

      {/* Provider switch */}
      <div className="inline-flex bg-gray-100 rounded-xl p-1 gap-1">
        {[
          { key: "smtp",        label: "SMTP Server" },
          { key: "app_password", label: "App Password" },
        ].map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => set("provider", key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
              cfg.provider === key
                ? "bg-white text-[#037338] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {isAppPassword ? (
        <p className="text-xs text-gray-400 -mt-2">
          Uses Gmail&apos;s SMTP server (smtp.gmail.com:587). Generate an App Password from your Google Account →
          Security → 2-Step Verification → App passwords, and paste it below (not your normal Gmail password).
        </p>
      ) : (
        <p className="text-xs text-gray-400 -mt-2">
          Connect to any SMTP/IMAP mail provider&apos;s outgoing server using its host, port, and credentials.
        </p>
      )}

      {!isAppPassword && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="relative sm:col-span-2">
            <Server size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
            <input type="text" value={cfg.host || ""} onChange={(e) => set("host", e.target.value)} placeholder="smtp.yourprovider.com" className={INPUT + " pl-10"} />
            <span className="block text-xs text-gray-400 mt-1 ml-1">SMTP host</span>
          </div>
          <div>
            <input type="number" value={cfg.port || 587} onChange={(e) => set("port", e.target.value)} placeholder="587" className={INPUT} />
            <span className="block text-xs text-gray-400 mt-1 ml-1">Port</span>
          </div>
          <label className="flex items-center gap-2 sm:col-span-3 cursor-pointer select-none">
            <input type="checkbox" checked={Boolean(cfg.secure)} onChange={(e) => set("secure", e.target.checked)} className="w-4 h-4 accent-[#037338]" />
            <span className="text-sm text-gray-600">Use SSL/TLS (usually on for port 465, off for 587)</span>
          </label>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="relative">
          <Mail size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
          <input type="email" value={cfg.user || ""} onChange={(e) => set("user", e.target.value)} placeholder="you@example.com" className={INPUT + " pl-10"} />
          <span className="block text-xs text-gray-400 mt-1 ml-1">{isAppPassword ? "Gmail address" : "SMTP username / email"}</span>
        </div>
        <div className="relative">
          <Lock size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder={cfg.passSet ? "•••••••• (leave blank to keep current)" : (isAppPassword ? "App password" : "Password")}
            className={INPUT + " pl-10"}
            autoComplete="new-password"
          />
          <span className="block text-xs mt-1 ml-1 flex items-center gap-1">
            {cfg.passSet ? (
              <span className="text-emerald-600 flex items-center gap-1"><CheckCircle2 size={12} /> Password is set</span>
            ) : (
              <span className="text-amber-600">No password saved yet</span>
            )}
          </span>
        </div>
        <div className="relative">
          <Send size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
          <input type="email" value={cfg.from || ""} onChange={(e) => set("from", e.target.value)} placeholder="Defaults to the email above" className={INPUT + " pl-10"} />
          <span className="block text-xs text-gray-400 mt-1 ml-1">Send from</span>
        </div>
        <div className="relative">
          <Inbox size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
          <input type="email" value={cfg.to || ""} onChange={(e) => set("to", e.target.value)} placeholder="Defaults to the email above" className={INPUT + " pl-10"} />
          <span className="block text-xs text-gray-400 mt-1 ml-1">Contact form messages go to</span>
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
            "Save Email Settings"
          )}
        </button>
      </div>
    </section>
  );
}
