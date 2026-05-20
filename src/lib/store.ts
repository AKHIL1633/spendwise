// In-memory fallback store (used when DATABASE_URL is not set)
// Replace with Prisma calls by connecting Supabase in .env

import { Transaction, DashboardStats, CategoryStat, MonthlyTrend } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { format, subMonths } from "date-fns";

const COLORS = ["#22c55e","#3b82f6","#f59e0b","#ef4444","#8b5cf6","#ec4899","#14b8a6","#f97316"];

const now = new Date();
const seed: Transaction[] = [
  { id: uuidv4(), title: "Monthly Salary",    amount: 75000, type: "income",  category: "Salary",        date: subMonths(now,0).toISOString(), userId:"demo", note:"Jun salary",   createdAt:now.toISOString(), updatedAt:now.toISOString() },
  { id: uuidv4(), title: "Freelance Project", amount: 15000, type: "income",  category: "Freelance",     date: subMonths(now,0).toISOString(), userId:"demo", note:null,           createdAt:now.toISOString(), updatedAt:now.toISOString() },
  { id: uuidv4(), title: "Grocery Shopping",  amount:  4200, type: "expense", category: "Food",          date: subMonths(now,0).toISOString(), userId:"demo", note:"Big Bazaar",   createdAt:now.toISOString(), updatedAt:now.toISOString() },
  { id: uuidv4(), title: "Electricity Bill",  amount:  2100, type: "expense", category: "Bills",         date: subMonths(now,0).toISOString(), userId:"demo", note:null,           createdAt:now.toISOString(), updatedAt:now.toISOString() },
  { id: uuidv4(), title: "Uber / Ola rides",  amount:  1500, type: "expense", category: "Transport",     date: subMonths(now,0).toISOString(), userId:"demo", note:null,           createdAt:now.toISOString(), updatedAt:now.toISOString() },
  { id: uuidv4(), title: "Netflix + Spotify", amount:   999, type: "expense", category: "Entertainment", date: subMonths(now,0).toISOString(), userId:"demo", note:null,           createdAt:now.toISOString(), updatedAt:now.toISOString() },
  { id: uuidv4(), title: "Previous Salary",   amount: 75000, type: "income",  category: "Salary",        date: subMonths(now,1).toISOString(), userId:"demo", note:"May salary",   createdAt:now.toISOString(), updatedAt:now.toISOString() },
  { id: uuidv4(), title: "Restaurant dining", amount:  3200, type: "expense", category: "Food",          date: subMonths(now,1).toISOString(), userId:"demo", note:null,           createdAt:now.toISOString(), updatedAt:now.toISOString() },
  { id: uuidv4(), title: "Online Shopping",   amount:  5600, type: "expense", category: "Shopping",      date: subMonths(now,1).toISOString(), userId:"demo", note:"Amazon",       createdAt:now.toISOString(), updatedAt:now.toISOString() },
  { id: uuidv4(), title: "Investment Return", amount: 12000, type: "income",  category: "Investment",    date: subMonths(now,2).toISOString(), userId:"demo", note:"Mutual funds", createdAt:now.toISOString(), updatedAt:now.toISOString() },
  { id: uuidv4(), title: "Doctor visit",      amount:  2500, type: "expense", category: "Health",        date: subMonths(now,2).toISOString(), userId:"demo", note:null,           createdAt:now.toISOString(), updatedAt:now.toISOString() },
  { id: uuidv4(), title: "Udemy courses",     amount:  1800, type: "expense", category: "Education",     date: subMonths(now,2).toISOString(), userId:"demo", note:null,           createdAt:now.toISOString(), updatedAt:now.toISOString() },
];

let transactions: Transaction[] = [...seed];

export const memDb = {
  getAll(userId: string): Transaction[] {
    return transactions
      .filter(t => t.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  getById(id: string): Transaction | undefined {
    return transactions.find(t => t.id === id);
  },

  // ✅ Fixed: added "userId" to Omit so TypeScript doesn't complain
  create(payload: Omit<Transaction, "id" | "userId" | "createdAt" | "updatedAt">, userId: string): Transaction {
    const t: Transaction = {
      ...payload,
      id:        uuidv4(),
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    transactions.unshift(t);
    return t;
  },

  update(id: string, payload: Partial<Transaction>): Transaction | null {
    const idx = transactions.findIndex(t => t.id === id);
    if (idx === -1) return null;
    transactions[idx] = { ...transactions[idx], ...payload, updatedAt: new Date().toISOString() };
    return transactions[idx];
  },

  delete(id: string): boolean {
    const before = transactions.length;
    transactions = transactions.filter(t => t.id !== id);
    return transactions.length < before;
  },

  getStats(userId: string): DashboardStats {
    const userTx      = transactions.filter(t => t.userId === userId);
    const totalIncome  = userTx.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const totalExpense = userTx.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return {
      totalIncome,
      totalExpense,
      netBalance:   totalIncome - totalExpense,
      transactions: userTx.length,
    };
  },

  getCategoryStats(userId: string): CategoryStat[] {
    const expenses = transactions.filter(t => t.userId === userId && t.type === "expense");
    const map: Record<string, number> = {};
    expenses.forEach(t => { map[t.category] = (map[t.category] ?? 0) + t.amount; });
    return Object.entries(map).map(([name, value], i) => ({
      name,
      value,
      color: COLORS[i % COLORS.length],
    }));
  },

  getMonthlyTrends(userId: string): MonthlyTrend[] {
    const months: MonthlyTrend[] = [];
    for (let i = 5; i >= 0; i--) {
      const d      = subMonths(now, i);
      const label  = format(d, "MMM yy");
      const mo     = format(d, "yyyy-MM");
      const userTx = transactions.filter(t => t.userId === userId && t.date.startsWith(mo));
      months.push({
        month:   label,
        income:  userTx.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0),
        expense: userTx.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0),
      });
    }
    return months;
  },
};