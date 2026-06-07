"use client";

import { motion } from "framer-motion";
import { Circle } from "lucide-react";
import { getLucideIcon } from "@/lib/icons";
import { sectionEyebrow } from "@/lib/section-content";
import type { FullSection } from "@/lib/cms";

interface ApproachSectionProps {
  section: FullSection;
}

export function ApproachSection({ section }: ApproachSectionProps) {
  const steps = section.approachSteps;
  if (!steps.length) return null;

  return (
    <section id="approach" className="relative overflow-hidden bg-white py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-[var(--secondary,#2D7FF9)]">
            {sectionEyebrow(section, "Our Approach")}
          </span>
          <h2 className="mt-3 text-3xl font-bold text-[#0A2A8B] sm:text-4xl lg:text-[2.7rem]">
            {section.title || "A proven path to go-live"}
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            {section.subtitle || "A structured implementation process designed specifically for healthcare environments."}
          </p>
        </div>

        <div className="relative">
          {/* Animated progress line */}
          <div className="absolute left-7 top-2 bottom-2 hidden w-0.5 bg-slate-100 sm:block">
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
              className="w-full bg-gradient-to-b from-[#0A2A8B] via-[#2D7FF9] to-[#00C2FF]"
            />
          </div>

          <div className="space-y-6">
            {steps.map((step, i) => {
              const Icon = getLucideIcon(step.icon, Circle);
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className="relative flex items-start gap-5"
                >
                  <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0A2A8B] to-[#2D7FF9] shadow-lg shadow-blue-900/20">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#00C2FF]">
                        Step {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="h-px flex-1 bg-slate-100" />
                    </div>
                    <h3 className="mt-2 text-xl font-bold text-[#0A2A8B]">{step.title}</h3>
                    <p className="mt-1.5 text-slate-600">{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
