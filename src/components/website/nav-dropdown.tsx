"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight, Building2, Hospital, BookOpen, FileText, HelpCircle,
  Users, Info, Mail, Layers, type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type DropdownChild = { label: string; href: string; desc: string };

type NavDropdownProps = {
  parent: { label: string; href: string };
  children: DropdownChild[];
  onClose: () => void;
  isActive: (href: string) => boolean;
};

const INTRO: Record<string, { eyebrow: string; title: string }> = {
  Solutions: { eyebrow: "By facility type", title: "Healthcare Solutions" },
  Resources: { eyebrow: "Knowledge hub", title: "Resources & Insights" },
  Company: { eyebrow: "About Afya Bridge", title: "Our Company" },
};

const CHILD_META: Record<string, { icon: LucideIcon; desc: string; accent: string }> = {
  "For Clinics": {
    icon: Building2,
    desc: "Fast onboarding, essential modules, affordable",
    accent: "from-blue-500 to-indigo-600",
  },
  "For Hospitals": {
    icon: Hospital,
    desc: "Integrated departments, leadership dashboards",
    accent: "from-cyan-500 to-sky-600",
  },
  Blog: {
    icon: BookOpen,
    desc: "Healthcare technology insights",
    accent: "from-violet-500 to-purple-600",
  },
  "Case Studies": {
    icon: FileText,
    desc: "Real results from real facilities",
    accent: "from-emerald-500 to-teal-600",
  },
  FAQ: {
    icon: HelpCircle,
    desc: "Common questions answered",
    accent: "from-amber-500 to-orange-600",
  },
  "About Us": {
    icon: Info,
    desc: "Mission, vision and values",
    accent: "from-blue-500 to-indigo-600",
  },
  Resources: {
    icon: Layers,
    desc: "Guides and digital tools",
    accent: "from-cyan-500 to-sky-600",
  },
  Contact: {
    icon: Mail,
    desc: "Demos, partnerships and support",
    accent: "from-rose-500 to-pink-600",
  },
  "Why Afya Bridge": {
    icon: Users,
    desc: "Local expertise, proven results",
    accent: "from-indigo-500 to-blue-600",
  },
};

function getMeta(child: DropdownChild) {
  return (
    CHILD_META[child.label] ?? {
      icon: ArrowRight,
      desc: child.desc || "Explore this section",
      accent: "from-[#041B52] to-[#2563EB]",
    }
  );
}

export function NavDropdown({ parent, children, onClose, isActive }: NavDropdownProps) {
  const intro = INTRO[parent.label] ?? { eyebrow: "Explore", title: parent.label };
  const cols = children.length <= 2 ? children.length : children.length <= 4 ? 2 : 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="absolute left-0 right-0 top-full z-[100] border-t border-slate-100/80 bg-white/98 shadow-[0_12px_40px_rgba(4,27,82,0.1)] backdrop-blur-md"
    >
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-stretch gap-4 lg:gap-5">
          {/* Compact intro strip */}
          <div className="hidden w-[200px] shrink-0 flex-col justify-between rounded-xl bg-gradient-to-br from-[#041B52] to-[#0D2F8E] px-4 py-3.5 text-white lg:flex">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#60A5FA]">
                {intro.eyebrow}
              </p>
              <h3 className="mt-1 text-sm font-bold leading-snug">{intro.title}</h3>
            </div>
            <Link
              href={parent.href}
              onClick={onClose}
              className="group mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#93C5FD] transition hover:text-white"
            >
              View all
              <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Child links — compact grid */}
          <ul
            className={cn(
              "m-0 grid flex-1 list-none gap-2 p-0",
              cols === 1 && "grid-cols-1",
              cols === 2 && "grid-cols-1 sm:grid-cols-2",
              cols >= 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            )}
          >
            {children.map((child, i) => {
              const meta = getMeta(child);
              const Icon = meta.icon;
              const active = isActive(child.href);

              return (
                <motion.li
                  key={child.href + child.label}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Link
                    href={child.href}
                    onClick={onClose}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all duration-200",
                      active
                        ? "border-[#2563EB]/25 bg-[#F0F6FF]"
                        : "border-slate-200/70 bg-white hover:border-[#2563EB]/20 hover:bg-slate-50/80 hover:shadow-sm"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br shadow-sm transition-transform group-hover:scale-105",
                        meta.accent
                      )}
                    >
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-[13px] font-bold text-[#041B52] group-hover:text-[#2563EB]">
                          {child.label}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-300 opacity-0 transition group-hover:translate-x-0.5 group-hover:text-[#2563EB] group-hover:opacity-100" />
                      </div>
                      <p className="truncate text-[11px] leading-snug text-slate-500">
                        {child.desc || meta.desc}
                      </p>
                    </div>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </div>

        {/* Mobile/tablet intro row */}
        <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 lg:hidden">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB]">
              {intro.eyebrow}
            </p>
            <p className="text-xs font-semibold text-[#041B52]">{intro.title}</p>
          </div>
          <Link
            href={parent.href}
            onClick={onClose}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB]"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
