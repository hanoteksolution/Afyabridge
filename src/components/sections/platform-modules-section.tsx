"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LayoutGrid, Activity } from "lucide-react";
import { getLucideIcon } from "@/lib/icons";
import { parseBullets, sectionEyebrow } from "@/lib/section-content";
import type { FullSection } from "@/lib/cms";

interface PlatformModulesSectionProps {
  section: FullSection;
}

/** Polar coords in % of the square diagram (50,50 = center). */
function polarPosition(index: number, total: number, radius = 36) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  return {
    x: 50 + radius * Math.cos(angle),
    y: 50 + radius * Math.sin(angle),
  };
}

export function PlatformModulesSection({ section }: PlatformModulesSectionProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const modules = section.serviceModules.map((m) => ({
    id: m.id,
    name: m.name,
    icon: m.icon,
    description: m.description,
    benefits: parseBullets(m.benefits),
  }));

  if (!modules.length) return null;

  const count = modules.length;

  return (
    <section
      id="platform"
      className="scroll-mt-28 relative overflow-hidden bg-[#041B52] py-24 text-white lg:py-32"
    >
      <div className="absolute inset-0 bg-mesh-dark" />
      <div className="absolute inset-0 bg-grid-dark opacity-40" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[min(560px,80vw)] w-[min(560px,80vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2563EB]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-14 max-w-3xl text-center lg:mb-16"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-[#60A5FA]">
            {sectionEyebrow(section, "Platform Modules")}
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem]">
            {section.title || "Everything Your Facility Needs"}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-blue-100/75">
            {section.subtitle || "Integrated modules that work together seamlessly."}
          </p>
        </motion.div>

        {/* Radial ecosystem — desktop */}
        <div className="relative mx-auto hidden w-full max-w-[44rem] px-6 lg:block">
          <div className="relative aspect-square w-full">
            {/* Orbit rings */}
            <div className="absolute left-1/2 top-1/2 h-[76%] w-[76%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#2563EB]/20" />
            <div className="absolute left-1/2 top-1/2 h-[54%] w-[54%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#3B82F6]/15" />

            {/* Connection lines */}
            <svg
              className="absolute inset-0 h-full w-full overflow-visible"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden
            >
              <defs>
                <linearGradient id="moduleLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#00C2FF" stopOpacity="0.2" />
                </linearGradient>
                <filter id="moduleLineGlow">
                  <feGaussianBlur stdDeviation="0.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {modules.map((mod, i) => {
                const pos = polarPosition(i, count);
                const isActive = activeId === mod.id;
                return (
                  <motion.line
                    key={mod.id}
                    x1="50"
                    y1="50"
                    x2={pos.x}
                    y2={pos.y}
                    stroke="url(#moduleLineGrad)"
                    strokeDasharray={isActive ? "none" : "1.4 1.4"}
                    filter="url(#moduleLineGlow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.5 }}
                    animate={{ opacity: isActive ? 1 : 0.5 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.15 + i * 0.06, ease: "easeOut" }}
                    style={{ strokeWidth: isActive ? 0.5 : 0.32 }}
                  />
                );
              })}
            </svg>

            {/* Central hub */}
            <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.75 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, type: "spring", stiffness: 140 }}
                className="relative"
              >
                <div className="absolute -inset-4 animate-pulse-ring rounded-3xl bg-[#2563EB]/30" />
                <div className="absolute -inset-8 rounded-full bg-[#2563EB]/10 blur-xl" />
                <div className="relative flex h-32 w-32 flex-col items-center justify-center rounded-3xl border border-white/25 bg-gradient-to-br from-[#2563EB] to-[#00C2FF] shadow-[0_0_70px_rgba(37,99,235,0.5)]">
                  <Activity className="h-8 w-8 text-white" strokeWidth={2.5} />
                  <span className="mt-2 text-sm font-bold tracking-wide text-white">Afya Bridge</span>
                  <span className="mt-0.5 text-[10px] font-medium text-white/70">Core Platform</span>
                </div>
              </motion.div>
            </div>

            {/* Module nodes */}
            {modules.map((mod, i) => {
              const Icon = getLucideIcon(mod.icon, LayoutGrid);
              const pos = polarPosition(i, count);
              const isActive = activeId === mod.id;

              return (
                <motion.div
                  key={mod.id}
                  initial={{ opacity: 0, scale: 0.65 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.07, type: "spring", stiffness: 130 }}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  className="absolute z-10 w-[9.25rem] -translate-x-1/2 -translate-y-1/2"
                  onMouseEnter={() => setActiveId(mod.id)}
                  onMouseLeave={() => setActiveId(null)}
                >
                  <motion.div
                    animate={{
                      scale: isActive ? 1.05 : 1,
                      y: isActive ? -3 : 0,
                    }}
                    transition={{ duration: 0.25 }}
                    className={`group rounded-2xl border p-3.5 text-center backdrop-blur-xl transition-colors duration-300 ${
                      isActive
                        ? "border-[#60A5FA]/55 bg-white/15 shadow-[0_12px_36px_rgba(37,99,235,0.3)]"
                        : "border-white/15 bg-white/10 shadow-lg shadow-black/10 hover:border-[#60A5FA]/35 hover:bg-white/[0.12]"
                    }`}
                  >
                    <div
                      className={`mx-auto mb-2.5 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#041B52] to-[#2563EB] shadow-md transition-transform duration-300 ${
                        isActive ? "scale-110 shadow-[#2563EB]/40" : "group-hover:scale-105"
                      }`}
                    >
                      <Icon className="h-[18px] w-[18px] text-white" />
                    </div>
                    <div className="text-xs font-semibold leading-snug text-white">{mod.name}</div>
                    {(mod.description || mod.benefits.length > 0) && (
                      <motion.div
                        initial={false}
                        animate={{
                          opacity: isActive ? 1 : 0,
                          height: isActive ? "auto" : 0,
                          marginTop: isActive ? 6 : 0,
                        }}
                        className="overflow-hidden text-[10px] leading-relaxed text-blue-100/65"
                      >
                        {mod.description && <p>{mod.description}</p>}
                        {mod.benefits.length > 0 && (
                          <ul className="mt-1 space-y-0.5 text-left">
                            {mod.benefits.map((b) => (
                              <li key={b}>• {b}</li>
                            ))}
                          </ul>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Grid — mobile / tablet */}
        <div className="lg:hidden">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mb-8 flex max-w-xs items-center gap-4 rounded-2xl border border-[#2563EB]/30 bg-gradient-to-r from-[#2563EB]/20 to-[#00C2FF]/10 p-4 backdrop-blur-lg"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#00C2FF] shadow-lg shadow-[#2563EB]/30">
              <Activity className="h-6 w-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <div className="font-bold text-white">Afya Bridge</div>
              <div className="text-sm text-blue-100/70">Core platform hub</div>
            </div>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {modules.map((mod, i) => {
              const Icon = getLucideIcon(mod.icon, LayoutGrid);
              return (
                <motion.div
                  key={mod.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-lg transition hover:border-[#60A5FA]/40 hover:bg-white/[0.12]"
                >
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#041B52] to-[#2563EB] shadow-lg">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="font-semibold text-white">{mod.name}</div>
                  {mod.description && (
                    <p className="mt-1.5 text-sm leading-relaxed text-blue-100/65">{mod.description}</p>
                  )}
                  {mod.benefits.length > 0 && (
                    <ul className="mt-2 space-y-1 text-xs text-blue-100/60">
                      {mod.benefits.map((b) => (
                        <li key={b}>• {b}</li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
