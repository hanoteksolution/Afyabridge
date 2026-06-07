"use client";

import { motion } from "framer-motion";
import { Settings, Monitor, Users, GraduationCap, ArrowUpRight } from "lucide-react";
import { getLucideIcon } from "@/lib/icons";
import { parseContent, sectionEyebrow, type WhoServeContent } from "@/lib/section-content";
import { SectionHeader } from "@/components/sections/section-header";
import type { FullSection } from "@/lib/cms";

const SERVICE_STYLES = [
  { accent: "from-violet-500 to-violet-600", icon: "bg-violet-500/12 text-violet-600" },
  { accent: "from-sky-500 to-blue-600", icon: "bg-sky-500/12 text-sky-600" },
  { accent: "from-emerald-500 to-teal-600", icon: "bg-emerald-500/12 text-emerald-600" },
  { accent: "from-amber-500 to-orange-500", icon: "bg-amber-500/12 text-amber-600" },
];

const FALLBACK_ICONS = [Settings, Monitor, GraduationCap, Users];

interface ConsultingServicesSectionProps {
  section: FullSection;
}

export function ConsultingServicesSection({ section }: ConsultingServicesSectionProps) {
  const content = parseContent<WhoServeContent>(section.content);
  const services = content.consultingServices ?? [];

  if (!services.length) return null;

  return (
    <section id="consulting" className="relative border-t border-slate-200/60 bg-white py-8 lg:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={content.consultingEyebrow || sectionEyebrow(section, "Expert Consulting Services")}
          title={
            content.consultingTitle ||
            section.title ||
            "We Help You Improve Operations and Deliver Better Care"
          }
          subtitle={content.consultingSubtitle || section.subtitle}
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">
          {services.map((svc, i) => {
            const Icon = getLucideIcon(svc.icon, FALLBACK_ICONS[i % 4]);
            const style = SERVICE_STYLES[i % SERVICE_STYLES.length];
            const num = String(i + 1).padStart(2, "0");
            return (
              <motion.div
                key={svc.title + i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group relative flex gap-4 overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_4px_20px_rgba(10,42,139,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--secondary,#2D7FF9)]/20 hover:shadow-[0_16px_40px_rgba(10,42,139,0.09)] sm:gap-5 sm:p-6"
              >
                <div
                  className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${style.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />
                <div className="flex shrink-0 flex-col items-center gap-2">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${style.icon} ring-1 ring-black/[0.04] transition group-hover:scale-105 sm:h-14 sm:w-14`}
                  >
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <span className="font-mono text-[10px] font-medium text-slate-300">{num}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold text-[var(--primary,#0A2A8B)] sm:text-lg">
                      {svc.title}
                    </h3>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-[var(--secondary,#2D7FF9)]" />
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{svc.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
