"use client";
import { useState } from "react";
import { CreateTransactionPayload, TransactionType, CATEGORIES } from "@/types";
import { X } from "lucide-react";

interface Props {
  onClose:  () => void;
  onCreate: (p: CreateTransactionPayload) => Promise<void>;
}

const defaultForm: CreateTransactionPayload = {
  title: "", amount: 0, type: "expense", category: "Food",
  date: new Date().toISOString().split("T")[0], note: "",
};

export function AddTransactionModal({ onClose, onCreate }: Props) {
  const [form,    setForm]    = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  function set<K extends keyof CreateTransactionPayload>(k: K, v: CreateTransactionPayload[K]) {
    setForm(p => ({ ...p, [k]: v }));
  }

  const cats = CATEGORIES[form.type];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { setError("Title is required"); return; }
    if (!form.amount || form.amount <= 0) { setError("Enter a valid amount"); return; }
    setLoading(true);
    try {
      await onCreate({ ...form, amount: Number(form.amount) });
      onClose();
    } catch { setError("Something went wrong"); }
    finally { setLoading(false); }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Add Transaction</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type toggle */}
          <div className="grid grid-cols-2 gap-2">
            {(["income","expense"] as TransactionType[]).map(t => (
              <button type="button" key={t} onClick={() => { set("type", t); set("category", CATEGORIES[t][0]); }}
                className={`py-2.5 rounded-xl font-semibold text-sm capitalize transition-all ${
                  form.type === t
                    ? t === "income" ? "bg-green-600 text-white" : "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}>
                {t}
              </button>
            ))}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input type="text" value={form.title} onChange={e => set("title", e.target.value)}
              placeholder="e.g. Monthly Salary"
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
            <input type="number" min="1" value={form.amount || ""}
              onChange={e => set("amount", parseFloat(e.target.value))}
              placeholder="0.00"
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>

          {/* Category + Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={form.category} onChange={e => set("category", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                {cats.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" value={form.date} onChange={e => set("date", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Note (optional)</label>
            <input type="text" value={form.note ?? ""} onChange={e => set("note", e.target.value)}
              placeholder="Any details…"
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 disabled:opacity-60">
              {loading ? "Adding…" : "Add Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
