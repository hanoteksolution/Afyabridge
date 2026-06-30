import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getPublishedCaseStudiesList } from "@/lib/cms";
import { PageHero } from "@/components/site/page-hero";
import { HEALTHCARE_IMAGES } from "@/lib/images";
import type { Metadata } from "next";
export const revalidate = 120;

export const metadata: Metadata = {
  title: "Case Studies | Afya Bridge",
  description: "Real results from clinics and hospitals using Afya Bridge across East Africa.",
};

export default async function CaseStudiesIndexPage() {
  const studies = await getPublishedCaseStudiesList();

  return (
    <>
      <PageHero
        breadcrumb="Case Studies"
        eyebrow="Success Stories"
        title="Real Results, Real Impact"
        subtitle="See how healthcare facilities improved patient flow, efficiency, and outcomes."
      />
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            {studies.map((study, i) => (
              <Link
                key={study.id}
                href={`/case-studies/${study.slug}`}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-[16/9]">
                  <Image
                    src={study.image || [HEALTHCARE_IMAGES.consultation, HEALTHCARE_IMAGES.hospitalCorridor][i % 2]}
                    alt={study.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-[#0A2A8B] group-hover:text-[#2563EB]">{study.title}</h2>
                  {study.summary && <p className="mt-2 text-slate-600">{study.summary}</p>}
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#2563EB]">
                    Read story <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
