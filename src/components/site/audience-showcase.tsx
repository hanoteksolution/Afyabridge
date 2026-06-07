"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Stethoscope, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AUDIENCES } from "@/content/site";

const ICONS = [Stethoscope, Building2];

export function AudienceShowcase() {
  const [active, setActive] = useState(0);
  const current = AUDIENCES[active];

  return (
    <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
      <div className="flex flex-col gap-3">
        {AUDIENCES.map((aud, i) => {
          const Icon = ICONS[i];
          const isActive = active === i;
          return (
            <button
              key={aud.key}
              onClick={() => setActive(i)}
              className={`group flex items-center gap-4 rounded-2xl border p-5 text-left transition-all ${
                isActive
                  ? "border-transparent bg-gradient-to-r from-[#0A2A8B] to-[#2D7FF9] text-white shadow-xl shadow-blue-900/20"
                  : "border-slate-200/70 bg-white/70 text-slate-700 hover:border-[#2D7FF9]/40 hover:bg-white"
              }`}
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${isActive ? "bg-white/15 text-white" : "bg-[#0A2A8B]/5 text-[#2D7FF9]"}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className={`font-bold ${isActive ? "text-white" : "text-[#0A2A8B]"}`}>{aud.name}</div>
                <div className={`text-xs ${isActive ? "text-blue-100" : "text-slate-500"}`}>{aud.idealFor}</div>
              </div>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35 }}
          className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_30px_60px_rgba(10,42,139,0.12)]"
        >
          <div className="relative aspect-[16/7] w-full">
            <Image src={current.image} alt={current.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 60vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A2A8B]/85 via-[#0A2A8B]/20 to-transparent" />
            <h3 className="absolute bottom-5 left-6 text-2xl font-bold text-white sm:text-3xl">{current.name}</h3>
          </div>
          <div className="p-6 sm:p-8">
            <p className="text-lg text-slate-600">{current.blurb}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {current.points.map((p) => (
                <div key={p} className="flex items-center gap-2.5 rounded-xl bg-[#F4F7FF] px-3 py-2.5">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{p}</span>
                </div>
              ))}
            </div>
            <Button className="mt-8" asChild>
              <Link href={current.href}>Explore {current.name} <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
