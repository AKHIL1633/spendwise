import Link from "next/link";
import { TrendingUp, Shield, BarChart3, Wallet } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 flex flex-col items-center justify-center px-4 text-white">
      <div className="flex items-center gap-3 mb-8 animate-fade-in">
        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur">
          <Wallet className="w-7 h-7" />
        </div>
        <span className="text-3xl font-bold tracking-tight">SpendWise</span>
      </div>

      <h1 className="text-4xl md:text-6xl font-extrabold text-center max-w-2xl leading-tight mb-4 animate-slide-up">
        Know where your<br />
        <span className="text-green-200">money goes.</span>
      </h1>
      <p className="text-lg text-green-100 text-center max-w-lg mb-10 animate-slide-up">
        Track income and expenses, visualise spending patterns, and take control
        of your finances — all in one place.
      </p>

      <div className="flex gap-4 animate-fade-in">
        <Link href="/auth/login"
          className="bg-white text-green-700 font-semibold px-7 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
          Sign In
        </Link>
        <Link href="/auth/register"
          className="bg-white/10 backdrop-blur border border-white/30 font-semibold px-7 py-3 rounded-2xl hover:bg-white/20 transition-all">
          Get Started
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 justify-center mt-14 animate-fade-in">
        {[
          { icon: TrendingUp,  text: "Income & Expense tracking" },
          { icon: BarChart3,   text: "Monthly trend charts" },
          { icon: Shield,      text: "Secure authentication" },
          { icon: Wallet,      text: "Category breakdown" },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-2 bg-white/10 backdrop-blur text-sm px-4 py-2 rounded-full border border-white/20">
            <Icon className="w-4 h-4" />{text}
          </div>
        ))}
      </div>
    </main>
  );
}
