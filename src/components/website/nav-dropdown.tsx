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

const INTRO: Record<string, { eyebrow: string; title: string; subtitle: string }> = {
  Solutions: {
    eyebrow: "By facility type",
    title: "Healthcare Solutions",
    subtitle: "Purpose-built platforms for clinics, hospitals, and growing health networks across East Africa.",
  },
  Resources: {
    eyebrow: "Knowledge hub",
    title: "Resources & Insights",
    subtitle: "Explore case studies, articles, and answers to help your facility make informed decisions.",
  },
  Company: {
    eyebrow: "About Afya Bridge",
    title: "Our Company",
    subtitle: "Learn about our mission, team, and commitment to bridging technology and care.",
  },
};

const CHILD_META: Record<string, { icon: LucideIcon; desc: string; accent: string }> = {
  "For Clinics": {
    icon: Building2,
    desc: "Fast onboarding, essential modules, and affordable pricing for outpatient care.",
    accent: "from-blue-500 to-indigo-600",
  },
  "For Hospitals": {
    icon: Hospital,
    desc: "Integrated departments, leadership dashboards, and enterprise-grade operations.",
    accent: "from-cyan-500 to-sky-600",
  },
  Blog: {
    icon: BookOpen,
    desc: "Healthcare technology insights, trends, and best practices for East Africa.",
    accent: "from-violet-500 to-purple-600",
  },
  "Case Studies": {
    icon: FileText,
    desc: "Real results from clinics and hospitals transforming care with Afya Bridge.",
    accent: "from-emerald-500 to-teal-600",
  },
  FAQ: {
    icon: HelpCircle,
    desc: "Answers to common questions about implementation, pricing, and support.",
    accent: "from-amber-500 to-orange-600",
  },
  "About Us": {
    icon: Info,
    desc: "Our mission, vision, values, and the story behind Afya Bridge.",
    accent: "from-blue-500 to-indigo-600",
  },
  Resources: {
    icon: Layers,
    desc: "Guides, downloads, and tools for healthcare digital transformation.",
    accent: "from-cyan-500 to-sky-600",
  },
  Contact: {
    icon: Mail,
    desc: "Speak with our team about demos, partnerships, and facility needs.",
    accent: "from-rose-500 to-pink-600",
  },
  "Why Afya Bridge": {
    icon: Users,
    desc: "What sets us apart — local expertise, patient-centric design, proven results.",
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
  const intro = INTRO[parent.label] ?? {
    eyebrow: "Explore",
    title: parent.label,
    subtitle: "Discover more about what Afya Bridge offers your healthcare facility.",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="absolute left-0 right-0 top-full z-[100] border-t border-slate-100 bg-white shadow-[0_24px_60px_rgba(4,27,82,0.12)]"
    >
      <div className="mx-auto max-w-7xl px-6 py-7 sm:px-8 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:gap-10">
          {/* Intro panel */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#041B52] via-[#072563] to-[#0D2F8E] p-6 text-white">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#2563EB]/20 blur-2xl" />
            <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-[#00C2FF]/10 blur-xl" />
            <div className="relative">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#60A5FA]">
                {intro.eyebrow}
              </p>
              <h3 className="mt-2 text-xl font-bold leading-tight">{intro.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-blue-100/75">{intro.subtitle}</p>
              <Link
                href={parent.href}
                onClick={onClose}
                className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#60A5FA] transition hover:text-white"
              >
                View all {parent.label.toLowerCase()}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          {/* Child cards */}
          <ul
            className={cn(
              "m-0 grid list-none gap-3 p-0",
              children.length <= 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"
            )}
          >
            {children.map((child, i) => {
              const meta = getMeta(child);
              const Icon = meta.icon;
              const active = isActive(child.href);

              return (
                <motion.li
                  key={child.href + child.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={child.href}
                    onClick={onClose}
                    className={cn(
                      "group flex h-full gap-4 rounded-2xl border p-4 transition-all duration-200",
                      active
                        ? "border-[#2563EB]/30 bg-[#F0F6FF] shadow-md shadow-blue-900/5"
                        : "border-slate-200/80 bg-slate-50/50 hover:border-[#2563EB]/25 hover:bg-white hover:shadow-lg hover:shadow-blue-900/8"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-md transition-transform group-hover:scale-105",
                        meta.accent
                      )}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-[#041B52] group-hover:text-[#2563EB]">
                          {child.label}
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#2563EB]" />
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-slate-500">
                        {child.desc || meta.desc}
                      </p>
                    </div>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
