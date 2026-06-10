"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface DashboardWelcomeProps {
  name?: string | null;
  leadCount: number;
  pageCount: number;
}

export function DashboardWelcome({ name, leadCount, pageCount }: DashboardWelcomeProps) {
  const greeting = getGreeting();
  const firstName = name?.split(" ")[0] || "Admin";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0A1F78] via-[#1e3a8a] to-[#2563EB] p-6 text-white shadow-lg shadow-[#0A1F78]/20 sm:p-8"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#00C2FF]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 left-1/3 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-[#00C2FF]" />
            Afya Bridge Control Center
          </div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {greeting}, {firstName}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
            Your platform overview at a glance — {leadCount} leads captured,{" "}
            {pageCount} published pages, and content ready to manage.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/pages"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-[#0A1F78] shadow-md transition-transform hover:-translate-y-0.5"
          >
            Manage pages
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            href="/admin/contacts"
            className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/15"
          >
            View leads
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
