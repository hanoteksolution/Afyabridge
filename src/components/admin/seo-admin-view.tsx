"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  EyeOff,
  FileText,
  Globe,
  Pencil,
  Search,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminStatsRow } from "@/components/admin/admin-stats-row";
import { cn } from "@/lib/utils";

export type SeoRow = {
  id: string;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
  noIndex: boolean;
  updatedAt: string;
  page: { id: string; title: string; slug: string; isHome: boolean } | null;
  blogPost: { id: string; title: string; slug: string } | null;
};

type TypeFilter = "ALL" | "PAGE" | "BLOG";
type IndexFilter = "ALL" | "INDEXED" | "NOINDEX";

function entityLabel(row: SeoRow) {
  if (row.page) return row.page.isHome ? "Home" : row.page.title;
  if (row.blogPost) return row.blogPost.title;
  return "—";
}

function entitySlug(row: SeoRow) {
  if (row.page) return row.page.isHome ? "/" : `/${row.page.slug}`;
  if (row.blogPost) return `/blog/${row.blogPost.slug}`;
  return "";
}

function editHref(row: SeoRow) {
  if (row.page) return `/admin/pages/${row.page.id}`;
  if (row.blogPost) return `/admin/blogs/${row.blogPost.id}`;
  return "#";
}

function liveHref(row: SeoRow) {
  if (row.page) return row.page.isHome ? "/" : `/${row.page.slug}`;
  if (row.blogPost) return `/blog/${row.blogPost.slug}`;
  return null;
}

export function SeoAdminView({ entries }: { entries: SeoRow[] }) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("ALL");
  const [indexFilter, setIndexFilter] = useState<IndexFilter>("ALL");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((row) => {
      const label = entityLabel(row).toLowerCase();
      const slug = entitySlug(row).toLowerCase();
      const title = row.metaTitle?.toLowerCase() || "";
      const desc = row.metaDescription?.toLowerCase() || "";
      const matchesQuery =
        !q ||
        label.includes(q) ||
        slug.includes(q) ||
        title.includes(q) ||
        desc.includes(q);

      const isPage = !!row.page;
      const isBlog = !!row.blogPost;
      const matchesType =
        typeFilter === "ALL" ||
        (typeFilter === "PAGE" && isPage) ||
        (typeFilter === "BLOG" && isBlog);

      const matchesIndex =
        indexFilter === "ALL" ||
        (indexFilter === "INDEXED" && !row.noIndex) ||
        (indexFilter === "NOINDEX" && row.noIndex);

      return matchesQuery && matchesType && matchesIndex;
    });
  }, [entries, query, typeFilter, indexFilter]);

  const pageCount = entries.filter((e) => e.page).length;
  const blogCount = entries.filter((e) => e.blogPost).length;
  const indexedCount = entries.filter((e) => !e.noIndex).length;
  const withOgCount = entries.filter((e) => e.ogImage).length;

  const typeFilters: { id: TypeFilter; label: string }[] = [
    { id: "ALL", label: "All" },
    { id: "PAGE", label: "Pages" },
    { id: "BLOG", label: "Blog posts" },
  ];

  const indexFilters: { id: IndexFilter; label: string }[] = [
    { id: "ALL", label: "Any status" },
    { id: "INDEXED", label: "Indexed" },
    { id: "NOINDEX", label: "No index" },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative overflow-hidden rounded-2xl border border-[#0A1F78]/10 bg-gradient-to-br from-[#0A1F78] via-[#1e40af] to-[#2563EB] p-6 text-white shadow-lg shadow-[#0A1F78]/15 sm:p-7"
      >
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-violet-400/20 blur-3xl" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
              <Sparkles className="h-3.5 w-3.5 text-[#00C2FF]" />
              Discoverability
            </div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              SEO manager
            </h2>
            <p className="mt-1.5 max-w-xl text-sm text-white/75">
              Meta titles, descriptions, Open Graph data, and indexing rules for
              every page and blog post on your site.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="h-11 shrink-0 rounded-xl bg-white text-[#0A1F78] shadow-md hover:bg-white/95"
          >
            <Link href="/admin/pages">
              <FileText className="h-4 w-4" />
              Edit via pages
            </Link>
          </Button>
        </div>
      </motion.div>

      <AdminStatsRow
        stats={[
          { title: "Total entries", value: entries.length, icon: "Globe", variant: "indigo" },
          { title: "Indexed", value: indexedCount, icon: "Eye", variant: "emerald" },
          { title: "Pages", value: pageCount, icon: "FileText", variant: "blue" },
          { title: "With OG image", value: withOgCount, icon: "Image", variant: "cyan" },
        ]}
      />

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08 }}
        className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm"
      >
        <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-4 lg:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="font-semibold text-[#0A1F78]">SEO directory</h3>
              <p className="text-sm text-slate-500">
                {filtered.length} of {entries.length} entries
                {blogCount > 0 && ` · ${pageCount} pages · ${blogCount} posts`}
              </p>
            </div>
            <div className="relative w-full lg:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search titles, slugs, meta..."
                className="h-10 rounded-xl border-slate-200/80 bg-slate-50/50 pl-9 focus-visible:bg-white"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {typeFilters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setTypeFilter(f.id)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  typeFilter === f.id
                    ? "bg-[#0A1F78] text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                )}
              >
                {f.label}
              </button>
            ))}
            <span className="mx-1 hidden h-6 w-px self-center bg-slate-200 sm:block" />
            {indexFilters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setIndexFilter(f.id)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  indexFilter === f.id
                    ? "bg-violet-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50">
              <Globe className="h-6 w-6 text-violet-600" />
            </div>
            <p className="font-medium text-slate-700">No SEO entries found</p>
            <p className="mt-1 text-sm text-slate-500">
              {query || typeFilter !== "ALL" || indexFilter !== "ALL"
                ? "Try adjusting your search or filters"
                : "SEO records are created automatically with pages and blog posts"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  {["Page / post", "Meta title", "Description", "Open Graph", "Index", ""].map(
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
                {filtered.map((row, index) => {
                  const isPage = !!row.page;
                  const live = liveHref(row);
                  const titleLen = row.metaTitle?.length ?? 0;
                  const titleOk = titleLen > 0 && titleLen <= 60;

                  return (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.025 }}
                      className="group border-b border-slate-50 transition-colors hover:bg-[#0A1F78]/[0.025]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105",
                              isPage
                                ? "bg-gradient-to-br from-[#0A1F78]/10 to-[#2563EB]/10 text-[#2563EB]"
                                : "bg-gradient-to-br from-violet-500/10 to-purple-500/10 text-violet-600"
                            )}
                          >
                            {isPage ? (
                              <FileText className="h-4 w-4" />
                            ) : (
                              <BookOpen className="h-4 w-4" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="truncate font-medium text-slate-900">
                                {entityLabel(row)}
                              </p>
                              <span
                                className={cn(
                                  "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                                  isPage
                                    ? "bg-blue-50 text-blue-700"
                                    : "bg-violet-50 text-violet-700"
                                )}
                              >
                                {isPage ? "Page" : "Post"}
                              </span>
                            </div>
                            <p className="truncate font-mono text-xs text-slate-400">
                              {entitySlug(row)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="max-w-[220px] truncate font-medium text-slate-800">
                          {row.metaTitle || (
                            <span className="font-normal italic text-slate-400">
                              Not set
                            </span>
                          )}
                        </p>
                        {row.metaTitle && (
                          <p
                            className={cn(
                              "mt-0.5 text-[10px] font-medium",
                              titleOk ? "text-emerald-600" : "text-amber-600"
                            )}
                          >
                            {titleLen} chars
                            {!titleOk && titleLen > 60 && " · too long"}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <p className="max-w-[280px] line-clamp-2 text-slate-600">
                          {row.metaDescription || (
                            <span className="italic text-slate-400">No description</span>
                          )}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                            row.ogImage
                              ? "bg-cyan-50 text-cyan-700"
                              : "bg-slate-100 text-slate-500"
                          )}
                        >
                          {row.ogImage ? "Configured" : "Missing"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                            row.noIndex
                              ? "bg-slate-100 text-slate-600"
                              : "bg-emerald-50 text-emerald-700"
                          )}
                        >
                          {row.noIndex ? (
                            <EyeOff className="h-3 w-3" />
                          ) : (
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          )}
                          {row.noIndex ? "No index" : "Indexed"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          {live && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg text-slate-500 hover:text-[#2563EB]"
                              asChild
                            >
                              <Link href={live} target="_blank" title="View live">
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
                            <Link href={editHref(row)}>
                              <Pencil className="h-3.5 w-3.5" />
                              Edit SEO
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
