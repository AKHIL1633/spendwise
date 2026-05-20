"use client";
import { useState, useCallback } from "react";
import { Transaction, CreateTransactionPayload, DashboardStats, CategoryStat, MonthlyData, CATEGORY_COLORS } from "@/types";
import { Navbar } from "@/components/Navbar";
import { StatsCards } from "@/components/StatsCards";
import { CategoryChart } from "@/components/CategoryChart";
import { MonthlyChart } from "@/components/MonthlyChart";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { format } from "date-fns";

interface Props { initialTransactions: Transaction[] }

function computeStats(txs: Transaction[]): DashboardStats {
  const totalIncome  = txs.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = txs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  return { totalIncome, totalExpense, balance: totalIncome - totalExpense, transactions: txs.length };
}

function computeCategoryStats(txs: Transaction[]): CategoryStat[] {
  const map: Record<string, number> = {};
  txs.filter((t) => t.type === "expense").forEach((t) => {
    map[t.category] = (map[t.category] ?? 0) + t.amount;
  });
  return Object.entries(map).map(([category, amount]) => ({
    category, amount: Math.round(amount * 100) / 100,
    color: CATEGORY_COLORS[category] ?? "#6b7280",
  })).sort((a, b) => b.amount - a.amount);
}

function computeMonthlyData(txs: Transaction[]): MonthlyData[] {
  const map: Record<string, { income: number; expense: number }> = {};
  txs.forEach((t) => {
    const month = format(new Date(t.date), "MMM yy");
    if (!map[month]) map[month] = { income: 0, expense: 0 };
    if (t.type === "income")  map[month].income  += t.amount;
    else                       map[month].expense += t.amount;
  });
  return Object.entries(map)
    .map(([month, data]) => ({ month, ...data }))
    .slice(-6);
}

export function Dashboard({ initialTransactions }: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  const handleAdd = useCallback(async (payload: CreateTransactionPayload) => {
    const res  = await fetch("/api/transactions", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    setTransactions((prev) => [data.data, ...prev]);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    await fetch(`/api/transactions/${id}`, { method: "DELETE" });
  }, []);

  const stats         = computeStats(transactions);
  const categoryStats = computeCategoryStats(transactions);
  const monthlyData   = computeMonthlyData(transactions);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">Track your income & expenses</p>
          </div>
          <TransactionForm onAdd={handleAdd} />
        </div>

        {/* Stats */}
        <StatsCards stats={stats} />

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CategoryChart data={categoryStats} />
          <MonthlyChart  data={monthlyData} />
        </div>

        {/* Transaction list */}
        <TransactionList transactions={transactions} onDelete={handleDelete} />
      </main>
    </div>
  );
}
