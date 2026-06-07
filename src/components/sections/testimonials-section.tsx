"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote, TrendingUp } from "lucide-react";
import { sectionEyebrow } from "@/lib/section-content";
import type { FullSection } from "@/lib/cms";
import type { Testimonial } from "@prisma/client";

interface TestimonialsSectionProps {
  section: FullSection;
  testimonials: Testimonial[];
}

export function TestimonialsSection({ section, testimonials }: TestimonialsSectionProps) {
  const items = testimonials;
  if (!items.length) return null;

  const [start, setStart] = useState(0);
  const visible = 3;
  const canSlide = items.length > visible;
  const shown = canSlide
    ? Array.from({ length: visible }, (_, k) => items[(start + k) % items.length])
    : items;

  return (
    <section className="relative overflow-hidden bg-mesh py-24">
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 flex flex-col items-end justify-between gap-6 sm:flex-row">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-wider text-[var(--secondary,#2D7FF9)]">
              {sectionEyebrow(section, "Testimonials")}
            </span>
            <h2 className="mt-3 text-3xl font-bold text-[#0A2A8B] sm:text-4xl lg:text-[2.7rem]">
              {section.title || "Trusted by healthcare leaders"}
            </h2>
          </div>
          {canSlide && (
            <div className="flex gap-2">
              <button onClick={() => setStart((s) => (s - 1 + items.length) % items.length)} className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white transition-colors hover:bg-[#F4F7FF]">
                <ChevronLeft className="h-5 w-5 text-[#0A2A8B]" />
              </button>
              <button onClick={() => setStart((s) => (s + 1) % items.length)} className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white transition-colors hover:bg-[#F4F7FF]">
                <ChevronRight className="h-5 w-5 text-[#0A2A8B]" />
              </button>
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {shown.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-7 shadow-[0_20px_50px_rgba(10,42,139,0.08)] backdrop-blur-xl transition-shadow hover:shadow-[0_30px_60px_rgba(10,42,139,0.14)]"
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#2D7FF9]/5 blur-xl" />
                <Quote className="h-9 w-9 text-[#00C2FF]/30" />
                <div className="mt-3 flex gap-1">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mt-4 leading-relaxed text-slate-700">&ldquo;{item.review}&rdquo;</p>

                {item.result && (
                  <div className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <TrendingUp className="h-3.5 w-3.5" /> {item.result}
                  </div>
                )}

                <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#0A2A8B] to-[#2D7FF9] text-lg font-bold text-white">
                    {item.photo ? (
                      <Image src={item.photo} alt={item.name} width={48} height={48} className="object-cover" />
                    ) : (
                      item.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-[#0A2A8B]">{item.name}</div>
                    <div className="text-sm text-slate-500">{item.role} — {item.hospital}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
