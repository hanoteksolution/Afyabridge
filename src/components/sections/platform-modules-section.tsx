"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, LayoutGrid, Sparkles } from "lucide-react";
import { getLucideIcon } from "@/lib/icons";
import { sectionEyebrow } from "@/lib/section-content";
import { SectionHeader } from "@/components/sections/section-header";
import type { FullSection } from "@/lib/cms";

const MODULE_STYLES = [
  { bg: "from-violet-500/10 to-violet-600/5", icon: "bg-violet-500/15 text-violet-600 ring-violet-500/20" },
  { bg: "from-orange-500/10 to-orange-600/5", icon: "bg-orange-500/15 text-orange-600 ring-orange-500/20" },
  { bg: "from-rose-500/10 to-rose-600/5", icon: "bg-rose-500/15 text-rose-600 ring-rose-500/20" },
  { bg: "from-emerald-500/10 to-emerald-600/5", icon: "bg-emerald-500/15 text-emerald-600 ring-emerald-500/20" },
  { bg: "from-sky-500/10 to-sky-600/5", icon: "bg-sky-500/15 text-sky-600 ring-sky-500/20" },
  { bg: "from-teal-500/10 to-teal-600/5", icon: "bg-teal-500/15 text-teal-600 ring-teal-500/20" },
  { bg: "from-amber-500/10 to-amber-600/5", icon: "bg-amber-500/15 text-amber-600 ring-amber-500/20" },
  { bg: "from-indigo-500/10 to-indigo-600/5", icon: "bg-indigo-500/15 text-indigo-600 ring-indigo-500/20" },
];

interface PlatformModulesSectionProps {
  section: FullSection;
}

export function PlatformModulesSection({ section }: PlatformModulesSectionProps) {
  const modules = section.serviceModules.map((m) => ({
    id: m.id,
    name: m.name,
    icon: m.icon,
    description: m.description,
  }));

  if (!modules.length) return null;

  const ctaText = section.buttonText || "See All Modules";
  const ctaLink = section.buttonLink || "/platform";

  return (
    <section id="platform" className="scroll-mt-28 relative overflow-hidden pt-14 pb-8 lg:pt-16 lg:pb-10">
      <div className="pointer-events-none absolute inset-0 bg-mesh" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(45,127,249,0.08), transparent 60%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={sectionEyebrow(section, "Powerful Modules")}
          title={section.title || "Everything You Need in One Platform"}
          subtitle={section.subtitle}
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {modules.map((mod, i) => {
            const Icon = getLucideIcon(mod.icon, LayoutGrid);
            const style = MODULE_STYLES[i % MODULE_STYLES.length];
            return (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.035 }}
                className={`group relative overflow-hidden rounded-2xl border border-white/80 bg-gradient-to-br ${style.bg} p-5 text-center shadow-[0_4px_24px_rgba(10,42,139,0.06)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--secondary,#2D7FF9)]/25 hover:shadow-[0_20px_50px_rgba(45,127,249,0.12)]`}
              >
                <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/40 blur-2xl transition group-hover:bg-[var(--secondary,#2D7FF9)]/10" />
                <div
                  className={`relative mx-auto mb-3.5 flex h-12 w-12 items-center justify-center rounded-xl ring-1 ${style.icon} transition duration-300 group-hover:scale-110 group-hover:shadow-md`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="relative text-[15px] font-bold text-[var(--primary,#0A2A8B)]">{mod.name}</h3>
                {mod.description && (
                  <p className="relative mt-1.5 text-xs leading-relaxed text-slate-500 sm:text-sm">
                    {mod.description}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 flex justify-center lg:mt-9"
        >
          <Link
            href={ctaLink}
            className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[var(--secondary,#2D7FF9)] to-[#1a6fe8] px-7 py-3 text-sm font-semibold text-white shadow-[0_8px_28px_rgba(45,127,249,0.35)] transition hover:shadow-[0_12px_36px_rgba(45,127,249,0.45)]"
          >
            <Sparkles className="h-4 w-4 opacity-80" />
            {ctaText}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
