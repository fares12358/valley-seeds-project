"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Loader2, CheckCircle, ArrowLeft } from "lucide-react";
import { resetPassword } from "@/services/auth.service";

function ResetForm() {
  const searchParams  = useSearchParams();
  const token         = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirm,     setConfirm]     = useState("");
  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting,  setSubmitting]  = useState(false);
  const [success,     setSuccess]     = useState(false);
  const [error,       setError]       = useState("");

  const passwordsMatch = newPassword === confirm;
  const passwordValid  = newPassword.length >= 8 && /[A-Za-z]/.test(newPassword) && /\d/.test(newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordsMatch)  { setError("Passwords do not match"); return; }
    if (!passwordValid)   { setError("Password must be at least 8 characters with a letter and a number"); return; }
    setError("");
    setSubmitting(true);
    try {
      await resetPassword(token, newPassword);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Reset link is invalid or has expired");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#037338] via-[#96C422] to-[#037338]" />
          <div className="p-8 sm:p-10">
            <div className="flex justify-center mb-8">
              <div className="relative w-40 h-10">
                <Image src="/images/logo.svg" alt="Valley Seeds" fill className="object-contain" priority />
              </div>
            </div>

            {success ? (
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-[#037338]/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={28} className="text-[#037338]" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900 mb-2">Password updated</h1>
                <p className="text-sm text-gray-500 mb-6">
                  Your admin password has been successfully changed.
                </p>
                <Link
                  href="/dashboard/login"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#037338] text-white text-sm font-semibold rounded-xl hover:bg-[#025c2e] transition-colors"
                >
                  Sign in with new password
                </Link>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-semibold text-gray-900 mb-1">Set new password</h1>
                <p className="text-sm text-gray-400 mb-8">
                  {token ? "Enter your new password below." : "Invalid or missing reset token."}
                </p>

                {!token ? (
                  <Link
                    href="/dashboard/forgot-password"
                    className="inline-flex items-center gap-2 text-sm text-[#037338] font-medium hover:underline"
                  >
                    <ArrowLeft size={15} /> Request a new reset link
                  </Link>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="rp-new" className="block text-sm font-medium text-gray-700 mb-2">
                        New password
                      </label>
                      <div className="relative">
                        <input
                          id="rp-new"
                          type={showNew ? "text" : "password"}
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Min 8 chars, letter + number"
                          className="w-full px-4 py-3 pr-11 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#037338] focus:bg-white focus:shadow-[0_0_0_4px_rgba(3,115,56,0.08)] transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew(!showNew)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                          tabIndex={-1}
                        >
                          {showNew ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="rp-confirm" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm password
                      </label>
                      <div className="relative">
                        <input
                          id="rp-confirm"
                          type={showConfirm ? "text" : "password"}
                          required
                          value={confirm}
                          onChange={(e) => setConfirm(e.target.value)}
                          placeholder="Repeat your new password"
                          className={`w-full px-4 py-3 pr-11 bg-gray-50 border-2 rounded-xl text-sm focus:outline-none focus:bg-white transition-all ${
                            confirm && !passwordsMatch
                              ? "border-red-300 focus:border-red-400"
                              : "border-gray-200 focus:border-[#037338] focus:shadow-[0_0_0_4px_rgba(3,115,56,0.08)]"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                          tabIndex={-1}
                        >
                          {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                      </div>
                      {confirm && !passwordsMatch && (
                        <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                      )}
                    </div>

                    {error && (
                      <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 rounded-xl bg-[#037338] text-white font-semibold text-sm hover:bg-[#025c2e] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {submitting && <Loader2 size={18} className="animate-spin" />}
                      {submitting ? "Updating..." : "Update password"}
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  );
}
