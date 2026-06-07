"use client";

import { motion } from "framer-motion";
import { Circle } from "lucide-react";
import { getLucideIcon } from "@/lib/icons";
import { sectionEyebrow } from "@/lib/section-content";
import { SectionHeader } from "@/components/sections/section-header";
import type { FullSection } from "@/lib/cms";

interface ApproachSectionProps {
  section: FullSection;
}

export function ApproachSection({ section }: ApproachSectionProps) {
  const steps = section.approachSteps;
  if (!steps.length) return null;

  return (
    <section id="approach" className="relative border-t border-slate-200/60 bg-mesh pt-8 pb-14 lg:pt-10 lg:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={sectionEyebrow(section, "Proven Implementation")}
          title={section.title || "Our Implementation Process"}
          subtitle={section.subtitle}
        />

        <div className="hidden lg:block">
          <div className="relative rounded-3xl border border-slate-200/60 bg-white/80 p-8 shadow-[0_8px_40px_rgba(10,42,139,0.06)] backdrop-blur-sm">
            <div
              className="absolute left-[8%] right-[8%] top-[3.25rem] h-px border-t-2 border-dashed border-slate-200"
              aria-hidden
            />
            <div className="grid grid-cols-5 gap-3">
              {steps.map((step, i) => {
                const Icon = getLucideIcon(step.icon, Circle);
                const num = String(i + 1).padStart(2, "0");
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    className="group relative flex flex-col items-center text-center"
                  >
                    <div className="relative z-10">
                      <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-[var(--secondary,#2D7FF9)]/20 to-transparent opacity-0 blur-md transition group-hover:opacity-100" />
                      <div className="relative flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-full border-[3px] border-white bg-gradient-to-br from-[var(--primary,#0A2A8B)] to-[var(--secondary,#2D7FF9)] shadow-lg shadow-blue-900/20 transition group-hover:scale-105">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[9px] font-bold text-[var(--secondary,#2D7FF9)] shadow-sm ring-1 ring-slate-200">
                        {num}
                      </span>
                    </div>
                    <h3 className="mt-4 text-sm font-bold text-[var(--primary,#0A2A8B)]">{step.title}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{step.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-3 lg:hidden">
          {steps.map((step, i) => {
            const Icon = getLucideIcon(step.icon, Circle);
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-4 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary,#0A2A8B)] to-[var(--secondary,#2D7FF9)] shadow-md">
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--secondary,#2D7FF9)]">
                    Step {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-bold text-[var(--primary,#0A2A8B)]">{step.title}</h3>
                  <p className="mt-0.5 text-sm text-slate-500">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
