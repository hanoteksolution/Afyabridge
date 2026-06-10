"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Eye,
  EyeOff,
  Layers,
  Pencil,
  Search,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminStatsRow } from "@/components/admin/admin-stats-row";
import {
  SECTION_LABELS,
  SECTION_META,
  SECTION_SHORT_LABELS,
} from "@/lib/section-admin-meta";
import { getLucideIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { SectionType } from "@prisma/client";

export type SectionRow = {
  id: string;
  title: string | null;
  type: SectionType;
  order: number;
  isVisible: boolean;
  page: {
    id: string;
    title: string;
    slug: string;
    isHome: boolean;
  };
};

export function SectionsAdminView({ sections }: { sections: SectionRow[] }) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<SectionType | "ALL">("ALL");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sections.filter((s) => {
      const matchesQuery =
        !q ||
        (s.title || SECTION_LABELS[s.type]).toLowerCase().includes(q) ||
        s.page.title.toLowerCase().includes(q) ||
        s.page.slug.toLowerCase().includes(q) ||
        SECTION_SHORT_LABELS[s.type].toLowerCase().includes(q);
      const matchesType = typeFilter === "ALL" || s.type === typeFilter;
      return matchesQuery && matchesType;
    });
  }, [sections, query, typeFilter]);

  const visibleCount = sections.filter((s) => s.isVisible).length;
  const pageCount = new Set(sections.map((s) => s.page.id)).size;
  const typeCount = new Set(sections.map((s) => s.type)).size;

  const typeOptions = Array.from(new Set(sections.map((s) => s.type)));

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
              Content blocks
            </div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              All sections
            </h2>
            <p className="mt-1.5 max-w-xl text-sm text-white/75">
              Overview of every content section across your site. Open a page to
              reorder and edit section content.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="h-11 shrink-0 rounded-xl bg-white text-[#0A1F78] shadow-md hover:bg-white/95"
          >
            <Link href="/admin/pages">
              <Layers className="h-4 w-4" />
              Manage via pages
            </Link>
          </Button>
        </div>
      </motion.div>

      <AdminStatsRow
        stats={[
          { title: "Total sections", value: sections.length, icon: "Layers", variant: "indigo" },
          { title: "Visible", value: visibleCount, icon: "Eye", variant: "emerald" },
          { title: "Pages with sections", value: pageCount, icon: "FileText", variant: "blue" },
          { title: "Section types", value: typeCount, icon: "LayoutGrid", variant: "cyan" },
        ]}
      />

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08 }}
        className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm"
      >
        <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-4 lg:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold text-[#0A1F78]">Section directory</h3>
              <p className="text-sm text-slate-500">
                {filtered.length} of {sections.length} sections shown
              </p>
            </div>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search sections or pages..."
                className="h-10 rounded-xl border-slate-200/80 bg-slate-50/50 pl-9 focus-visible:bg-white"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTypeFilter("ALL")}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                typeFilter === "ALL"
                  ? "bg-[#0A1F78] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
              )}
            >
              All types
            </button>
            {typeOptions.map((type) => {
              const meta = SECTION_META[type];
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTypeFilter(type)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    typeFilter === type
                      ? "bg-[#0A1F78] text-white"
                      : cn(meta.chip, "hover:opacity-80")
                  )}
                >
                  {SECTION_SHORT_LABELS[type]}
                </button>
              );
            })}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0A1F78]/5">
              <Layers className="h-6 w-6 text-[#2563EB]" />
            </div>
            <p className="font-medium text-slate-700">No sections found</p>
            <p className="mt-1 text-sm text-slate-500">
              Try a different search or filter
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  {["Section", "Type", "Page", "Order", "Status", ""].map(
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
                {filtered.map((section, index) => {
                  const meta = SECTION_META[section.type];
                  const Icon = getLucideIcon(meta.icon);
                  const displayTitle =
                    section.title || SECTION_LABELS[section.type];

                  return (
                    <motion.tr
                      key={section.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.02 }}
                      className={cn(
                        "group border-b border-slate-50 transition-colors hover:bg-[#0A1F78]/[0.025]",
                        !section.isVisible && "opacity-70"
                      )}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm transition-transform group-hover:scale-105",
                              meta.accent
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="font-medium text-slate-900">
                            {displayTitle}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                            meta.chip
                          )}
                        >
                          {SECTION_SHORT_LABELS[section.type]}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-slate-800">
                            {section.page.title}
                          </p>
                          <p className="font-mono text-xs text-slate-400">
                            /{section.page.slug}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex h-7 min-w-[2rem] items-center justify-center rounded-lg bg-slate-100 px-2 font-mono text-xs font-semibold text-slate-600">
                          {section.order}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                            section.isVisible
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          )}
                        >
                          {section.isVisible ? (
                            <Eye className="h-3 w-3" />
                          ) : (
                            <EyeOff className="h-3 w-3" />
                          )}
                          {section.isVisible ? "Visible" : "Hidden"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg text-slate-500 hover:text-[#2563EB]"
                            asChild
                          >
                            <Link
                              href={
                                section.page.isHome
                                  ? "/"
                                  : `/${section.page.slug}`
                              }
                              target="_blank"
                              title="View page"
                            >
                              <ArrowUpRight className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 rounded-lg text-[#2563EB] hover:bg-[#2563EB]/10"
                            asChild
                          >
                            <Link href={`/admin/pages/${section.page.id}`}>
                              <Pencil className="h-3.5 w-3.5" />
                              Edit page
                            </Link>
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.section>
    </div>
  );
}
