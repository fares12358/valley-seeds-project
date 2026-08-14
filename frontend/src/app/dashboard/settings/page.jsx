"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Loader2, Globe, Phone, Mail, MapPin, MessageCircle, Zap, Eye, EyeOff } from "lucide-react";
import { FaFacebook, FaLinkedin, FaInstagram, FaWhatsapp, FaMeta } from "react-icons/fa6";
import ImageManager from "@/components/dashboard/ImageManager";
import SaveBar from "@/components/dashboard/SaveBar";
import EmailSettingsSection from "@/components/dashboard/EmailSettingsSection";
import AdminCredentialsSection from "@/components/dashboard/AdminCredentialsSection";
import api from "@/services/api";

const DEFAULTS = {
  brandName: "Valley Seeds", primaryColor: "#037338", accentColor: "#96C422",
  email: "info@valley-seeds.com", phone: "+20 128 763 6986",
  whatsapp: "+20 128 763 6986", website: "www.valley-seeds.com", location: "Cairo, Egypt",
  socialLinks: { facebook: "", linkedin: "", instagram: "", whatsapp: "https://wa.me/201287636986" },
  logoUrl: "", logoWhiteUrl: "",
  logoPublicId: "", logoWhitePublicId: "",
  metaPixelId: "",
};

const INPUT = "w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm " +
  "focus:outline-none focus:border-[#037338] focus:bg-white focus:shadow-[0_0_0_4px_rgba(3,115,56,0.08)] transition-all";

export default function SettingsPage() {
  const [settings,      setSettings]      = useState(DEFAULTS);
  const [savedSettings, setSavedSettings] = useState(DEFAULTS);
  const [loading,       setLoading]       = useState(true);
  const [isSaving,      setIsSaving]      = useState(false);
  const [showPixelId,   setShowPixelId]   = useState(false);

  const isDirty = JSON.stringify(settings) !== JSON.stringify(savedSettings);

  useEffect(() => {
    api.get("/settings")
      .then(({ data }) => {
        const s = { ...DEFAULTS, ...data.data };
        setSettings(s);
        setSavedSettings(s);
      })
      .catch(() => toast.error("Failed to load settings"))
      .finally(() => setLoading(false));
  }, []);

  const set = (key, val) =>
    setSettings((prev) => ({ ...prev, [key]: val }));

  const setSocial = (key, val) =>
    setSettings((prev) => ({ ...prev, socialLinks: { ...prev.socialLinks, [key]: val } }));

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data } = await api.put("/settings", settings);
      const saved = { ...DEFAULTS, ...data.data };
      setSavedSettings(saved);
      toast.success("Settings saved!");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={24} className="animate-spin text-[#037338]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 space-y-8">

        {/* Brand */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <h2 className="text-base font-semibold text-gray-800">Brand Identity</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Brand name</label>
            <input type="text" value={settings.brandName || ""} onChange={(e) => set("brandName", e.target.value)} placeholder="Valley Seeds" className={INPUT} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { label: "Primary color", key: "primaryColor", hint: "main green",  default: "#037338" },
              { label: "Accent color",  key: "accentColor",  hint: "lime green",  default: "#96C422" },
            ].map(({ label, key, hint, default: d }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {label} <span className="text-gray-400 font-normal">({hint})</span>
                </label>
                <div className="flex items-center gap-3">
                  <input type="color" value={settings[key] || d} onChange={(e) => set(key, e.target.value)} className="w-10 h-10 rounded-lg border-2 border-gray-200 cursor-pointer bg-gray-50 p-0.5" />
                  <input type="text" value={settings[key] || ""} onChange={(e) => set(key, e.target.value)} placeholder={d} className={INPUT + " font-mono"} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact info */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <h2 className="text-base font-semibold text-gray-800">Contact Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { key: "email",    Icon: Mail,          label: "Email",    type: "email", ph: "info@valley-seeds.com" },
              { key: "phone",    Icon: Phone,         label: "Phone",    type: "text",  ph: "+20 128 763 6986" },
              { key: "whatsapp", Icon: MessageCircle, label: "WhatsApp", type: "text",  ph: "+20 128 763 6986" },
              { key: "website",  Icon: Globe,         label: "Website",  type: "text",  ph: "www.valley-seeds.com" },
            ].map(({ key, Icon, label, type, ph }) => (
              <div key={key} className="relative">
                <Icon size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                <input type={type} value={settings[key] || ""} onChange={(e) => set(key, e.target.value)} placeholder={ph} className={INPUT + " pl-10"} />
                <span className="block text-xs text-gray-400 mt-1 ml-1">{label}</span>
              </div>
            ))}
            <div className="relative sm:col-span-2">
              <MapPin size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
              <input type="text" value={settings.location || ""} onChange={(e) => set("location", e.target.value)} placeholder="Cairo, Egypt" className={INPUT + " pl-10"} />
              <span className="block text-xs text-gray-400 mt-1 ml-1">Location</span>
            </div>
          </div>
        </section>

        {/* Social links */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <h2 className="text-base font-semibold text-gray-800">Social Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { key: "facebook",  label: "Facebook URL",  Icon: FaFacebook,  ph: "https://facebook.com/..." },
              { key: "linkedin",  label: "LinkedIn URL",  Icon: FaLinkedin,  ph: "https://linkedin.com/..." },
              { key: "instagram", label: "Instagram URL", Icon: FaInstagram, ph: "https://instagram.com/..." },
              { key: "whatsapp",  label: "WhatsApp link", Icon: FaWhatsapp,  ph: "https://wa.me/20..." },
            ].map(({ key, label, Icon, ph }) => (
              <div key={key} className="relative">
                <Icon className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                <input type="url" value={settings.socialLinks?.[key] || ""} onChange={(e) => setSocial(key, e.target.value)} placeholder={ph} className={INPUT + " pl-10"} />
                <span className="block text-xs text-gray-400 mt-1 ml-1">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Logos */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="text-base font-semibold text-gray-800">Logo Images</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageManager
              label="Logo — light background"
              value={settings.logoUrl ? { url: settings.logoUrl, publicId: settings.logoPublicId || "" } : null}
              folder="brand"
              slot="logo"
              onChange={(img) => {
                set("logoUrl",       img?.url       || "");
                set("logoPublicId",  img?.publicId  || "");
              }}
            />
            <ImageManager
              label="Logo — dark background (white version)"
              value={settings.logoWhiteUrl ? { url: settings.logoWhiteUrl, publicId: settings.logoWhitePublicId || "" } : null}
              folder="brand"
              slot="logo-white"
              onChange={(img) => {
                set("logoWhiteUrl",      img?.url       || "");
                set("logoWhitePublicId", img?.publicId  || "");
              }}
            />
          </div>
        </section>

        {/* ── Meta Pixel ─────────────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1877F2]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <FaMeta size={16} className="text-[#1877F2]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-800">Meta Pixel</h2>
              <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                Paste your Pixel ID to track <span className="font-medium text-gray-500">PageView</span> (on homepage load)
                and <span className="font-medium text-gray-500">Lead</span> (on contact form submit).
                Leave empty to disable tracking.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Pixel ID</label>
            <div className="relative">
              <input
                type={showPixelId ? "text" : "password"}
                value={settings.metaPixelId || ""}
                onChange={(e) => set("metaPixelId", e.target.value)}
                placeholder="e.g. 1234567890123456"
                className={INPUT + " pr-11 font-mono tracking-widest"}
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowPixelId((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title={showPixelId ? "Hide Pixel ID" : "Show Pixel ID"}
              >
                {showPixelId ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-xs text-gray-400">
              Find your Pixel ID in{" "}
              <a
                href="https://business.facebook.com/events_manager"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1877F2] hover:underline"
              >
                Meta Events Manager
              </a>{" "}
              → Data Sources → your Pixel → Settings.
            </p>
          </div>

          {/* live status indicator */}
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-medium border ${
            settings.metaPixelId?.trim()
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-gray-50 border-gray-200 text-gray-400"
          }`}>
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
              settings.metaPixelId?.trim() ? "bg-green-500 animate-pulse" : "bg-gray-300"
            }`} />
            {settings.metaPixelId?.trim()
              ? `Pixel ${showPixelId ? settings.metaPixelId : "••••••••••"} — active on next save`
              : "No Pixel ID set — tracking disabled"}
          </div>

          {/* events reference */}
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { icon: "🌐", event: "PageView",  when: "Fires when any visitor loads the homepage" },
              { icon: "📋", event: "Lead",       when: "Fires after a successful contact form submit" },
            ].map(({ icon, event, when }) => (
              <div key={event} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3.5">
                <span className="text-lg leading-none">{icon}</span>
                <div>
                  <p className="text-xs font-semibold text-gray-700">{event}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{when}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* ─────────────────────────────────────────────────────────────── */}

        {/* Email sending config */}
        <EmailSettingsSection />

        {/* Admin login credentials */}
        <AdminCredentialsSection />

      </div>

      <SaveBar isDirty={isDirty} isSaving={isSaving} onSave={handleSave} onDiscard={() => setSettings(savedSettings)} />
    </div>
  );
}
