"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { getLucideIcon } from "@/lib/icons";
import { HEALTHCARE_IMAGES } from "@/lib/images";
import { parseIndustryBenefits, sectionEyebrow } from "@/lib/section-content";
import { SectionHeader } from "@/components/sections/section-header";
import type { FullSection } from "@/lib/cms";

const FALLBACK_IMAGES = [
  HEALTHCARE_IMAGES.hospitalCorridor,
  HEALTHCARE_IMAGES.consultation,
  HEALTHCARE_IMAGES.community,
  HEALTHCARE_IMAGES.dataAnalytics,
  HEALTHCARE_IMAGES.medicalTeam,
  HEALTHCARE_IMAGES.patientCare,
];

const CARD_STYLES = [
  {
    icon: "bg-sky-500/12 text-sky-600",
    active: "border-sky-500/40 bg-sky-500/[0.06]",
    accent: "from-sky-500 to-blue-600",
    glow: "bg-sky-400/15",
    ring: "ring-sky-500/25",
    label: "text-sky-600",
    bar: "from-sky-500 via-blue-500 to-blue-600",
  },
  {
    icon: "bg-violet-500/12 text-violet-600",
    active: "border-violet-500/40 bg-violet-500/[0.06]",
    accent: "from-violet-500 to-purple-600",
    glow: "bg-violet-400/15",
    ring: "ring-violet-500/25",
    label: "text-violet-600",
    bar: "from-violet-500 via-purple-500 to-purple-600",
  },
  {
    icon: "bg-emerald-500/12 text-emerald-600",
    active: "border-emerald-500/40 bg-emerald-500/[0.06]",
    accent: "from-emerald-500 to-teal-600",
    glow: "bg-emerald-400/15",
    ring: "ring-emerald-500/25",
    label: "text-emerald-600",
    bar: "from-emerald-500 via-teal-500 to-teal-600",
  },
  {
    icon: "bg-orange-500/12 text-orange-600",
    active: "border-orange-500/40 bg-orange-500/[0.06]",
    accent: "from-orange-500 to-amber-500",
    glow: "bg-orange-400/15",
    ring: "ring-orange-500/25",
    label: "text-orange-600",
    bar: "from-orange-500 via-amber-500 to-amber-500",
  },
  {
    icon: "bg-rose-500/12 text-rose-600",
    active: "border-rose-500/40 bg-rose-500/[0.06]",
    accent: "from-rose-500 to-pink-600",
    glow: "bg-rose-400/15",
    ring: "ring-rose-500/25",
    label: "text-rose-600",
    bar: "from-rose-500 via-pink-500 to-pink-600",
  },
  {
    icon: "bg-teal-500/12 text-teal-600",
    active: "border-teal-500/40 bg-teal-500/[0.06]",
    accent: "from-teal-500 to-cyan-600",
    glow: "bg-teal-400/15",
    ring: "ring-teal-500/25",
    label: "text-teal-600",
    bar: "from-teal-500 via-cyan-500 to-cyan-600",
  },
];

function ServeDetailPanel({
  industry,
  index,
  style,
}: {
  industry: {
    id: string;
    name: string;
    icon: string;
    image?: string | null;
    description: string;
    benefits: string[];
    stat?: { v: string; l: string };
    ctaLink?: string | null;
    ctaText?: string | null;
  };
  index: number;
  style: (typeof CARD_STYLES)[number];
}) {
  const Icon = getLucideIcon(industry.icon, Activity);
  const num = String(index + 1).padStart(2, "0");
  const imageSrc = industry.image || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];

  return (
    <motion.div
      key={industry.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative mt-4 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_12px_40px_rgba(10,42,139,0.09)]"
    >
      <div className={`h-1 bg-gradient-to-r ${style.bar}`} />

      <div className="grid lg:grid-cols-2">
        {/* Image — top on mobile, right on desktop */}
        <div className="relative order-1 min-h-[180px] sm:min-h-[220px] lg:order-2 lg:min-h-[280px]">
          <Image
            src={imageSrc}
            alt={industry.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-transparent to-transparent lg:from-white/90 lg:via-white/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary,#0A2A8B)]/45 via-transparent to-transparent" />
          <div
            className={`absolute bottom-3 right-3 rounded-xl bg-gradient-to-br ${style.accent} px-3.5 py-2.5 text-white shadow-lg sm:bottom-4 sm:right-4 sm:px-4 sm:py-3`}
          >
            <div className="text-xl font-bold leading-none sm:text-2xl">{num}</div>
            <div className="mt-0.5 text-[9px] font-medium uppercase tracking-wider opacity-90 sm:text-[10px]">
              {industry.name}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="order-2 flex flex-col justify-center p-5 sm:p-6 lg:order-1 lg:p-7">
          <div className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            <Sparkles className={`h-3 w-3 ${style.label}`} />
            Selected solution
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${style.accent} shadow-md`}
            >
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold tracking-tight text-[var(--primary,#0A2A8B)] sm:text-xl">
                {industry.name}
              </h3>
              <span className={`font-mono text-xs font-medium ${style.label}`}>Solution {num}</span>
            </div>
          </div>

          {industry.description && (
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{industry.description}</p>
          )}

          {industry.benefits.length > 0 && (
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {industry.benefits.map((b) => (
                <li
                  key={b}
                  className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2 text-xs font-medium text-slate-700 sm:text-sm"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                  {b}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href={industry.ctaLink || "#contact"}
              className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${style.accent} px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-95`}
            >
              {industry.ctaText || "Explore this solution"}
              <ArrowRight className="h-4 w-4" />
            </Link>
            {industry.stat && (
              <div className="rounded-xl border border-slate-200/80 bg-white px-3 py-2">
                <div className="text-sm font-bold text-[var(--primary,#0A2A8B)]">{industry.stat.v}</div>
                <div className="text-[10px] uppercase tracking-wide text-slate-500">{industry.stat.l}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface WhoWeServeSectionProps {
  section: FullSection;
  embedded?: boolean;
}

export function WhoWeServeSection({ section, embedded = false }: WhoWeServeSectionProps) {
  const industries = section.industries.map((ind) => {
    const parsed = parseIndustryBenefits(ind.benefits);
    return {
      id: ind.id,
      name: ind.name,
      icon: parsed.icon || "Activity",
      image: ind.image,
      description: ind.description || "",
      benefits: parsed.items,
      stat: parsed.stat,
      ctaLink: ind.ctaLink,
      ctaText: ind.ctaText,
    };
  });

  if (!industries.length) return null;

  const [active, setActive] = useState(0);
  const current = industries[active];
  const activeStyle = CARD_STYLES[active % CARD_STYLES.length];

  return (
    <section
      id="industries"
      className={
        embedded
          ? "relative pt-12 lg:pt-14"
          : "relative border-t border-slate-200/60 bg-white py-8 lg:py-10"
      }
    >
      <div className={embedded ? "mx-auto max-w-7xl" : "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"}>
        <SectionHeader
          eyebrow={sectionEyebrow(section, "Who We Serve")}
          title={section.title || "Solutions for Every Healthcare Provider"}
          subtitle={section.subtitle}
        />

        <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-2 shadow-inner sm:p-2.5">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {industries.map((ind, i) => {
              const Icon = getLucideIcon(ind.icon, Activity);
              const isActive = active === i;
              const style = CARD_STYLES[i % CARD_STYLES.length];
              return (
                <button
                  key={ind.id}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`relative flex flex-col items-center rounded-xl px-3 py-4 text-center transition-all duration-300 ${
                    isActive
                      ? `border border-[var(--secondary,#2D7FF9)]/30 bg-white shadow-[0_8px_24px_rgba(45,127,249,0.12)] ${style.active}`
                      : "border border-transparent bg-transparent hover:bg-white/70"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="serve-active"
                      className="absolute inset-0 rounded-xl border border-[var(--secondary,#2D7FF9)]/25 bg-white"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      style={{ zIndex: 0 }}
                    />
                  )}
                  <div
                    className={`relative z-10 mb-2 flex h-10 w-10 items-center justify-center rounded-lg ${style.icon} transition ${
                      isActive ? "scale-110" : ""
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span
                    className={`relative z-10 text-xs font-semibold leading-tight sm:text-sm ${
                      isActive ? "text-[var(--primary,#0A2A8B)]" : "text-slate-600"
                    }`}
                  >
                    {ind.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <ServeDetailPanel industry={current} index={active} style={activeStyle} />
        </AnimatePresence>
      </div>
    </section>
  );
}
