"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Wallet } from "lucide-react";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [form,    setForm]    = useState({ name: "", email: "", password: "" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");

    try {
      // Step 1 — Create user in database
      const res = await fetch("/api/auth/register", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Registration failed"); setLoading(false); return; }

      // Step 2 — Auto sign in after registration
      const signInRes = await signIn("credentials", {
        email:    form.email,
        password: form.password,
        redirect: false,
      });

      if (signInRes?.error) { setError("Account created but login failed. Try signing in."); setLoading(false); return; }

      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
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

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Create account</h1>
        <p className="text-gray-500 text-sm mb-6">Start tracking your finances today</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Full Name", key: "name",     type: "text",     placeholder: "P Akhil" },
            { label: "Email",     key: "email",    type: "email",    placeholder: "you@email.com" },
            { label: "Password",  key: "password", type: "password", placeholder: "Min. 8 characters" },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input type={type} placeholder={placeholder}
                value={form[key as keyof typeof form]}
                onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                required minLength={key === "password" ? 8 : 1} />
            </div>
          ))}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full bg-green-600 text-white font-semibold py-2.5 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-60">
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-green-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}