"use client";
import { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Transaction, DashboardStats, CategoryStat, MonthlyTrend, CreateTransactionPayload } from "@/types";
import { StatsCard }            from "@/components/StatsCard";
import { TransactionList }      from "@/components/TransactionList";
import { CategoryChart }        from "@/components/CategoryChart";
import { MonthlyChart }         from "@/components/MonthlyChart";
import { AddTransactionModal }  from "@/components/AddTransactionModal";
import { TrendingUp, TrendingDown, Wallet, Activity, Plus, LogOut } from "lucide-react";

interface DashboardData {
  transactions: Transaction[];
  stats:        DashboardStats;
  categories:   CategoryStat[];
  trends:       MonthlyTrend[];
}

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data,      setData]      = useState<DashboardData | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => { if (status === "unauthenticated") router.push("/auth/login"); }, [status, router]);

  const fetchData = useCallback(async () => {
    try {
      const res  = await fetch("/api/transactions");
      const json = await res.json();
      setData(json.data);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { if (status === "authenticated") fetchData(); }, [status, fetchData]);

  const handleCreate = async (payload: CreateTransactionPayload) => {
    await fetch("/api/transactions", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await fetchData();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    setData(prev => prev ? {
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== id),
    } : prev);
    await fetchData();
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { stats, categories, trends, transactions } = data ?? { stats: { totalIncome:0, totalExpense:0, netBalance:0, transactions:0 }, categories:[], trends:[], transactions:[] };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-green-600 rounded-xl flex items-center justify-center">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">SpendWise</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:block">
              Hey, <strong>{session?.user?.name?.split(" ")[0]}</strong> 👋
            </span>
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-green-700 transition-colors shadow-sm">
              <Plus className="w-4 h-4" /> Add
            </button>
            <button onClick={() => signOut({ callbackUrl: "/" })}
              className="text-gray-400 hover:text-gray-700 transition-colors" title="Sign out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard label="Total Income"   value={fmt(stats.totalIncome)}  icon={TrendingUp}   color="text-green-600"  bg="bg-green-100"  />
          <StatsCard label="Total Expenses" value={fmt(stats.totalExpense)} icon={TrendingDown} color="text-red-500"    bg="bg-red-100"    />
          <StatsCard label="Net Balance"    value={fmt(stats.netBalance)}   icon={Wallet}       color={stats.netBalance >= 0 ? "text-green-600" : "text-red-500"} bg={stats.netBalance >= 0 ? "bg-green-100" : "bg-red-100"} />
          <StatsCard label="Transactions"   value={String(stats.transactions)} icon={Activity}  color="text-blue-600"  bg="bg-blue-100"   />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-800 mb-4">Monthly Overview</h2>
            <MonthlyChart data={trends} />
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-800 mb-4">Expense by Category</h2>
            <CategoryChart data={categories} />
          </div>
        </div>

        {/* Transaction list */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-800">Recent Transactions</h2>
            <span className="text-xs text-gray-400">{transactions.length} total</span>
          </div>
          <TransactionList transactions={transactions} onDelete={handleDelete} />
        </div>
      </main>

      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} onCreate={handleCreate} />}
    </div>
  );
}
