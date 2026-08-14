"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { KeyRound, Mail, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { updateCredentials } from "@/services/auth.service";

const INPUT = "w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm " +
  "focus:outline-none focus:border-[#037338] focus:bg-white focus:shadow-[0_0_0_4px_rgba(3,115,56,0.08)] transition-all";

const EMPTY = { currentPassword: "", newEmail: "", newPassword: "", confirmPassword: "" };

export default function AdminCredentialsSection() {
  const { user } = useAuth();
  const [form, setForm] = useState(EMPTY);
  const [isSaving, setIsSaving] = useState(false);

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const isDirty = form.newEmail.trim() !== "" || form.newPassword !== "";

  const handleSave = async () => {
    if (!form.currentPassword) {
      toast.error("Enter your current password to make changes");
      return;
    }
    const newEmail = form.newEmail.trim();
    if (!newEmail && !form.newPassword) {
      toast.error("Enter a new email or a new password");
      return;
    }
    if (form.newPassword && form.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      toast.error("New password and confirmation don't match");
      return;
    }

    setIsSaving(true);
    try {
      await updateCredentials({
        currentPassword: form.currentPassword,
        newEmail: newEmail || undefined,
        newPassword: form.newPassword || undefined,
      });
      toast.success("Credentials updated!");
      setForm(EMPTY);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update credentials");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
      <div>
        <h2 className="text-base font-semibold text-gray-800">Admin Credentials</h2>
        <p className="text-sm text-gray-400 mt-1">
          Signed in as <span className="font-medium text-gray-600">{user?.email}</span>. Changing these signs you in with the new credentials immediately.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="relative sm:col-span-2">
          <ShieldCheck size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
          <input
            type="password"
            value={form.currentPassword}
            onChange={(e) => set("currentPassword", e.target.value)}
            placeholder="Current password"
            className={INPUT + " pl-10"}
            autoComplete="current-password"
          />
          <span className="block text-xs text-gray-400 mt-1 ml-1">Required to confirm any change below</span>
        </div>

        <div className="relative">
          <Mail size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
          <input
            type="email"
            value={form.newEmail}
            onChange={(e) => set("newEmail", e.target.value)}
            placeholder={user?.email || "New email"}
            className={INPUT + " pl-10"}
            autoComplete="off"
          />
          <span className="block text-xs text-gray-400 mt-1 ml-1">New email (optional)</span>
        </div>

        <div className="relative">
          <KeyRound size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
          <input
            type="password"
            value={form.newPassword}
            onChange={(e) => set("newPassword", e.target.value)}
            placeholder="New password"
            className={INPUT + " pl-10"}
            autoComplete="new-password"
          />
          <span className="block text-xs text-gray-400 mt-1 ml-1">New password (optional, min 8 chars)</span>
        </div>

        {form.newPassword && (
          <div className="relative sm:col-span-2">
            <KeyRound size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => set("confirmPassword", e.target.value)}
              placeholder="Confirm new password"
              className={INPUT + " pl-10"}
              autoComplete="new-password"
            />
          </div>
        )}
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
            "Update Credentials"
          )}
        </button>
      </div>
    </section>
  );
}
