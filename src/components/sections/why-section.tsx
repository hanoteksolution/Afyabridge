"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Building2,
  ClipboardList,
  ChevronRight,
} from "lucide-react";
import { getLucideIcon } from "@/lib/icons";
import { HEALTHCARE_IMAGES } from "@/lib/images";
import { parseBullets, parseContent, type WhyPillarContent } from "@/lib/section-content";
import { WhoWeServeSection } from "@/components/sections/who-we-serve-section";
import { SectionHeader } from "@/components/sections/section-header";
import type { FullSection } from "@/lib/cms";

interface WhySectionProps {
  section: FullSection;
  whoServeSection?: FullSection;
}

type WhyCard = {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
  metric: { value: string; label: string };
  bullets: string[];
  showMetric: boolean;
};

const PILLAR_DEFAULTS = {
  product: {
    description:
      "An all-in-one healthcare management system built to digitize and connect every part of your facility.",
    features: [
      "Patient Management",
      "Clinical & EMR",
      "Billing & Revenue Cycle",
      "Pharmacy & Inventory",
      "Laboratory & Diagnostics",
      "Analytics & Reporting",
      "Secure Cloud Infrastructure",
      "And more...",
    ],
    image: HEALTHCARE_IMAGES.dataAnalytics,
    link: "#platform",
    linkText: "Explore Platform",
  },
  consulting: {
    description:
      "Expert guidance to optimize processes, build capacity and drive sustainable improvement.",
    features: [
      "Process Optimization",
      "Digital Transformation",
      "Training & Capacity Building",
      "Change Management",
    ],
    image: HEALTHCARE_IMAGES.medicalTeam,
    link: "#consulting",
    linkText: "Explore Consulting",
  },
} as const;

function resolvePillarFeatures(variant: "product" | "consulting", features?: string[]) {
  if (!features?.length) return [];
  if (variant === "product" && features[0]?.startsWith("Unified patient")) return [];
  if (variant === "consulting" && features[0]?.startsWith("Process optimization")) return [];
  return features;
}

function PillarCard({
  variant,
  title,
  description,
  features,
  image,
  link,
  linkText,
  index,
}: {
  variant: "product" | "consulting";
  title: string;
  description?: string;
  features: string[];
  image?: string;
  link?: string;
  linkText?: string;
  index: number;
}) {
  const isProduct = variant === "product";
  const defaults = PILLAR_DEFAULTS[variant];
  const Icon = isProduct ? Building2 : ClipboardList;
  const label = isProduct ? "Our Product" : "Our Consulting";
  const desc = description || defaults.description;
  const feats = features.length ? features : [...defaults.features];
  const img = image || defaults.image;
  const href = link || defaults.link;
  const btnText = linkText || defaults.linkText;
  const checkColor = isProduct ? "text-[var(--secondary,#2563EB)]" : "text-emerald-600";
  const cardTone = isProduct
    ? "border-[#C5DBF5]/70 bg-gradient-to-br from-[#F4F8FF] via-white to-[#FAFCFF]"
    : "border-emerald-200/70 bg-gradient-to-br from-[#F2FBF7] via-white to-[#FAFFFC]";

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.45 }}
      className={`group flex flex-col overflow-hidden rounded-2xl border shadow-[0_4px_24px_rgba(10,42,139,0.06)] transition-shadow duration-300 hover:shadow-[0_12px_40px_rgba(10,42,139,0.1)] md:min-h-[380px] md:flex-row md:items-stretch lg:min-h-[400px] ${cardTone}`}
    >
      <div className="flex min-w-0 flex-1 flex-col justify-between p-6 md:max-w-[54%] md:p-7 lg:p-8">
        <div>
          <div className="mb-4 flex items-center gap-2.5">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                isProduct ? "bg-[#E8F1FC] text-[var(--secondary,#2563EB)]" : "bg-emerald-50 text-emerald-600"
              }`}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
            </div>
            <h3 className="text-lg font-bold text-[var(--primary,#0A2A8B)]">{label}</h3>
          </div>

          <p className="max-w-md text-sm leading-relaxed text-slate-600 md:text-[15px]">{desc}</p>

          {isProduct ? (
            <ul className="mt-5 grid grid-cols-1 gap-y-2.5 sm:grid-cols-2 sm:gap-x-8">
              {feats.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${checkColor}`} />
                  <span className="leading-snug">{f}</span>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="mt-5 space-y-2.5">
              {feats.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${checkColor}`} />
                  <span className="leading-snug">{f}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Link
          href={href}
          className="mt-6 inline-flex w-fit items-center gap-1.5 rounded-lg border border-[var(--secondary,#2563EB)]/45 bg-white px-4 py-2.5 text-sm font-semibold text-[var(--primary,#0A2A8B)] transition hover:bg-[var(--secondary,#2563EB)]/[0.05]"
        >
          {btnText}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div
        className={`relative h-64 w-full shrink-0 overflow-hidden sm:h-72 md:h-auto md:min-h-[380px] md:w-[46%] lg:min-h-[400px] lg:w-[48%] ${
          isProduct ? "bg-[#EAF2FC]/60" : "bg-slate-100/80"
        }`}
      >
        <Image
          src={img}
          alt={title || label}
          fill
          className={`transition-transform duration-500 group-hover:scale-[1.04] ${
            isProduct
              ? "object-contain object-center p-3 sm:p-4 md:object-right md:p-5"
              : "object-cover object-center"
          }`}
          sizes="(max-width: 768px) 100vw, 48vw"
        />
      </div>
    </motion.article>
  );
}

function SolutionsShowcase({
  cards,
  sectionTitle,
  ctaText,
  ctaLink,
}: {
  cards: WhyCard[];
  sectionTitle?: string | null;
  ctaText: string;
  ctaLink: string;
}) {
  const [active, setActive] = useState(0);
  const activeCard = cards[active];
  const ActiveIcon = getLucideIcon(activeCard.icon, CheckCircle2);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((prev) => (prev + 1) % cards.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [cards.length]);

  return (
    <section id="solutions" className="relative overflow-hidden py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[#050C36]" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 10% 0%, rgba(45,127,249,0.28), transparent 55%), radial-gradient(ellipse 70% 50% at 90% 100%, rgba(0,194,255,0.14), transparent 50%)",
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-grid-dark opacity-20" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-20">
          {/* Left — navigation */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#60A5FA]">
                Our Solutions
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.5rem] lg:leading-[1.15]">
                {sectionTitle || "Built for healthcare providers who care"}
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-blue-100/65">
                Purpose-built capabilities that improve access, reduce admin load, and scale with your network.
              </p>
            </motion.div>

            <div className="mt-10 space-y-2" role="tablist" aria-label="Solutions">
              {cards.map((card, i) => {
                const isActive = active === i;
                const Icon = getLucideIcon(card.icon, CheckCircle2);
                const num = String(i + 1).padStart(2, "0");

                return (
                  <button
                    key={card.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActive(i)}
                    className={`group relative w-full overflow-hidden rounded-2xl border text-left transition-all duration-300 ${
                      isActive
                        ? "border-white/20 bg-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-md"
                        : "border-transparent bg-transparent hover:border-white/10 hover:bg-white/[0.04]"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="solution-active"
                        className="absolute inset-y-0 left-0 w-1 rounded-full bg-gradient-to-b from-[#60A5FA] to-[#00C2FF]"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <div className="flex items-start gap-4 px-5 py-4 sm:px-6 sm:py-5">
                      <span
                        className={`mt-0.5 shrink-0 font-mono text-sm tabular-nums transition-colors ${
                          isActive ? "text-[#60A5FA]" : "text-white/30"
                        }`}
                      >
                        {num}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <Icon
                            className={`h-4 w-4 shrink-0 transition-colors ${
                              isActive ? "text-[#93C5FD]" : "text-white/25"
                            }`}
                          />
                          <h3
                            className={`text-base font-semibold tracking-tight transition-colors sm:text-lg ${
                              isActive ? "text-white" : "text-white/55 group-hover:text-white/75"
                            }`}
                          >
                            {card.title}
                          </h3>
                        </div>
                        <AnimatePresence initial={false}>
                          {isActive && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25 }}
                              className="mt-2 text-sm leading-relaxed text-blue-100/60"
                            >
                              {card.description}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                      <ChevronRight
                        className={`mt-1 h-4 w-4 shrink-0 transition-all ${
                          isActive ? "translate-x-0 text-[#60A5FA] opacity-100" : "text-white/20 opacity-0 group-hover:opacity-60"
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            <Link
              href={ctaLink}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--primary,#0A2A8B)] shadow-[0_8px_30px_rgba(255,255,255,0.15)] transition hover:bg-blue-50"
            >
              {ctaText}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Right — visual panel */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-[#2563EB]/20 to-[#00C2FF]/10 blur-2xl" aria-hidden />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-[0_40px_100px_rgba(0,0,0,0.45)] backdrop-blur-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCard.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="relative aspect-[5/4] sm:aspect-[16/11]">
                    <Image
                      src={activeCard.image}
                      alt={activeCard.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050C36] via-[#050C36]/30 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#050C36]/40 to-transparent" />

                    {activeCard.showMetric && (
                      <div className="absolute right-5 top-5 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500">
                            <TrendingUp className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="text-lg font-bold text-white">{activeCard.metric.value}</div>
                            <div className="text-[10px] font-medium uppercase tracking-wide text-white/60">
                              {activeCard.metric.label}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-white/10 p-6 sm:p-8">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1">
                      <ActiveIcon className="h-3.5 w-3.5 text-[#60A5FA]" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-200/80">
                        Healthcare
                      </span>
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                      {activeCard.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-blue-100/70 sm:text-[15px]">
                      {activeCard.description}
                    </p>

                    {activeCard.bullets.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {activeCard.bullets.map((b) => (
                          <span
                            key={b}
                            className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium text-blue-100/80"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-6 flex items-center gap-3">
                      <span className="font-mono text-4xl font-extralight text-white/15">
                        {String(active + 1).padStart(2, "0")}
                      </span>
                      <div className="flex gap-1.5">
                        {cards.map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            aria-label={`Go to solution ${i + 1}`}
                            onClick={() => setActive(i)}
                            className={`h-1 rounded-full transition-all duration-300 ${
                              i === active ? "w-8 bg-[#60A5FA]" : "w-2 bg-white/20 hover:bg-white/40"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function WhySection({ section, whoServeSection }: WhySectionProps) {
  const pillarContent = parseContent<WhyPillarContent>(section.content);
  const hasPillars = Boolean(
    pillarContent.productTitle ||
      pillarContent.consultingTitle ||
      pillarContent.productDescription ||
      pillarContent.consultingDescription ||
      pillarContent.productFeatures?.length ||
      pillarContent.consultingFeatures?.length
  );

  const cards: WhyCard[] = section.whyCards.length
    ? section.whyCards.map((c) => ({
        id: c.id,
        title: c.title,
        description: c.description || "",
        icon: c.icon || "CheckCircle2",
        image: c.image || HEALTHCARE_IMAGES.consultation,
        metric: { value: c.metricValue || "", label: c.metricLabel || "" },
        bullets: parseBullets(c.bullets),
        showMetric: Boolean(c.metricValue),
      }))
    : [];

  if (!cards.length && !hasPillars) return null;

  const pillarEyebrow = pillarContent.eyebrow?.replace(/,$/, ".") || "Two Pillars. One Mission.";
  const legacyTitles = new Set([
    "Built for Healthcare Providers Who Care",
    "Built for healthcare providers who care",
  ]);
  const legacySubtitles = new Set([
    "Practical innovation that improves patient care, efficiency, and trust.",
  ]);
  const pillarTitle =
    !section.title || legacyTitles.has(section.title)
      ? "Technology + Expertise"
      : section.title;
  const pillarSubtitle =
    !section.subtitle || legacySubtitles.has(section.subtitle)
      ? "We provide both the platform and the guidance needed to improve healthcare operations."
      : section.subtitle;
  const ctaText = section.buttonText || "Learn More";
  const ctaLink = section.buttonLink || "#contact";

  return (
    <>
      <section className="relative overflow-hidden bg-white pt-14 pb-6 lg:pt-16 lg:pb-8">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {hasPillars && (
            <>
              <SectionHeader
                eyebrow={pillarEyebrow}
                title={pillarTitle}
                subtitle={pillarSubtitle}
                eyebrowStyle="plain"
              />

              <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
                <PillarCard
                  variant="product"
                  title="Our Product"
                  description={pillarContent.productDescription}
                  features={resolvePillarFeatures("product", pillarContent.productFeatures)}
                  image={pillarContent.productImage}
                  link={pillarContent.productLink}
                  linkText={pillarContent.productLinkText}
                  index={0}
                />
                <PillarCard
                  variant="consulting"
                  title="Our Consulting"
                  description={pillarContent.consultingDescription}
                  features={resolvePillarFeatures("consulting", pillarContent.consultingFeatures)}
                  image={pillarContent.consultingImage}
                  link={pillarContent.consultingLink}
                  linkText={pillarContent.consultingLinkText}
                  index={1}
                />
              </div>
            </>
          )}

          {whoServeSection && whoServeSection.industries.length > 0 && (
            <WhoWeServeSection section={whoServeSection} embedded />
          )}
        </div>
      </section>

      {cards.length > 0 && (
        <SolutionsShowcase
          cards={cards}
          sectionTitle={section.title}
          ctaText={ctaText}
          ctaLink={ctaLink}
        />
      )}
    </>
  );
}
