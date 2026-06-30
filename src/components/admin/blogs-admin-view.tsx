"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  ArrowUpRight,
  BookOpen,
  ImageIcon,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminStatsRow } from "@/components/admin/admin-stats-row";
import { cn } from "@/lib/utils";

export type BlogRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  updatedAt: string;
  category: { id: string; name: string } | null;
  author: { name: string | null } | null;
  tagCount: number;
};

type StatusFilter = "ALL" | "PUBLISHED" | "DRAFT";

export function BlogsAdminView({
  posts,
  categoryCount,
}: {
  posts: BlogRow[];
  categoryCount: number;
}) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesQuery =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.slug.toLowerCase().includes(q) ||
        post.excerpt?.toLowerCase().includes(q) ||
        post.category?.name.toLowerCase().includes(q) ||
        post.author?.name?.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "PUBLISHED" && post.isPublished) ||
        (statusFilter === "DRAFT" && !post.isPublished);

      return matchesQuery && matchesStatus;
    });
  }, [posts, query, statusFilter]);

  const publishedCount = posts.filter((p) => p.isPublished).length;
  const draftCount = posts.length - publishedCount;

  const statusFilters: { id: StatusFilter; label: string }[] = [
    { id: "ALL", label: "All posts" },
    { id: "PUBLISHED", label: "Published" },
    { id: "DRAFT", label: "Drafts" },
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
              Posts
            </div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              All posts
            </h2>
            <p className="mt-1.5 max-w-xl text-sm text-white/75">
              Write and publish articles — same idea as WordPress posts.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="h-11 shrink-0 rounded-xl bg-white text-[#0A1F78] shadow-md hover:bg-white/95"
          >
            <Link href="/admin/blogs/new">
              <Plus className="h-4 w-4" />
              New post
            </Link>
          </Button>
        </div>
      </motion.div>

      <AdminStatsRow
        stats={[
          { title: "Total posts", value: posts.length, icon: "BookOpen", variant: "indigo" },
          { title: "Published", value: publishedCount, icon: "CheckCircle2", variant: "emerald" },
          { title: "Drafts", value: draftCount, icon: "Clock", variant: "amber" },
          { title: "Categories", value: categoryCount, icon: "Layers", variant: "blue" },
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
              <h3 className="font-semibold text-[#0A1F78]">All posts</h3>
              <p className="text-sm text-slate-500">
                {filtered.length} of {posts.length} posts shown
              </p>
            </div>
            <div className="relative w-full lg:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search posts, authors, categories..."
                className="h-10 rounded-xl border-slate-200/80 bg-slate-50/50 pl-9 focus-visible:bg-white"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {statusFilters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setStatusFilter(f.id)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  statusFilter === f.id
                    ? "bg-[#0A1F78] text-white shadow-sm"
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
              <BookOpen className="h-6 w-6 text-violet-600" />
            </div>
            <p className="font-medium text-slate-700">No posts found</p>
            <p className="mt-1 text-sm text-slate-500">
              {query || statusFilter !== "ALL"
                ? "Try adjusting your search or filters"
                : "Create your first blog post to get started"}
            </p>
            {!query && statusFilter === "ALL" && (
              <Button asChild className="mt-5 rounded-xl">
                <Link href="/admin/blogs/new">
                  <Plus className="h-4 w-4" />
                  New post
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  {["Post", "Category", "Author", "Status", "Published", ""].map(
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
                {filtered.map((post, index) => (
                  <motion.tr
                    key={post.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                    className="group border-b border-slate-50 transition-colors hover:bg-[#0A1F78]/[0.025]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-violet-100 to-blue-50">
                          {post.coverImage ? (
                            <Image
                              src={post.coverImage}
                              alt=""
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-slate-300">
                              <ImageIcon className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-slate-900">
                            {post.title}
                          </p>
                          <p className="truncate font-mono text-xs text-slate-400">
                            /blog/{post.slug}
                          </p>
                          {post.excerpt && (
                            <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                              {post.excerpt}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {post.category ? (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700">
                          <BookOpen className="h-3 w-3" />
                          {post.category.name}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {post.author?.name || "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                          post.isPublished
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        )}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            post.isPublished ? "bg-emerald-500" : "bg-amber-500"
                          )}
                        />
                        {post.isPublished ? "Published" : "Draft"}
                      </span>
                      {post.tagCount > 0 && (
                        <span className="mt-1.5 flex items-center gap-1 text-[10px] text-slate-400">
                          <Tag className="h-3 w-3" />
                          {post.tagCount} tag{post.tagCount === 1 ? "" : "s"}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {post.publishedAt
                        ? format(new Date(post.publishedAt), "MMM d, yyyy")
                        : format(new Date(post.updatedAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {post.isPublished && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg text-slate-500 hover:text-[#2563EB]"
                            asChild
                          >
                            <Link
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              title="View live post"
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
                          <Link href={`/admin/blogs/${post.id}`}>
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
