"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Wallet, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [form,    setForm]    = useState({ email: "demo@spendwise.app", password: "demo1234" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw,  setShowPw]  = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await signIn("credentials", { ...form, redirect: false });
    if (res?.error) { setError("Invalid email or password"); setLoading(false); return; }
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 animate-slide-up">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-gray-900">SpendWise</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
        <p className="text-gray-500 text-sm mb-6">Sign in to your account</p>

        {/* Demo hint */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-6 text-xs text-green-700">
          <strong>Demo credentials pre-filled</strong> — just click Sign In!
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition pr-10"
                required />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full bg-green-600 text-white font-semibold py-2.5 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-60">
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          No account?{" "}
          <Link href="/auth/register" className="text-green-600 font-semibold hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
}
