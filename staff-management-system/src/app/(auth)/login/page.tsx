"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import HomeNav from "@/components/HomeNav";
import { Lock, Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error || "Invalid email or password");
      } else {
        router.push("/dashboard/personal");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#1e5799] via-[#2989d8] to-[#207cca] text-white flex flex-col font-sans">
      {/* Same Responsive Navigation with Glass Sidebar & Drawer as Home */}
      <HomeNav />

      {/* Main Content Area matching Home layout */}
      <div className="flex flex-1 pt-16">
        <main className="flex-1 md:ml-64 p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] max-w-7xl mx-auto w-full">
          {/* Clean Static Glass Card */}
          <div className="w-full max-w-md rounded-2xl p-6 sm:p-8 bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
            <header className="mb-6 text-center">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-wide mb-2 drop-shadow-sm">
                Staff Login
              </h1>
              <div className="h-0.5 bg-white/30 max-w-[160px] mx-auto" />
              <p className="text-xs text-blue-100/80 mt-2">
                Enter your credentials to access your staff portal
              </p>
            </header>

            {error && (
              <div className="mb-5 p-3.5 bg-rose-500/80 border border-rose-300/40 text-white text-xs sm:text-sm rounded-xl text-center backdrop-blur-md shadow-md animate-in fade-in duration-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-blue-100 font-semibold mb-1.5 flex items-center gap-1.5">
                  <Mail size={13} className="text-blue-200" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="example@gmail.com"
                  className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/25 focus:border-white/50 text-white placeholder-blue-100/50 outline-none transition-all focus:ring-2 focus:ring-white/30 text-sm shadow-inner backdrop-blur-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-blue-100 font-semibold mb-1.5 flex items-center gap-1.5">
                  <Lock size={13} className="text-blue-200" />
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/25 focus:border-white/50 text-white placeholder-blue-100/50 outline-none transition-all focus:ring-2 focus:ring-white/30 text-sm shadow-inner backdrop-blur-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 py-3 bg-[#27ae60] hover:bg-[#219150] text-white font-semibold rounded-lg text-sm transition-all shadow-lg hover:shadow-emerald-500/25 active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  "Signing in..."
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Sample Credentials Helper Pill */}
            <div className="mt-6 p-3 rounded-xl bg-white/10 border border-white/15 text-xs text-center text-blue-100/90 backdrop-blur-sm leading-relaxed">
              <span className="text-white/70 block mb-0.5">Sample Credentials:</span>
              <span className="font-semibold text-white">example@gmail.com</span> &nbsp;•&nbsp; Password:{" "}
              <span className="font-semibold text-white">1234</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
