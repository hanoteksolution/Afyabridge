"use client";

import { motion } from "framer-motion";
import { Quote, Target, Eye, HandHeart, Sparkles } from "lucide-react";
import { sectionEyebrow } from "@/lib/section-content";
import type { FullSection } from "@/lib/cms";

interface MissionVisionSectionProps {
  section: FullSection;
}

const PILLAR_ICONS = [Target, Eye, HandHeart];

export function MissionVisionSection({ section }: MissionVisionSectionProps) {
  const items = section.missionValues;
  if (!items.length) return null;
  const pillars = items.filter((i) => ["mission", "vision", "commitment"].includes(i.type));
  const values = items.filter((i) => i.type === "value");

  return (
    <section id="mission" className="relative overflow-hidden bg-[#050C36] py-24 text-white">
      <div className="absolute inset-0 bg-mesh-dark" />
      {/* Particles */}
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          className="animate-float-slow absolute h-1.5 w-1.5 rounded-full bg-[#00C2FF]/40"
          style={{
            top: `${(i * 37) % 100}%`,
            left: `${(i * 53) % 100}%`,
            animationDelay: `${(i % 6) * 0.7}s`,
          }}
        />
      ))}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-[#00C2FF]">
            {sectionEyebrow(section, "Our Foundation")}
          </span>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl lg:text-[2.7rem]">
            {section.title || "Driven by purpose, guided by values"}
          </h2>
        </div>

        <div className="mb-14 grid gap-6 lg:grid-cols-3">
          {pillars.map((item, i) => {
            const Icon = PILLAR_ICONS[i % 3];
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-8 backdrop-blur-xl"
              >
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#2D7FF9]/20 blur-2xl transition-opacity group-hover:opacity-80" />
                <div className="relative">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2D7FF9] to-[#00C2FF] shadow-lg shadow-blue-500/30">
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#00C2FF]">{item.title}</h3>
                  <p className="mt-3 leading-relaxed text-blue-50/85">{item.content}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mb-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-colors hover:bg-white/[0.08]"
            >
              <Sparkles className="mb-3 h-5 w-5 text-[#00C2FF]" />
              <h4 className="font-semibold text-white">{v.title}</h4>
              <p className="mt-2 text-sm text-blue-100/70">{v.content}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center backdrop-blur-xl"
        >
          <Quote className="mx-auto mb-4 h-8 w-8 text-[#00C2FF]/60" />
          <p className="text-xl italic leading-relaxed text-blue-50 sm:text-2xl">
            &ldquo;If it doesn&apos;t improve patient care, efficiency, or trust — it&apos;s not Afya Bridge.&rdquo;
          </p>
          <p className="mt-4 text-sm font-medium text-[#00C2FF]">— Our Guiding Principle</p>
        </motion.div>
      </div>
    </section>
  );
}
