"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";
import { getLucideIcon } from "@/lib/icons";

const variants = {
  blue: {
    accent: "from-[#2563EB] to-[#3b82f6]",
    icon: "bg-[#2563EB]/10 text-[#2563EB]",
    glow: "group-hover:shadow-[#2563EB]/20",
    ring: "from-[#2563EB]/30 via-[#60a5fa]/20 to-transparent",
    dot: "bg-[#2563EB]",
  },
  cyan: {
    accent: "from-[#0891b2] to-[#00C2FF]",
    icon: "bg-[#00C2FF]/10 text-[#0891b2]",
    glow: "group-hover:shadow-[#00C2FF]/25",
    ring: "from-[#00C2FF]/30 via-[#67e8f9]/20 to-transparent",
    dot: "bg-[#00C2FF]",
  },
  indigo: {
    accent: "from-[#0A1F78] to-[#3730a3]",
    icon: "bg-[#0A1F78]/10 text-[#0A1F78]",
    glow: "group-hover:shadow-[#0A1F78]/20",
    ring: "from-[#0A1F78]/30 via-[#6366f1]/20 to-transparent",
    dot: "bg-[#0A1F78]",
  },
  emerald: {
    accent: "from-[#059669] to-[#10B981]",
    icon: "bg-emerald-500/10 text-emerald-600",
    glow: "group-hover:shadow-emerald-500/20",
    ring: "from-emerald-400/30 via-emerald-300/20 to-transparent",
    dot: "bg-emerald-500",
  },
  amber: {
    accent: "from-[#d97706] to-[#f59e0b]",
    icon: "bg-amber-500/10 text-amber-700",
    glow: "group-hover:shadow-amber-500/20",
    ring: "from-amber-400/30 via-amber-300/20 to-transparent",
    dot: "bg-amber-500",
  },
} as const;

export type StatsVariant = keyof typeof variants;

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 1100;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [isInView, value]);

  return <span ref={ref}>{display.toLocaleString()}</span>;
}

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: string;
  trend?: "up" | "down" | "neutral";
  variant?: StatsVariant;
  index?: number;
}

export function StatsCard({
  title,
  value,
  change,
  icon,
  trend = "neutral",
  variant = "blue",
  index = 0,
}: StatsCardProps) {
  const Icon = getLucideIcon(icon);
  const style = variants[variant];
  const numericValue = typeof value === "number" ? value : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/60 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-xl",
        style.glow
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br opacity-60 blur-2xl transition-opacity duration-300 group-hover:opacity-100",
          style.ring
        )}
      />
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-90",
          style.accent
        )}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105",
            style.icon
          )}
        >
          <Icon className="h-5 w-5" />
        </div>

        {change && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
              trend === "up" && "bg-emerald-50 text-emerald-700",
              trend === "down" && "bg-red-50 text-red-600",
              trend === "neutral" && "bg-slate-100 text-slate-600"
            )}
          >
            {trend === "up" && <TrendingUp className="h-3 w-3" />}
            {trend === "down" && <TrendingDown className="h-3 w-3" />}
            {change}
          </span>
        )}
      </div>

      <div className="relative mt-5">
        <div className="text-3xl font-bold tracking-tight text-[#0A1F78]">
          {numericValue !== null ? <AnimatedNumber value={numericValue} /> : value}
        </div>
        <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
          <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
          {title}
        </div>
      </div>
    </motion.div>
  );
}
