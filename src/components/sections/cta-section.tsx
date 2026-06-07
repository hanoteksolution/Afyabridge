"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Activity, HeartPulse, Stethoscope, Plus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLucideIcon } from "@/lib/icons";
import { parseContent, sectionEyebrow, type CtaContent } from "@/lib/section-content";
import type { FullSection } from "@/lib/cms";

interface CTASectionProps {
  section: FullSection;
}

const FLOAT_ICONS = ["Activity", "Plus", "Shield", "Calendar", "BarChart3", "Pill"];

export function CTASection({ section }: CTASectionProps) {
  const content = parseContent<CtaContent>(section.content);

  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 animate-gradient bg-gradient-to-r from-[#0A2A8B] via-[#2D7FF9] to-[#0A2A8B]" />
      <div className="absolute inset-0 bg-grid-dark opacity-40" />

      {/* Floating healthcare icons */}
      {FLOAT_ICONS.map((name, i) => {
        const Icon = getLucideIcon(name, Activity);
        return (
          <span
            key={i}
            className="animate-float-slow absolute text-white/10"
            style={{
              top: `${(i * 29 + 8) % 80 + 5}%`,
              left: `${(i * 41 + 6) % 90 + 3}%`,
              animationDelay: `${(i % 5) * 0.6}s`,
            }}
          >
            <Icon className="h-12 w-12" />
          </span>
        );
      })}

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur">
            <ShieldCheck className="h-4 w-4 text-[#00C2FF]" />
            <span className="text-sm font-medium text-white">
              {content.badge || sectionEyebrow(section, "No credit card required")}
            </span>
          </div>
          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            {section.title || "Ready to transform healthcare operations?"}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100">
            {section.subtitle ||
              "Join 500+ healthcare facilities across East Africa delivering better patient care with Afya Bridge."}
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild className="bg-white text-[#0A2A8B] shadow-xl hover:bg-blue-50">
              <Link href={section.buttonLink || "#contact"}>
                {section.buttonText || "Request Demo"}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" asChild className="border border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20">
              <Link href={section.buttonLink2 || "#contact"}>
                <Calendar className="mr-1 h-4 w-4" /> {section.buttonText2 || "Book a Consultation"}
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
