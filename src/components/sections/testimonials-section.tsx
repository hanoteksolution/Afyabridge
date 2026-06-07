"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { sectionEyebrow } from "@/lib/section-content";
import { HEALTHCARE_IMAGES } from "@/lib/images";
import type { FullSection } from "@/lib/cms";
import type { Testimonial } from "@prisma/client";

interface TestimonialsSectionProps {
  section: FullSection;
  testimonials: Testimonial[];
}

const FALLBACK_IMAGES = [
  HEALTHCARE_IMAGES.consultation,
  HEALTHCARE_IMAGES.medicalTeam,
  HEALTHCARE_IMAGES.africanDoctor,
  HEALTHCARE_IMAGES.patientCare,
  HEALTHCARE_IMAGES.reception,
];

function cardTitle(review: string, max = 72) {
  const trimmed = review.trim();
  if (trimmed.length <= max) return trimmed;
  const cut = trimmed.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

function TestimonialCard({
  item,
  imageIndex,
  onExplore,
}: {
  item: Testimonial;
  imageIndex: number;
  onExplore: () => void;
}) {
  const image = item.photo || FALLBACK_IMAGES[imageIndex % FALLBACK_IMAGES.length];
  const dateLabel = format(new Date(item.createdAt), "MMMM d, yyyy");

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="group flex h-full flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_18px_50px_rgba(10,42,139,0.1)] transition-shadow hover:shadow-[0_28px_60px_rgba(10,42,139,0.16)]"
    >
      {/* Image + date notch */}
      <div className="relative px-5 pt-5">
        <div className="relative aspect-[16/11] overflow-hidden rounded-[22px]">
          <Image
            src={image}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 33vw"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A2A8B]/25 via-transparent to-transparent" />
        </div>

        <div className="absolute bottom-0 left-8 z-10 translate-y-1/2">
          <div className="flex items-center gap-2.5 rounded-2xl border border-slate-100/80 bg-white px-4 py-2.5 shadow-[0_8px_24px_rgba(10,42,139,0.1)]">
            <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--secondary,#2563EB)]" />
            <span className="whitespace-nowrap text-sm font-medium text-slate-600">{dateLabel}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-6 pb-6 pt-12">
        <h3 className="text-xl font-bold leading-snug text-[var(--primary,#0A2A8B)] sm:text-[1.35rem]">
          {cardTitle(item.review)}
        </h3>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-500">
          {item.name}
          {item.role ? ` · ${item.role}` : ""}
          {item.hospital ? ` — ${item.hospital}` : ""}
        </p>

        {item.result && (
          <span className="mt-3 inline-flex w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {item.result}
          </span>
        )}

        <div className="mt-6 border-t border-slate-100" />

        <div className="mt-5 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onExplore}
            className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-[var(--primary,#0A2A8B)] transition-colors hover:border-[var(--secondary,#2563EB)] hover:bg-[#F4F7FF]"
          >
            Explore More
          </button>
          <span className="text-sm font-medium text-slate-500">(0) Comments</span>
        </div>
      </div>
    </motion.article>
  );
}

export function TestimonialsSection({ section, testimonials }: TestimonialsSectionProps) {
  const items = testimonials;
  if (!items.length) return null;

  const [start, setStart] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const visible = 3;
  const canSlide = items.length > visible;
  const shown = canSlide
    ? Array.from({ length: visible }, (_, k) => items[(start + k) % items.length])
    : items;

  const expanded = expandedId ? items.find((i) => i.id === expandedId) : null;

  return (
    <section className="relative overflow-hidden bg-[#EEF3FB] py-24">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 flex flex-col items-end justify-between gap-6 sm:flex-row">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-wider text-[var(--secondary,#2D7FF9)]">
              {sectionEyebrow(section, "Testimonials")}
            </span>
            <h2 className="mt-3 text-3xl font-bold text-[var(--primary,#0A2A8B)] sm:text-4xl lg:text-[2.7rem]">
              {section.title || "Trusted by healthcare leaders"}
            </h2>
            {section.subtitle && (
              <p className="mt-3 text-lg text-slate-600">{section.subtitle}</p>
            )}
          </div>
          {canSlide && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStart((s) => (s - 1 + items.length) % items.length)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white transition-colors hover:bg-white hover:shadow-md"
                aria-label="Previous testimonials"
              >
                <ChevronLeft className="h-5 w-5 text-[var(--primary,#0A2A8B)]" />
              </button>
              <button
                type="button"
                onClick={() => setStart((s) => (s + 1) % items.length)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white transition-colors hover:bg-white hover:shadow-md"
                aria-label="Next testimonials"
              >
                <ChevronRight className="h-5 w-5 text-[var(--primary,#0A2A8B)]" />
              </button>
            </div>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {shown.map((item, i) => (
              <TestimonialCard
                key={item.id}
                item={item}
                imageIndex={items.indexOf(item)}
                onExplore={() => setExpandedId(expandedId === item.id ? null : item.id)}
              />
            ))}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mx-auto mt-10 max-w-3xl rounded-3xl border border-slate-200/80 bg-white p-8 shadow-lg"
            >
              <p className="text-lg leading-relaxed text-slate-700">&ldquo;{expanded.review}&rdquo;</p>
              <div className="mt-5 flex items-center gap-4">
                {expanded.photo && (
                  <div className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-[var(--secondary,#2563EB)]/20">
                    <Image src={expanded.photo} alt={expanded.name} fill className="object-cover" sizes="56px" />
                  </div>
                )}
                <div>
                  <div className="font-bold text-[var(--primary,#0A2A8B)]">{expanded.name}</div>
                  <div className="text-sm text-slate-500">
                    {[expanded.role, expanded.hospital].filter(Boolean).join(" — ")}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
