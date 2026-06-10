"use client";

import { StatsCard, type StatsVariant } from "@/components/admin/stats-card";

export type AdminStatItem = {
  title: string;
  value: string | number;
  icon: string;
  variant?: StatsVariant;
  change?: string;
  trend?: "up" | "down" | "neutral";
};

export function AdminStatsRow({ stats }: { stats: AdminStatItem[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => (
        <StatsCard key={stat.title} {...stat} index={index} />
      ))}
    </div>
  );
}
