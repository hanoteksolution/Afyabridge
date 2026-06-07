"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Layers,
  Briefcase,
  ChevronRight,
} from "lucide-react";
import { getLucideIcon } from "@/lib/icons";
import { HEALTHCARE_IMAGES } from "@/lib/images";
import { parseBullets, parseContent, sectionEyebrow, type WhyPillarContent } from "@/lib/section-content";
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
  const Icon = isProduct ? Layers : Briefcase;
  const num = String(index + 1).padStart(2, "0");
  const label = isProduct ? "Healthcare Platform" : "Expert Services";
  const accentBar = isProduct
    ? "from-[var(--primary,#0A2A8B)] via-[var(--secondary,#2563EB)] to-[#00C2FF]"
    : "from-emerald-600 via-teal-500 to-cyan-400";
  const iconWrap = isProduct
    ? "bg-gradient-to-br from-[var(--primary,#0A2A8B)] to-[var(--secondary,#2563EB)] shadow-blue-900/25"
    : "bg-gradient-to-br from-emerald-600 to-teal-500 shadow-emerald-900/20";
  const glow = isProduct ? "bg-[var(--secondary,#2563EB)]/8" : "bg-emerald-500/8";
  const checkBg = isProduct ? "bg-[var(--secondary,#2563EB)]/10 text-[var(--secondary,#2563EB)]" : "bg-emerald-500/10 text-emerald-600";

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.45 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/70 bg-white shadow-[0_8px_40px_rgba(10,42,139,0.07)] transition-all duration-400 hover:-translate-y-1.5 hover:border-[var(--secondary,#2563EB)]/20 hover:shadow-[0_24px_60px_rgba(45,127,249,0.14)]"
    >
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accentBar} opacity-80 transition group-hover:opacity-100`}
      />
      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full ${glow} blur-3xl transition duration-500 group-hover:scale-110`}
      />

      {image && (
        <div className="relative m-4 mb-0 aspect-[2.2/1] overflow-hidden rounded-2xl sm:m-5 sm:mb-0">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary,#0A2A8B)]/55 via-transparent to-transparent" />
        </div>
      )}

      <div className="relative flex flex-1 flex-col p-5 sm:p-6 lg:p-7">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-lg ${iconWrap} ring-4 ring-white transition duration-300 group-hover:scale-105 sm:h-14 sm:w-14`}
            >
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div className="min-w-0 pt-0.5">
              <span
                className={`text-[10px] font-bold uppercase tracking-[0.16em] ${
                  isProduct ? "text-[var(--secondary,#2563EB)]" : "text-emerald-600"
                }`}
              >
                {label}
              </span>
              <h3 className="mt-1 text-lg font-bold leading-snug tracking-tight text-[var(--primary,#0A2A8B)] sm:text-xl">
                {title}
              </h3>
            </div>
          </div>
          <span className="shrink-0 font-mono text-3xl font-extralight text-slate-200/90 sm:text-4xl">{num}</span>
        </div>

        {description && (
          <p className="mb-5 text-sm leading-relaxed text-slate-500">{description}</p>
        )}

        {features.length > 0 && (
          <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50/90 to-white p-4 sm:p-5">
            <ul className="space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-slate-700">
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${checkBg}`}
                  >
                    <CheckCircle2 className="h-3 w-3" />
                  </span>
                  <span className="leading-snug">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {link && (
          <Link
            href={link}
            className={`mt-6 inline-flex w-fit items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all ${
              isProduct
                ? "border-[var(--secondary,#2563EB)]/25 bg-[var(--secondary,#2563EB)]/[0.06] text-[var(--primary,#0A2A8B)] hover:border-[var(--secondary,#2563EB)]/40 hover:bg-[var(--secondary,#2563EB)]/10"
                : "border-emerald-500/25 bg-emerald-500/[0.06] text-emerald-800 hover:border-emerald-500/40 hover:bg-emerald-500/10"
            }`}
          >
            {linkText || "Learn more"}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        )}
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
  const hasPillars = Boolean(pillarContent.productTitle || pillarContent.consultingTitle);

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

  const eyebrow = sectionEyebrow(section, "Why Afya Bridge");
  const ctaText = section.buttonText || "Learn More";
  const ctaLink = section.buttonLink || "#contact";

  return (
    <>
      <section className="relative overflow-hidden pt-14 pb-6 lg:pt-16 lg:pb-8">
        <div className="pointer-events-none absolute inset-0 bg-mesh" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(45,127,249,0.1), transparent 55%), radial-gradient(ellipse 50% 40% at 100% 50%, rgba(0,194,255,0.06), transparent 50%)",
          }}
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" aria-hidden />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow={eyebrow}
            title={section.title || "Built for healthcare providers who care"}
            subtitle={
              section.subtitle ||
              "Practical innovation that improves patient care, efficiency, and trust."
            }
          />

          {hasPillars && (
            <div className="relative grid gap-5 lg:grid-cols-2 lg:gap-6">
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 hidden h-px w-[calc(100%-4rem)] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-[var(--secondary,#2563EB)]/15 to-transparent lg:block"
                aria-hidden
              />
              {pillarContent.productTitle && (
                <PillarCard
                  variant="product"
                  title={pillarContent.productTitle}
                  description={pillarContent.productDescription}
                  features={pillarContent.productFeatures || []}
                  image={pillarContent.productImage}
                  link={pillarContent.productLink}
                  linkText={pillarContent.productLinkText}
                  index={0}
                />
              )}
              {pillarContent.consultingTitle && (
                <PillarCard
                  variant="consulting"
                  title={pillarContent.consultingTitle}
                  description={pillarContent.consultingDescription}
                  features={pillarContent.consultingFeatures || []}
                  image={pillarContent.consultingImage}
                  link={pillarContent.consultingLink}
                  linkText={pillarContent.consultingLinkText}
                  index={1}
                />
              )}
            </div>
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
