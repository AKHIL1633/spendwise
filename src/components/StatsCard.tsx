"use client";
import { LucideIcon } from "lucide-react";

interface Props {
  label:  string;
  value:  string;
  icon:   LucideIcon;
  color:  string;
  bg:     string;
  trend?: string;
}

export function StatsCard({ label, value, icon: Icon, color, bg, trend }: Props) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        {trend && <span className="text-xs text-gray-400">{trend}</span>}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}
