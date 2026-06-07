"use client";

import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { getLucideIcon } from "@/lib/icons";
import { MODULES } from "@/content/site";

const RING = [
  { top: "2%", left: "50%" },
  { top: "16%", left: "85%" },
  { top: "50%", left: "98%" },
  { top: "84%", left: "85%" },
  { top: "98%", left: "50%" },
  { top: "84%", left: "15%" },
  { top: "50%", left: "2%" },
  { top: "16%", left: "15%" },
];

export function ModulesEcosystem() {
  const nodes = MODULES.slice(0, 8);

  return (
    <>
      {/* Large screens: ecosystem */}
      <div className="relative mx-auto hidden aspect-square max-w-2xl lg:block">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {RING.map((p, i) => (
            <line key={i} x1="50" y1="50" x2={parseFloat(p.left)} y2={parseFloat(p.top)} stroke="url(#eg)" strokeWidth="0.4" strokeDasharray="2 2" className="animate-pulse" />
          ))}
          <defs>
            <linearGradient id="eg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2D7FF9" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00C2FF" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="relative flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-br from-[#2D7FF9] to-[#00C2FF] shadow-[0_0_60px_rgba(45,127,249,0.6)]">
            <div className="absolute inset-0 animate-pulse-ring rounded-3xl bg-[#2D7FF9]/40" />
            <div className="text-center">
              <Activity className="mx-auto h-8 w-8 text-white" strokeWidth={2.5} />
              <div className="mt-1 text-xs font-bold text-white">Afya Bridge</div>
            </div>
          </div>
        </div>

        {nodes.map((mod, i) => {
          const Icon = getLucideIcon(mod.icon);
          const p = RING[i];
          return (
            <motion.div
              key={mod.name}
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              style={{ top: p.top, left: p.left }}
              className="absolute z-10 w-40 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="rounded-2xl border border-white/10 bg-white/10 p-3 text-center backdrop-blur-lg transition-all hover:border-[#00C2FF]/50 hover:bg-white/15">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0A2A8B] to-[#2D7FF9]">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="text-xs font-semibold leading-tight text-white">{mod.name}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Small screens: grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
        {MODULES.slice(0, 8).map((mod, i) => {
          const Icon = getLucideIcon(mod.icon);
          return (
            <motion.div
              key={mod.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-lg"
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#0A2A8B] to-[#2D7FF9]">
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div className="font-semibold text-white">{mod.name}</div>
              <p className="mt-1 text-sm text-blue-100/70">{mod.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
