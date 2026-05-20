import { DashboardStats } from "@/types";
import { TrendingUp, TrendingDown, Wallet, ArrowLeftRight } from "lucide-react";

interface Props { stats: DashboardStats }

export function StatsCards({ stats }: Props) {
  const cards = [
    {
      label: "Total Balance", value: stats.balance,
      icon: Wallet, color: "text-emerald-600", bg: "bg-emerald-100",
      prefix: stats.balance >= 0 ? "+" : "",
    },
    {
      label: "Total Income", value: stats.totalIncome,
      icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-100", prefix: "+",
    },
    {
      label: "Total Expenses", value: stats.totalExpense,
      icon: TrendingDown, color: "text-red-500", bg: "bg-red-100", prefix: "-",
    },
    {
      label: "Transactions", value: stats.transactions,
      icon: ArrowLeftRight, color: "text-purple-600", bg: "bg-purple-100",
      isCount: true, prefix: "",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon, color, bg, prefix, isCount }) => (
        <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {isCount
              ? value
              : `${prefix}₹${Math.abs(value).toLocaleString("en-IN")}`}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  );
}
