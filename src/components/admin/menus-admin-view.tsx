"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { LayoutGrid, Link2, PanelTop, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminStatsRow } from "@/components/admin/admin-stats-row";
import { MenuEditor, type MenuItemRow } from "@/components/admin/menu-editor";
import { cn } from "@/lib/utils";

export type MenuRow = {
  id: string;
  name: string;
  location: string | null;
  items: MenuItemRow[];
};

function countItems(items: MenuItemRow[]) {
  let top = items.length;
  let sub = 0;
  for (const item of items) {
    sub += item.children?.length ?? 0;
  }
  return { top, sub, total: top + sub };
}

const locationMeta: Record<string, { label: string; icon: typeof PanelTop; tone: string }> = {
  header: {
    label: "Header navigation",
    icon: PanelTop,
    tone: "from-[#2563EB] to-[#3b82f6]",
  },
  footer: {
    label: "Footer navigation",
    icon: LayoutGrid,
    tone: "from-violet-600 to-purple-600",
  },
};

export function MenusAdminView({ menus }: { menus: MenuRow[] }) {
  const totals = menus.reduce(
    (acc, menu) => {
      const c = countItems(menu.items);
      return {
        menus: acc.menus + 1,
        top: acc.top + c.top,
        sub: acc.sub + c.sub,
        links: acc.links + c.total,
      };
    },
    { menus: 0, top: 0, sub: 0, links: 0 }
  );

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
              Site navigation
            </div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Menu builder
            </h2>
            <p className="mt-1.5 max-w-xl text-sm text-white/75">
              Structure header and footer navigation with nested links. Changes
              appear on the live site after you save.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="h-11 shrink-0 rounded-xl bg-white text-[#0A1F78] shadow-md hover:bg-white/95"
          >
            <Link href="/" target="_blank">
              <Link2 className="h-4 w-4" />
              Preview site
            </Link>
          </Button>
        </div>
      </motion.div>

      <AdminStatsRow
        stats={[
          { title: "Menus", value: totals.menus, icon: "LayoutGrid", variant: "indigo" },
          { title: "Top-level links", value: totals.top, icon: "Menu", variant: "blue" },
          { title: "Sub-menu items", value: totals.sub, icon: "Layers", variant: "cyan" },
          { title: "Total links", value: totals.links, icon: "Link2", variant: "emerald" },
        ]}
      />

      <div className="space-y-8">
        {menus.map((menu, index) => {
          const loc = menu.location?.toLowerCase() || "header";
          const meta = locationMeta[loc] || locationMeta.header;
          const LocIcon = meta.icon;
          const counts = countItems(menu.items);

          return (
            <motion.section
              key={menu.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.06 + index * 0.05 }}
              className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm"
            >
              <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md",
                      meta.tone
                    )}
                  >
                    <LocIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-[#0A1F78] capitalize">
                      {menu.name}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {meta.label}
                      {menu.location && (
                        <span className="ml-2 font-mono text-xs text-slate-400">
                          · {menu.location}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-medium">
                    {counts.top} main
                  </span>
                  <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-medium">
                    {counts.sub} nested
                  </span>
                </div>
              </div>

              <div className="p-6">
                <MenuEditor menuId={menu.id} items={menu.items} />
              </div>
            </motion.section>
          );
        })}
      </div>
    </div>
  );
}
