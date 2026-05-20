"use client";
import { Transaction } from "@/types";
import { Trash2, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { format } from "date-fns";

interface Props {
  transactions: Transaction[];
  onDelete:     (id: string) => void;
}

export function TransactionList({ transactions, onDelete }: Props) {
  if (!transactions.length)
    return <div className="text-center py-12 text-gray-400 text-sm">No transactions yet — add your first one!</div>;

  return (
    <div className="space-y-2">
      {transactions.map(t => (
        <div key={t.id}
          className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-gray-100 hover:shadow-sm transition group">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
            t.type === "income" ? "bg-green-100" : "bg-red-100"
          }`}>
            {t.type === "income"
              ? <ArrowUpCircle className="w-5 h-5 text-green-600" />
              : <ArrowDownCircle className="w-5 h-5 text-red-500" />
            }
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{t.title}</p>
            <p className="text-xs text-gray-400">{t.category} · {format(new Date(t.date), "dd MMM yyyy")}</p>
          </div>

          <span className={`text-sm font-bold flex-shrink-0 ${
            t.type === "income" ? "text-green-600" : "text-red-500"
          }`}>
            {t.type === "income" ? "+" : "-"}₹{t.amount.toLocaleString("en-IN")}
          </span>

          <button onClick={() => onDelete(t.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-500 ml-1">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
