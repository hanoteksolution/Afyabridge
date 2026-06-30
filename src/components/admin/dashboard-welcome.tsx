"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  FileText,
  BookOpen,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface DashboardWelcomeProps {
  name?: string | null;
  pageCount: number;
  postCount: number;
  messageCount: number;
}

export function DashboardWelcome({
  name,
  pageCount,
  postCount,
  messageCount,
}: DashboardWelcomeProps) {
  const greeting = getGreeting();
  const firstName = name?.split(" ")[0] || "there";
  const today = format(new Date(), "EEEE, MMMM d");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl border border-[#0A1F78]/10 bg-gradient-to-br from-[#0A1F78] via-[#1e3a8a] to-[#2563EB] p-6 text-white shadow-xl shadow-[#0A1F78]/20 sm:p-8"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl" />

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-[#7dd3fc]" />
            {today}
          </div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
            {greeting}, {firstName}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/75 sm:text-base">
            Your site at a glance — {pageCount} pages, {postCount} posts,{" "}
            {messageCount} messages waiting in your inbox.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {[
              { icon: FileText, label: "Pages", value: pageCount },
              { icon: BookOpen, label: "Posts", value: postCount },
              { icon: MessageSquare, label: "Messages", value: messageCount },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 backdrop-blur-sm"
              >
                <item.icon className="h-4 w-4 text-[#7dd3fc]" />
                <span className="text-lg font-semibold">{item.value}</span>
                <span className="text-xs text-white/60">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-3">
          <Link
            href="/admin/pages/new"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#0A1F78] shadow-md transition hover:bg-white/95"
          >
            New page
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            href="/admin/blogs/new"
            className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15"
          >
            New post
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
