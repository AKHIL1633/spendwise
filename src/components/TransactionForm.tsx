"use client";
import { useState } from "react";
import { CreateTransactionPayload, TransactionType, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/types";
import { Plus, X, Loader2 } from "lucide-react";

interface Props { onAdd: (payload: CreateTransactionPayload) => Promise<void> }

const defaultForm: CreateTransactionPayload = {
  title: "", amount: 0, type: "expense",
  category: "Food & Dining", date: new Date().toISOString().split("T")[0], note: "",
};

export function TransactionForm({ onAdd }: Props) {
  const [open,    setOpen]    = useState(false);
  const [form,    setForm]    = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const categories = form.type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  function set<K extends keyof CreateTransactionPayload>(k: K, v: CreateTransactionPayload[K]) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.amount) { setError("Title and amount are required"); return; }
    setLoading(true); setError("");
    try {
      await onAdd(form);
      setForm(defaultForm); setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally { setLoading(false); }
  }

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-emerald-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm">
        <Plus className="w-4 h-4" /> Add Transaction
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold">Add Transaction</h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Type toggle */}
              <div className="grid grid-cols-2 gap-2">
                {(["expense", "income"] as TransactionType[]).map((t) => (
                  <button key={t} type="button"
                    onClick={() => { set("type", t); set("category", t === "expense" ? "Food & Dining" : "Salary"); }}
                    className={`py-2 rounded-xl text-sm font-semibold capitalize transition-colors ${
                      form.type === t
                        ? t === "expense" ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}>{t}</button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" value={form.title} required
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="e.g. Grocery shopping"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                  <input type="number" min="0" step="0.01" required
                    value={form.amount || ""}
                    onChange={(e) => set("amount", parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" value={form.date}
                    onChange={(e) => set("date", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={form.category} onChange={(e) => set("category", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note (optional)</label>
                <input type="text" value={form.note}
                  onChange={(e) => set("note", e.target.value)}
                  placeholder="Any extra details…"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setOpen(false)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {loading ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
