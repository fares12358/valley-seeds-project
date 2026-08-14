"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();

  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error,        setError]        = useState("");
  const [submitting,   setSubmitting]   = useState(false);
  const navigating = useRef(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const result = await login(email, password);

    if (result.success) {
      if (navigating.current) return; // guard against double-fire
      navigating.current = true;
      window.location.href = "/dashboard";
    } else {
      setError(result.message || "Invalid email or password");
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

            <h1 className="text-2xl font-semibold text-gray-900 text-center mb-1">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-400 text-center mb-8">
              Sign in to manage your website content
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  id="login-email" type="email" autoComplete="email" required
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@valley-seeds.com"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm
                    focus:outline-none focus:border-[#037338] focus:bg-white
                    focus:shadow-[0_0_0_4px_rgba(3,115,56,0.08)] transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Link href="/dashboard/forgot-password" className="text-xs text-[#037338] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="login-password" type={showPassword ? "text" : "password"}
                    autoComplete="current-password" required
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 pr-11 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm
                      focus:outline-none focus:border-[#037338] focus:bg-white
                      focus:shadow-[0_0_0_4px_rgba(3,115,56,0.08)] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit" disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#037338] to-[#05964a]
                  text-white font-semibold text-sm hover:shadow-lg hover:shadow-[#037338]/20
                  transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 size={18} className="animate-spin" />}
                {submitting ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          &copy; {new Date().getFullYear()} Valley Seeds. Admin access only.
        </p>
      </div>
    </div>
  );
}
