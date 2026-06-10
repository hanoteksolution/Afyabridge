"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BlogEditorHeroProps {
  title: string;
  slug?: string;
  isPublished?: boolean;
  mode?: "edit" | "new";
}

export function BlogEditorHero({
  title,
  slug,
  isPublished = false,
  mode = "edit",
}: BlogEditorHeroProps) {
  const liveUrl = slug ? `/blog/${slug}` : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="relative overflow-hidden rounded-2xl border border-[#0A1F78]/10 bg-gradient-to-br from-[#0A1F78] via-[#1e40af] to-[#2563EB] p-6 text-white shadow-lg shadow-[#0A1F78]/15 sm:p-7"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-violet-400/20 blur-3xl" />

      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-8 rounded-lg border border-white/15 bg-white/10 px-3 text-white hover:bg-white/15 hover:text-white"
            >
              <Link href="/admin/blogs">
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to blog
              </Link>
            </Button>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-xs font-medium">
              <Sparkles className="h-3 w-3 text-[#00C2FF]" />
              {mode === "new" ? "New post" : "Blog editor"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="line-clamp-2 text-xl font-semibold tracking-tight sm:text-2xl">
                {mode === "new" ? "New blog post" : title}
              </h2>
              {slug && (
                <p className="mt-0.5 truncate font-mono text-sm text-white/70">
                  /blog/{slug}
                </p>
              )}
            </div>
          </div>

          {mode === "edit" && (
            <div className="mt-4">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                  isPublished
                    ? "bg-emerald-400/20 text-emerald-100"
                    : "bg-amber-400/20 text-amber-100"
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    isPublished ? "bg-emerald-300" : "bg-amber-300"
                  )}
                />
                {isPublished ? "Published" : "Draft"}
              </span>
            </div>
          )}
        </div>

        {liveUrl && isPublished && (
          <Button
            asChild
            className="h-10 shrink-0 rounded-xl border border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
          >
            <Link href={liveUrl} target="_blank">
              View live
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
    </motion.div>
  );
}
