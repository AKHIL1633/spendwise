"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { MonthlyTrend } from "@/types";

export function MonthlyChart({ data }: { data: MonthlyTrend[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false}
          tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
        <Tooltip formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`} />
        <Legend iconType="circle" iconSize={8} />
        <Bar dataKey="income"  name="Income"  fill="#22c55e" radius={[4,4,0,0]} />
        <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4,4,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
