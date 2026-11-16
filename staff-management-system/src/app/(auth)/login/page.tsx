"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
    <div className="min-h-screen bg-[#2b88d8] text-white flex flex-col md:flex-row font-sans">
      {/* Sidebar matching PHP login page */}
      <aside className="w-full md:w-64 bg-white/10 backdrop-blur-md border-r border-white/20 p-6 flex flex-col gap-6">
        <div className="pt-6">
          <h2 className="text-xl font-bold tracking-tight text-white mb-8">
            <Link href="/" className="hover:text-blue-100">
              Department of BCA
            </Link>
          </h2>
          <nav className="flex flex-col gap-4 text-base font-medium">
            <Link
              href="/"
              className="text-white/80 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-white/10"
            >
              Staff Details
            </Link>
            <Link
              href="/login"
              className="text-white hover:text-blue-100 transition-colors py-2 px-3 rounded-lg bg-white/15"
            >
              Login
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Login Area */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-8 shadow-2xl">
          <h3 className="text-2xl font-medium text-center text-white mb-2">Login</h3>
          <div className="w-16 h-1 bg-white/40 mx-auto rounded-full mb-6" />

          {error && (
            <div className="mb-6 p-3 bg-rose-500/80 text-white text-sm rounded-lg text-center backdrop-blur-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/90 mb-1.5 font-medium">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="example@gmail.com"
                className="w-full px-4 py-3 rounded-lg bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-white/90 mb-1.5 font-medium">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••"
                className="w-full px-4 py-3 rounded-lg bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm shadow-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-[#27ae60] hover:bg-[#219150] text-white font-medium rounded-lg text-base transition-colors shadow-md disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-xs text-center text-white/80">
            Sample login: <span className="font-semibold text-white">example@gmail.com</span> /{" "}
            <span className="font-semibold text-white">1234</span>
          </p>
        </div>
      </main>
    </div>
  );
}
