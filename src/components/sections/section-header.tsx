"use client";

import { motion } from "framer-motion";

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string | null;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mx-auto mb-8 max-w-3xl text-center lg:mb-9"
    >
      <span className="inline-flex items-center rounded-full border border-[var(--secondary,#2D7FF9)]/20 bg-[var(--secondary,#2D7FF9)]/[0.07] px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--secondary,#2D7FF9)]">
        {eyebrow}
      </span>
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-[var(--primary,#0A2A8B)] sm:text-3xl lg:text-[2.35rem] lg:leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base leading-relaxed text-slate-500 sm:text-lg">{subtitle}</p>
      )}
    </motion.div>
  );
}
