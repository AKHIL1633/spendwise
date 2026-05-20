"use client";
import { signOut, useSession } from "next-auth/react";
import { TrendingUp, LogOut, User } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-lg">SpendWise</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-7 h-7 bg-emerald-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="hidden sm:block font-medium">{session?.user?.name}</span>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
