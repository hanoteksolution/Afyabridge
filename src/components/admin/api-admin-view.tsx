"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Copy,
  Check,
  Globe,
  Lock,
  Search,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { API_ENDPOINTS, getBaseUrl } from "@/lib/api/registry";
import { AdminStatsRow } from "@/components/admin/admin-stats-row";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const methodColors: Record<string, string> = {
  GET: "bg-emerald-500/15 text-emerald-700 border-emerald-200",
  POST: "bg-sky-500/15 text-sky-700 border-sky-200",
  PUT: "bg-amber-500/15 text-amber-700 border-amber-200",
  PATCH: "bg-violet-500/15 text-violet-700 border-violet-200",
  DELETE: "bg-red-500/15 text-red-700 border-red-200",
};

export function ApiAdminView() {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const baseUrl = getBaseUrl();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return API_ENDPOINTS;
    return API_ENDPOINTS.filter(
      (ep) =>
        ep.path.toLowerCase().includes(q) ||
        ep.description.toLowerCase().includes(q) ||
        ep.tags.some((t) => t.includes(q))
    );
  }, [query]);

  const publicCount = API_ENDPOINTS.filter((e) => e.auth === "public").length;
  const adminCount = API_ENDPOINTS.filter((e) => e.auth === "admin").length;

  async function copyUrl(path: string) {
    const url = `${baseUrl}${path.replace(":slug", "home")}`;
    await navigator.clipboard.writeText(url);
    setCopied(path);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-[#0A1F78]/10 bg-gradient-to-br from-[#0A1F78] via-[#1e3a8a] to-[#2563EB] p-8 text-white shadow-xl"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#00C2FF]/20 blur-3xl" />
        <div className="relative">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            REST API v1
          </div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Backend endpoints
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70">
            Manage and test HTTP endpoints directly. These routes use PostgreSQL
            via <code className="rounded bg-white/10 px-1.5 py-0.5">src/lib/db.ts</code>{" "}
            (no Prisma on this layer). Add new routes under{" "}
            <code className="rounded bg-white/10 px-1.5 py-0.5">src/app/api/v1/</code>{" "}
            and register them in{" "}
            <code className="rounded bg-white/10 px-1.5 py-0.5">src/lib/api/registry.ts</code>.
          </p>
        </div>
      </motion.div>

      <AdminStatsRow
        stats={[
          { title: "Total endpoints", value: API_ENDPOINTS.length, icon: "Link2", variant: "indigo" },
          { title: "Public", value: publicCount, icon: "Globe", variant: "emerald" },
          { title: "Admin only", value: adminCount, icon: "Shield", variant: "blue" },
          { title: "Base URL", value: "v1", icon: "Layers", variant: "cyan" },
        ]}
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search endpoints by path, tag, or description..."
            className="h-11 rounded-xl border-slate-200 pl-10"
          />
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Base URL: <span className="font-mono text-slate-700">{baseUrl}</span>
        </p>
      </div>

      <div className="space-y-3">
        {filtered.map((endpoint, index) => {
          const fullPath = `${baseUrl}${endpoint.path}`;
          return (
            <motion.div
              key={`${endpoint.method}-${endpoint.path}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "rounded-lg border px-2.5 py-1 font-mono text-xs font-bold",
                        methodColors[endpoint.method]
                      )}
                    >
                      {endpoint.method}
                    </span>
                    <code className="break-all font-mono text-sm text-[#0A1F78]">
                      {endpoint.path}
                    </code>
                    <Badge
                      variant="outline"
                      className={cn(
                        "gap-1",
                        endpoint.auth === "admin"
                          ? "border-amber-200 bg-amber-50 text-amber-800"
                          : "border-emerald-200 bg-emerald-50 text-emerald-800"
                      )}
                    >
                      {endpoint.auth === "admin" ? (
                        <Lock className="h-3 w-3" />
                      ) : (
                        <Globe className="h-3 w-3" />
                      )}
                      {endpoint.auth}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{endpoint.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {endpoint.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => copyUrl(endpoint.path)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  >
                    {copied === endpoint.path ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    Copy URL
                  </button>
                  {endpoint.method === "GET" && endpoint.auth === "public" && (
                    <a
                      href={fullPath.replace(":slug", "home")}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A1F78] px-3 py-2 text-xs font-medium text-white hover:bg-[#0A1F78]/90"
                    >
                      Try it
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
