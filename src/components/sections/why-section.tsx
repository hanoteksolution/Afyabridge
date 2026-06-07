"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowUpRight, TrendingUp, Layers, Briefcase } from "lucide-react";
import { getLucideIcon } from "@/lib/icons";
import { HEALTHCARE_IMAGES } from "@/lib/images";
import { parseBullets, parseContent, sectionEyebrow, type WhyPillarContent } from "@/lib/section-content";
import type { FullSection } from "@/lib/cms";

interface WhySectionProps {
  section: FullSection;
}

function PillarCard({
  variant,
  title,
  description,
  features,
  image,
  link,
  linkText,
}: {
  variant: "product" | "consulting";
  title: string;
  description?: string;
  features: string[];
  image?: string;
  link?: string;
  linkText?: string;
}) {
  const isProduct = variant === "product";
  const Icon = isProduct ? Layers : Briefcase;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_24px_60px_rgba(10,42,139,0.1)]"
    >
      {image && (
        <div className="relative aspect-[16/9]">
          <Image src={image} alt={title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
          <div className={`absolute inset-0 bg-gradient-to-t ${isProduct ? "from-[var(--primary,#0A2A8B)]/60" : "from-emerald-900/60"} to-transparent`} />
        </div>
      )}
      <div className="p-6 sm:p-8">
        <div
          className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${
            isProduct
              ? "bg-gradient-to-br from-[var(--primary,#0A2A8B)] to-[var(--secondary,#2D7FF9)]"
              : "bg-gradient-to-br from-emerald-600 to-teal-500"
          } shadow-lg`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-[var(--primary,#0A2A8B)] sm:text-2xl">{title}</h3>
        {description && <p className="mt-3 text-slate-600">{description}</p>}
        {features.length > 0 && (
          <ul className="mt-5 space-y-2.5">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-slate-700">
                <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${isProduct ? "text-[var(--secondary,#2D7FF9)]" : "text-emerald-500"}`} />
                {f}
              </li>
            ))}
          </ul>
        )}
        {link && (
          <Link
            href={link}
            className={`mt-6 inline-flex items-center gap-1 text-sm font-semibold transition-all hover:gap-2 ${
              isProduct ? "text-[var(--secondary,#2D7FF9)]" : "text-emerald-600"
            }`}
          >
            {linkText || "Learn more"} <ArrowUpRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </motion.div>
  );
}

export function WhySection({ section }: WhySectionProps) {
  const pillarContent = parseContent<WhyPillarContent>(section.content);
  const hasPillars = Boolean(pillarContent.productTitle || pillarContent.consultingTitle);

  const cards = section.whyCards.length
    ? section.whyCards.map((c, i) => ({
        id: c.id,
        title: c.title,
        description: c.description || "",
        icon: c.icon || "CheckCircle2",
        image: c.image || HEALTHCARE_IMAGES.consultation,
        metric: {
          value: c.metricValue || "",
          label: c.metricLabel || "",
        },
        bullets: parseBullets(c.bullets),
        showMetric: Boolean(c.metricValue),
      }))
    : [];

  if (!cards.length && !hasPillars) return null;

  return (
    <section id="solutions" className="relative overflow-hidden bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-20 max-w-3xl text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-wider text-[var(--secondary,#2D7FF9)]">
            {sectionEyebrow(section, "Why Afya Bridge")}
          </span>
          <h2 className="mt-3 text-3xl font-bold text-[var(--primary,#0A2A8B)] sm:text-4xl lg:text-[2.7rem]">
            {section.title || "Built for healthcare providers who care"}
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            {section.subtitle ||
              "Practical innovation that improves patient care, efficiency, and trust."}
          </p>
        </motion.div>

        {hasPillars && (
          <div className="mb-20 grid gap-8 lg:grid-cols-2 lg:gap-10">
            {pillarContent.productTitle && (
              <PillarCard
                variant="product"
                title={pillarContent.productTitle}
                description={pillarContent.productDescription}
                features={pillarContent.productFeatures || []}
                image={pillarContent.productImage}
                link={pillarContent.productLink}
                linkText={pillarContent.productLinkText}
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
              />
            )}
          </div>
        )}

        <div className="space-y-20 lg:space-y-28">
          {cards.map((card, i) => {
            const Icon = getLucideIcon(card.icon, CheckCircle2);
            const reverse = i % 2 === 1;
            return (
              <div key={card.id} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <motion.div
                  initial={{ opacity: 0, x: reverse ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`relative ${reverse ? "lg:order-2" : ""}`}
                >
                  <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-tr from-[var(--secondary,#2D7FF9)]/15 to-[var(--accent,#00C2FF)]/10 blur-xl" />
                  <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-[0_30px_60px_rgba(10,42,139,0.18)] ring-1 ring-slate-200/60">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary,#0A2A8B)]/30 to-transparent" />
                  </div>
                  {card.showMetric && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                      className={`absolute -bottom-6 ${reverse ? "right-6" : "left-6"} flex items-center gap-3 rounded-2xl border border-white/60 bg-white/95 p-4 shadow-xl backdrop-blur-lg`}
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-[var(--primary,#0A2A8B)]">{card.metric.value}</div>
                        <div className="text-xs text-slate-500">{card.metric.label}</div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: reverse ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={reverse ? "lg:order-1" : ""}
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary,#0A2A8B)] to-[var(--secondary,#2D7FF9)] shadow-lg shadow-blue-900/20">
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--primary,#0A2A8B)] sm:text-3xl">{card.title}</h3>
                  <p className="mt-4 text-lg leading-relaxed text-slate-600">{card.description}</p>
                  {card.bullets.length > 0 && (
                    <ul className="mt-6 space-y-3">
                      {card.bullets.map((b) => (
                        <li key={b} className="flex items-center gap-3 text-slate-700">
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                  <a
                    href={section.buttonLink || "#contact"}
                    className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[var(--secondary,#2D7FF9)] transition-all hover:gap-2"
                  >
                    {section.buttonText || "Learn more"} <ArrowUpRight className="h-4 w-4" />
                  </a>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
