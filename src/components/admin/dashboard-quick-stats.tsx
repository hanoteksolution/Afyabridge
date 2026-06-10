"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getLucideIcon } from "@/lib/icons";

const statStyles = [
  {
    bar: "from-[#2563EB] to-[#60a5fa]",
    icon: "bg-blue-50 text-[#2563EB]",
    hover: "hover:border-blue-200 hover:bg-blue-50/40",
  },
  {
    bar: "from-[#0A1F78] to-[#6366f1]",
    icon: "bg-indigo-50 text-[#0A1F78]",
    hover: "hover:border-indigo-200 hover:bg-indigo-50/40",
  },
  {
    bar: "from-[#059669] to-[#34d399]",
    icon: "bg-emerald-50 text-emerald-600",
    hover: "hover:border-emerald-200 hover:bg-emerald-50/40",
  },
] as const;

interface QuickStat {
  label: string;
  value: string | number;
  icon: string;
}

export function DashboardQuickStats({ stats }: { stats: QuickStat[] }) {
  return (
    <div className="space-y-3">
      {stats.map((stat, index) => {
        const Icon = getLucideIcon(stat.icon);
        return (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.35 + index * 0.08 }}
          whileHover={{ x: 4 }}
          className={cn(
            "group relative flex items-center justify-between overflow-hidden rounded-xl border border-slate-100 bg-slate-50/60 p-4 transition-colors duration-200",
            statStyles[index]?.hover
          )}
        >
          <div
            className={cn(
              "absolute inset-y-0 left-0 w-1 bg-gradient-to-b opacity-80",
              statStyles[index]?.bar
            )}
          />
          <div className="flex items-center gap-3 pl-2">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105",
                statStyles[index]?.icon
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium text-slate-600">{stat.label}</span>
          </div>
          <span className="text-lg font-bold text-[#0A1F78]">{stat.value}</span>
        </motion.div>
      );
      })}
    </div>
  );
}
