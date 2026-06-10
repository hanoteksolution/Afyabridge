"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  ArrowUpRight,
  FileText,
  Home,
  Layers,
  Pencil,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminStatsRow } from "@/components/admin/admin-stats-row";
import { cn } from "@/lib/utils";

export type PageRow = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  isPublished: boolean;
  isHome: boolean;
  sectionCount: number;
  updatedAt: string;
};

export function PagesAdminView({ pages }: { pages: PageRow[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return pages;
    return pages.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }, [pages, query]);

  const publishedCount = pages.filter((p) => p.isPublished).length;
  const draftCount = pages.length - publishedCount;
  const totalSections = pages.reduce((sum, p) => sum + p.sectionCount, 0);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative overflow-hidden rounded-2xl border border-[#0A1F78]/10 bg-gradient-to-br from-[#0A1F78] via-[#1e40af] to-[#2563EB] p-6 text-white shadow-lg shadow-[#0A1F78]/15 sm:p-7"
      >
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#00C2FF]/20 blur-3xl" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
              <Sparkles className="h-3.5 w-3.5 text-[#00C2FF]" />
              Content management
            </div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Website pages
            </h2>
            <p className="mt-1.5 max-w-xl text-sm text-white/75">
              Manage page structure, publish status, and content sections across
              your site.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="h-11 shrink-0 rounded-xl bg-white text-[#0A1F78] shadow-md hover:bg-white/95"
          >
            <Link href="/admin/pages/new">
              <Plus className="h-4 w-4" />
              New Page
            </Link>
          </Button>
        </div>
      </motion.div>

      <AdminStatsRow
        stats={[
          { title: "Total pages", value: pages.length, icon: "FileText", variant: "indigo" },
          { title: "Published", value: publishedCount, icon: "CheckCircle2", variant: "emerald" },
          { title: "Drafts", value: draftCount, icon: "Clock", variant: "amber" },
          { title: "Total sections", value: totalSections, icon: "Layers", variant: "blue" },
        ]}
      />

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08 }}
        className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm"
      >
        <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h3 className="font-semibold text-[#0A1F78]">All pages</h3>
            <p className="text-sm text-slate-500">
              {filtered.length} of {pages.length} pages shown
            </p>
          </div>
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pages..."
              className="h-10 rounded-xl border-slate-200/80 bg-slate-50/50 pl-9 focus-visible:bg-white"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0A1F78]/5">
              <FileText className="h-6 w-6 text-[#2563EB]" />
            </div>
            <p className="font-medium text-slate-700">No pages found</p>
            <p className="mt-1 text-sm text-slate-500">
              {query ? "Try a different search term" : "Create your first page to get started"}
            </p>
            {!query && (
              <Button asChild className="mt-5 rounded-xl">
                <Link href="/admin/pages/new">
                  <Plus className="h-4 w-4" />
                  Create page
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  {["Page", "Status", "Sections", "Home", "Updated", ""].map(
                    (label) => (
                      <th
                        key={label || "actions"}
                        className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500"
                      >
                        {label}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((page, index) => (
                  <motion.tr
                    key={page.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                    className="group border-b border-slate-50 transition-colors hover:bg-[#0A1F78]/[0.025]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0A1F78]/10 to-[#2563EB]/10 text-[#2563EB] transition-transform group-hover:scale-105">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-slate-900">
                            {page.title}
                          </p>
                          <p className="truncate font-mono text-xs text-slate-400">
                            /{page.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                          page.isPublished
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        )}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            page.isPublished ? "bg-emerald-500" : "bg-amber-500"
                          )}
                        />
                        {page.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        <Layers className="h-3.5 w-3.5 text-[#2563EB]" />
                        {page.sectionCount}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {page.isHome ? (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-[#0A1F78]/10 px-2.5 py-1 text-xs font-semibold text-[#0A1F78]">
                          <Home className="h-3.5 w-3.5" />
                          Home
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {format(new Date(page.updatedAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1 opacity-90 transition-opacity group-hover:opacity-100">
                        {page.isPublished && page.slug && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg text-slate-500 hover:text-[#2563EB]"
                            asChild
                          >
                            <Link
                              href={page.isHome ? "/" : `/${page.slug}`}
                              target="_blank"
                              title="View live page"
                            >
                              <ArrowUpRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 rounded-lg text-[#2563EB] hover:bg-[#2563EB]/10 hover:text-[#0A1F78]"
                          asChild
                        >
                          <Link href={`/admin/pages/${page.id}`}>
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.section>
    </div>
  );
}
