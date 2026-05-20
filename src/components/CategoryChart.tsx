"use client";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { CategoryStat } from "@/types";

export function CategoryChart({ data }: { data: CategoryStat[] }) {
  if (!data.length) return (
    <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No expense data yet</div>
  );
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={95}
          paddingAngle={3} dataKey="value">
          {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
        </Pie>
        <Tooltip formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, ""]} />
        <Legend iconType="circle" iconSize={8} />
      </PieChart>
    </ResponsiveContainer>
  );
}
