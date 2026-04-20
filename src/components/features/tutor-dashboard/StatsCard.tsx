import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isUp: boolean;
  };
  color?: string;
}

export default function StatsCard({ 
  label, 
  value, 
  icon: Icon, 
  trend,
  color = "indigo" 
}: StatsCardProps) {
  
  const colorMap: Record<string, string> = {
    indigo: "text-indigo-600 bg-indigo-50",
    emerald: "text-emerald-600 bg-emerald-50",
    amber: "text-amber-600 bg-amber-50",
    pink: "text-pink-600 bg-pink-50"
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", colorMap[color])}>
           <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={cn(
            "px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1",
            trend.isUp ? "bg-emerald-100 text-emerald-700" : "bg-pink-100 text-pink-700"
          )}>
            {trend.isUp ? "+" : "-"}{trend.value}%
          </div>
        )}
      </div>
      
      <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
         <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
         <span className="text-xs font-bold text-slate-400">vs last month</span>
      </div>
    </div>
  );
}
