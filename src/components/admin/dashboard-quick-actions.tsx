"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  Image as ImageIcon,
  Menu,
  Settings,
  GalleryHorizontal,
  MessageSquare,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const actions = [
  {
    href: "/admin/pages",
    label: "Pages",
    description: "Edit site content",
    icon: FileText,
    tone: "from-indigo-500/10 to-indigo-600/5 text-indigo-700",
  },
  {
    href: "/admin/blogs",
    label: "Posts",
    description: "Write articles",
    icon: BookOpen,
    tone: "from-blue-500/10 to-blue-600/5 text-blue-700",
  },
  {
    href: "/admin/media",
    label: "Media",
    description: "Upload images",
    icon: ImageIcon,
    tone: "from-violet-500/10 to-violet-600/5 text-violet-700",
  },
  {
    href: "/admin/slides",
    label: "Home slider",
    description: "Hero banners",
    icon: GalleryHorizontal,
    tone: "from-cyan-500/10 to-cyan-600/5 text-cyan-800",
  },
  {
    href: "/admin/menus",
    label: "Menus",
    description: "Navigation links",
    icon: Menu,
    tone: "from-slate-500/10 to-slate-600/5 text-slate-700",
  },
  {
    href: "/admin/contacts",
    label: "Messages",
    description: "Contact inbox",
    icon: MessageSquare,
    tone: "from-emerald-500/10 to-emerald-600/5 text-emerald-700",
  },
  {
    href: "/admin/settings",
    label: "Settings",
    description: "Logo & branding",
    icon: Settings,
    tone: "from-amber-500/10 to-amber-600/5 text-amber-800",
  },
];

export function DashboardQuickActions() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {actions.map((action, index) => (
        <motion.div
          key={action.href}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + index * 0.04, duration: 0.4 }}
        >
          <Link
            href={action.href}
            className="group flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#0A1F78]/15 hover:shadow-md"
          >
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br",
                action.tone
              )}
            >
              <action.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-[#0A1F78] group-hover:text-[#2563EB]">
                {action.label}
              </p>
              <p className="text-xs text-slate-500">{action.description}</p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
