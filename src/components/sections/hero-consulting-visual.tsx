"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Search, Settings, GraduationCap, Rocket, Headphones, Users, TrendingUp, CheckCircle2,
} from "lucide-react";
import { HEALTHCARE_IMAGES } from "@/lib/images";

const STEPS = [
  { icon: Search, label: "Assessment", color: "from-blue-500 to-indigo-500" },
  { icon: Settings, label: "Configuration", color: "from-cyan-500 to-sky-500" },
  { icon: GraduationCap, label: "Training", color: "from-violet-500 to-purple-500" },
  { icon: Rocket, label: "Go Live", color: "from-emerald-500 to-teal-500" },
  { icon: Headphones, label: "Support", color: "from-amber-500 to-orange-500" },
];

export function HeroConsultingVisual() {
  return (
    <div className="relative h-full w-full">
      <div className="absolute -inset-8 rounded-[40px] bg-gradient-to-tr from-[#2D7FF9]/25 via-[#00C2FF]/15 to-transparent blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative h-full overflow-hidden rounded-[32px] border border-white/20 bg-white/10 p-5 shadow-[0_40px_100px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-200/80">
              Digital Transformation
            </p>
            <h3 className="text-lg font-bold text-white sm:text-xl">Implementation Journey</h3>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
            <TrendingUp className="h-3.5 w-3.5" />
            +42% efficiency
          </div>
        </div>

        {/* Journey steps */}
        <div className="relative mb-5 flex items-center justify-between gap-1">
          <div className="absolute left-4 right-4 top-1/2 h-0.5 -translate-y-1/2 bg-white/10" />
          {STEPS.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="relative z-10 flex flex-col items-center gap-1.5"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${step.color} shadow-lg`}
              >
                <step.icon className="h-4 w-4 text-white" />
              </div>
              <span className="hidden text-[9px] font-medium text-blue-100/70 sm:block">{step.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Team + process cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-md">
            <div className="relative h-28 overflow-hidden rounded-xl sm:h-32">
              <Image
                src={HEALTHCARE_IMAGES.medicalTeam}
                alt="Healthcare team collaborating"
                fill
                className="object-cover"
                sizes="300px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#041B52]/80 to-transparent" />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Users className="h-4 w-4 text-[#60A5FA]" />
              <span className="text-xs font-semibold text-white">Team Training & Adoption</span>
            </div>
          </div>

          <div className="space-y-2">
            {[
              "Process optimization workshops",
              "Change management support",
              "Best practice implementation",
              "Continuous improvement cycles",
            ].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2"
              >
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#60A5FA]" />
                <span className="text-[11px] leading-snug text-blue-100/85">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Floating card */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-4 bottom-8 z-10 rounded-2xl border border-white/25 bg-white/95 p-3 shadow-2xl backdrop-blur-xl sm:-left-6"
      >
        <p className="text-[10px] text-slate-500">Facilities Transformed</p>
        <p className="text-xl font-bold text-[#041B52]">200+</p>
        <p className="text-[10px] font-medium text-emerald-600">Across East Africa</p>
      </motion.div>
    </div>
  );
}
