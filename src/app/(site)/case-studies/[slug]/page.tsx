import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCaseStudyBySlug } from "@/lib/cms";
import { HEALTHCARE_IMAGES } from "@/lib/images";
import type { Metadata } from "next";
export const revalidate = 120;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);
  if (!study) return {};
  return {
    title: `${study.title} | Case Study | Afya Bridge`,
    description: study.summary || undefined,
  };
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug, { publishedOnly: true });
  if (!study) notFound();

  const kpis = (study.kpis as { label: string; value: string }[]) || [];
  const results = study.results as Record<string, string> | null;

  return (
    <article className="pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/case-studies"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#2563EB] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          All case studies
        </Link>

        <div className="relative mb-10 aspect-[21/9] overflow-hidden rounded-2xl">
          <Image
            src={study.image || HEALTHCARE_IMAGES.hospitalCorridor}
            alt={study.title}
            fill
            className="object-cover"
            sizes="(max-width: 896px) 100vw, 896px"
            priority
          />
        </div>

        <h1 className="text-4xl font-bold text-[#0A1F78] leading-tight">{study.title}</h1>
        {study.summary && <p className="mt-4 text-lg text-slate-600">{study.summary}</p>}

        {(kpis.length > 0 || results) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
                <div className="text-xl font-bold text-[#0A2A8B]">{kpi.value}</div>
                <div className="text-xs text-slate-500">{kpi.label}</div>
              </div>
            ))}
            {results &&
              Object.entries(results).map(([key, value]) => (
                <span
                  key={key}
                  className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700"
                >
                  {value}
                </span>
              ))}
          </div>
        )}

        {study.story && (
          <div
            className="cms-content mt-10 text-slate-700 leading-relaxed [&_p]:mb-4"
            dangerouslySetInnerHTML={{ __html: study.story }}
          />
        )}

        <div className="mt-12 rounded-2xl bg-[#F4F7FF] p-8 text-center">
          <h2 className="text-xl font-semibold text-[#0A2A8B]">Ready for similar results?</h2>
          <p className="mt-2 text-slate-600">Request a demo and we&apos;ll show you how Afya Bridge can help your facility.</p>
          <Link
            href="/contact"
            className="mt-6 inline-flex rounded-xl bg-[#0A1F78] px-6 py-3 text-sm font-medium text-white hover:bg-[#0A1F78]/90"
          >
            Request a Demo
          </Link>
        </div>
      </div>
    </article>
  );
}
