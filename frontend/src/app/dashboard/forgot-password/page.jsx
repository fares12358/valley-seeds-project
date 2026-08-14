"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Loader2, Mail, CheckCircle } from "lucide-react";
import { forgotPassword } from "@/services/auth.service";

export default function ForgotPasswordPage() {
  const [email,       setEmail]       = useState("");
  const [submitting,  setSubmitting]  = useState(false);
  const [sent,        setSent]        = useState(false);
  const [serverError, setServerError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setServerError("");
    try {
      await forgotPassword(email);
      // Always show "check your email" — backend always returns success
      // to prevent email enumeration
    } catch {
      // Still show confirmation state — don't reveal whether email exists
    } finally {
      setSent(true);
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

            {sent ? (
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-[#037338]/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={28} className="text-[#037338]" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900 mb-2">Check your email</h1>
                <p className="text-sm text-gray-500 mb-6">
                  If <strong>{email}</strong> is registered, a password reset link has been sent.
                  Check your inbox and spam folder.
                </p>
                <Link
                  href="/dashboard/login"
                  className="inline-flex items-center gap-2 text-sm text-[#037338] font-medium hover:underline"
                >
                  <ArrowLeft size={15} /> Back to login
                </Link>
              </div>
            ) : (
              <>
                <Link
                  href="/dashboard/login"
                  className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-6"
                >
                  <ArrowLeft size={15} /> Back to login
                </Link>
                <h1 className="text-2xl font-semibold text-gray-900 mb-1">Forgot password?</h1>
                <p className="text-sm text-gray-400 mb-8">
                  Enter your admin email and we will send you a reset link.
                </p>

                {serverError && (
                  <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    {serverError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="fp-email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        id="fp-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@valley-seeds.com"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#037338] focus:bg-white focus:shadow-[0_0_0_4px_rgba(3,115,56,0.08)] transition-all"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-xl bg-[#037338] text-white font-semibold text-sm hover:bg-[#025c2e] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {submitting && <Loader2 size={18} className="animate-spin" />}
                    {submitting ? "Sending..." : "Send reset link"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
