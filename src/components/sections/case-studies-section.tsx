"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Download, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HEALTHCARE_IMAGES } from "@/lib/images";
import { sectionEyebrow } from "@/lib/section-content";
import type { FullSection } from "@/lib/cms";
import type { CaseStudy } from "@prisma/client";

interface CaseStudiesSectionProps {
  section: FullSection;
  caseStudies: CaseStudy[];
}

function BeforeAfterBar() {
  return (
    <div className="space-y-3">
      <div>
        <div className="mb-1 flex justify-between text-xs text-slate-500">
          <span>Before Afya Bridge</span><span>45 min</span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-slate-100">
          <div className="h-full w-[85%] rounded-full bg-slate-300" />
        </div>
      </div>
      <div>
        <div className="mb-1 flex justify-between text-xs font-medium text-[#0A2A8B]">
          <span>After Afya Bridge</span><span>27 min</span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-slate-100">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "52%" }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="h-full rounded-full bg-gradient-to-r from-[#0A2A8B] to-[#2D7FF9]"
          />
        </div>
      </div>
    </div>
  );
}

export function CaseStudiesSection({ section, caseStudies }: CaseStudiesSectionProps) {
  if (!caseStudies.length) return null;

  const items = caseStudies.map((c, i) => ({
    ...c,
    image: c.image || [HEALTHCARE_IMAGES.consultation, HEALTHCARE_IMAGES.hospitalCorridor][i % 2],
  }));
  const featured = items[0];
  const rest = items.slice(1, 3);

  const featKpis = (featured.kpis as { label: string; value: string }[]) || [];

  return (
    <section id="case-studies" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 flex flex-col items-end justify-between gap-4 sm:flex-row">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-[var(--secondary,#2D7FF9)]">
              {sectionEyebrow(section, "Case Studies")}
            </span>
            <h2 className="mt-3 text-3xl font-bold text-[#0A2A8B] sm:text-4xl lg:text-[2.7rem]">
              {section.title || "Real results, real impact"}
            </h2>
          </div>
          <Button variant="outline" asChild>
            <Link href="/case-studies">View All <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>

        {/* Featured */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid overflow-hidden rounded-3xl border border-slate-200/70 shadow-[0_30px_70px_rgba(10,42,139,0.12)] lg:grid-cols-2"
        >
          <div className="relative min-h-[320px]">
            <Image src={featured.image} alt={featured.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A2A8B]/70 to-transparent lg:bg-gradient-to-r" />
            <span className="absolute left-6 top-6 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#0A2A8B] backdrop-blur">
              Featured Story
            </span>
          </div>
          <div className="bg-white p-8 lg:p-10">
            <h3 className="text-2xl font-bold text-[#0A2A8B]">{featured.title}</h3>
            <p className="mt-3 text-slate-600">{featured.summary}</p>

            <div className="mt-6 rounded-2xl bg-[#F4F7FF] p-5">
              <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Patient Wait Time</div>
              <BeforeAfterBar />
            </div>

            {featKpis.length > 0 && (
              <div className="mt-6 grid grid-cols-3 gap-3">
                {featKpis.map((kpi) => (
                  <div key={kpi.label} className="rounded-xl border border-slate-100 p-3 text-center">
                    <div className="text-lg font-bold text-[#0A2A8B]">{kpi.value}</div>
                    <div className="text-[11px] text-slate-500">{kpi.label}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-7 flex gap-3">
              <Button asChild><Link href={`/case-studies/${featured.slug}`}>Read Full Story</Link></Button>
              {featured.pdfUrl && (
                <Button variant="outline" asChild>
                  <a href={featured.pdfUrl} target="_blank" rel="noopener noreferrer"><Download className="mr-1 h-4 w-4" /> PDF</a>
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Secondary grid */}
        {rest.length > 0 && (
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {rest.map((cs, i) => {
              const results = cs.results as Record<string, string> | null;
              return (
                <motion.div
                  key={cs.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group flex gap-5 overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-4 transition-shadow hover:shadow-xl"
                >
                  <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl">
                    <Image src={cs.image} alt={cs.title} fill className="object-cover transition-transform group-hover:scale-105" sizes="128px" />
                  </div>
                  <div className="flex-1 py-1">
                    <h4 className="font-bold text-[#0A2A8B]">{cs.title}</h4>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-600">{cs.summary}</p>
                    {results && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {Object.entries(results).map(([k, v]) => (
                          <span key={k} className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                            {v.startsWith("-") ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                            {v}
                          </span>
                        ))}
                      </div>
                    )}
                    <Link href={`/case-studies/${cs.slug}`} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#2D7FF9] hover:gap-2 transition-all">
                      Read story <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
