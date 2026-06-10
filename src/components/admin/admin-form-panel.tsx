"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminFormPanelProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  iconTone?: "blue" | "indigo" | "emerald" | "violet";
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  delay?: number;
}

const iconTones = {
  blue: "from-[#2563EB] to-[#3b82f6] shadow-[#2563EB]/20",
  indigo: "from-[#0A1F78] to-[#3730a3] shadow-[#0A1F78]/20",
  emerald: "from-emerald-600 to-teal-500 shadow-emerald-500/20",
  violet: "from-violet-600 to-purple-500 shadow-violet-500/20",
};

export function AdminFormPanel({
  title,
  description,
  icon: Icon,
  iconTone = "indigo",
  children,
  footer,
  className,
  delay = 0,
}: AdminFormPanelProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm",
        className
      )}
    >
      <div className="border-b border-slate-100 px-6 py-5">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md",
              iconTones[iconTone]
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-[#0A1F78]">
              {title}
            </h3>
            {description && (
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            )}
          </div>
        </div>
      </div>
      <div className="space-y-5 p-6">{children}</div>
      {footer && (
        <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
          {footer}
        </div>
      )}
    </motion.section>
  );
}

export const adminFieldClass =
  "mt-1.5 h-11 rounded-xl border-slate-200/80 bg-slate-50/50 shadow-sm transition-colors focus-visible:border-[#2563EB]/40 focus-visible:bg-white";

export const adminTextareaClass =
  "mt-1.5 rounded-xl border-slate-200/80 bg-slate-50/50 shadow-sm transition-colors focus-visible:border-[#2563EB]/40 focus-visible:bg-white";
