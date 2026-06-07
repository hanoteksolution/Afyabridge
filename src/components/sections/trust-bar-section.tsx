"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Building2, Users, Shield, Globe, Award } from "lucide-react";
import type { FullSection } from "@/lib/cms";
import { getLucideIcon } from "@/lib/icons";

interface TrustBarSectionProps {
  section: FullSection;
  overlap?: boolean;
}

export function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1800;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);

  const display =
    suffix === "M+" ? `${count}M+` : `${count.toLocaleString()}${suffix}`;

  return <span ref={ref}>{display}</span>;
}

const FALLBACK_ICONS = [Building2, Users, Shield, Globe, Award];

export function TrustBarSection({ section, overlap = false }: TrustBarSectionProps) {
  const stats = section.trustStats;
  if (!stats.length) return null;

  return (
    <section
      className={`relative z-20 px-4 sm:px-6 lg:px-8 ${overlap ? "-mt-20 pb-4 sm:-mt-24" : "py-0"}`}
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_24px_80px_rgba(4,27,82,0.12)]"
        >
          <div className="grid grid-cols-2 divide-x divide-y divide-slate-100 sm:grid-cols-5 sm:divide-y-0">
            {stats.map((stat, i) => {
              const Icon = getLucideIcon(stat.icon, FALLBACK_ICONS[i % 5]);
              return (
                <div
                  key={stat.id}
                  className="group flex flex-col items-center px-3 py-6 text-center transition-colors hover:bg-[#F4F7FF] sm:px-4 sm:py-8"
                >
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#041B52] to-[#2563EB] shadow-lg shadow-blue-900/20 transition-transform group-hover:scale-110 sm:h-12 sm:w-12">
                    <Icon className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                  </div>
                  <div className="text-xl font-bold text-[#041B52] sm:text-2xl lg:text-3xl">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix || ""} />
                  </div>
                  <div className="mt-1 max-w-[140px] text-xs font-medium leading-snug text-slate-500 sm:text-sm">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
