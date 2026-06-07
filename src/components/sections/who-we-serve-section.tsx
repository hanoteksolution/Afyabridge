"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Activity, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLucideIcon } from "@/lib/icons";
import { parseContent, parseIndustryBenefits, sectionEyebrow, type WhoServeContent, type ConsultingService } from "@/lib/section-content";
import type { FullSection } from "@/lib/cms";

interface WhoWeServeSectionProps {
  section: FullSection;
}

export function WhoWeServeSection({ section }: WhoWeServeSectionProps) {
  const serveContent = parseContent<WhoServeContent>(section.content);
  const industries = section.industries.map((ind) => {
    const parsed = parseIndustryBenefits(ind.benefits);
    return {
      id: ind.id,
      name: ind.name,
      icon: getLucideIcon(parsed.icon || "Activity", Activity),
      image: ind.image,
      description: ind.description || "",
      benefits: parsed.items,
      stat: parsed.stat,
      ctaLink: ind.ctaLink || "#contact",
      ctaText: ind.ctaText || "Learn More",
    };
  });

  if (!industries.length) return null;

  const [active, setActive] = useState(0);
  const current = industries[active];

  return (
    <section id="industries" className="relative overflow-hidden bg-mesh py-24">
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-[var(--secondary,#2D7FF9)]">
            {sectionEyebrow(section, "Who We Serve")}
          </span>
          <h2 className="mt-3 text-3xl font-bold text-[#0A2A8B] sm:text-4xl lg:text-[2.7rem]">
            {section.title || "Healthcare solutions for every scale"}
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            {section.subtitle || "From single clinics to national health networks — one intelligent platform."}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
          {/* Tabs */}
          <div className="flex flex-col gap-2">
            {industries.map((ind, i) => {
              const Icon = ind.icon;
              const isActive = active === i;
              return (
                <button
                  key={ind.id}
                  onClick={() => setActive(i)}
                  className={`group flex items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                    isActive
                      ? "border-transparent bg-gradient-to-r from-[#0A2A8B] to-[#2D7FF9] text-white shadow-xl shadow-blue-900/20"
                      : "border-slate-200/70 bg-white/70 text-slate-700 hover:border-[#2D7FF9]/40 hover:bg-white"
                  }`}
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
                      isActive ? "bg-white/15 text-white" : "bg-[#0A2A8B]/5 text-[#2D7FF9]"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className={`font-semibold ${isActive ? "text-white" : "text-[#0A2A8B]"}`}>{ind.name}</div>
                  </div>
                  <ArrowRight className={`h-4 w-4 transition-transform ${isActive ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0 group-hover:opacity-60"}`} />
                </button>
              );
            })}
          </div>

          {/* Showcase */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_30px_60px_rgba(10,42,139,0.12)]"
            >
              {current.image && (
                <div className="relative aspect-[16/8] w-full">
                  <Image src={current.image} alt={current.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 60vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A2A8B]/85 via-[#0A2A8B]/30 to-transparent" />
                  <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between">
                    <h3 className="text-2xl font-bold text-white sm:text-3xl">{current.name}</h3>
                    {current.stat && (
                      <div className="rounded-2xl bg-white/15 px-4 py-2 text-right backdrop-blur-lg">
                        <div className="text-xl font-bold text-white">{current.stat.v}</div>
                        <div className="text-[10px] uppercase tracking-wide text-blue-100">{current.stat.l}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="p-6 sm:p-8">
                <p className="text-lg leading-relaxed text-slate-600">{current.description}</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {current.benefits.map((b) => (
                    <div key={b} className="flex items-center gap-2 rounded-xl bg-[#F4F7FF] px-3 py-2.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">{b}</span>
                    </div>
                  ))}
                </div>
                <Button className="mt-8" asChild>
                  <Link href={current.ctaLink}>
                    {current.ctaText} <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {serveContent.consultingServices && serveContent.consultingServices.length > 0 && (
          <div className="mt-20">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              {serveContent.consultingEyebrow && (
                <span className="text-sm font-semibold uppercase tracking-wider text-[var(--secondary,#2D7FF9)]">
                  {serveContent.consultingEyebrow}
                </span>
              )}
              {serveContent.consultingTitle && (
                <h3 className="mt-3 text-2xl font-bold text-[var(--primary,#0A2A8B)] sm:text-3xl">
                  {serveContent.consultingTitle}
                </h3>
              )}
              {serveContent.consultingSubtitle && (
                <p className="mt-3 text-slate-600">{serveContent.consultingSubtitle}</p>
              )}
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {serveContent.consultingServices.map((svc: ConsultingService, i: number) => {
                const Icon = getLucideIcon(svc.icon, Settings);
                return (
                  <motion.div
                    key={svc.title + i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary,#0A2A8B)] to-[var(--secondary,#2D7FF9)]">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="font-bold text-[var(--primary,#0A2A8B)]">{svc.title}</h4>
                    <p className="mt-2 text-sm text-slate-600">{svc.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
