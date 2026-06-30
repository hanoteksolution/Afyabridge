import { notFound } from "next/navigation";
import { generatePageMetadata, CmsPageContent } from "@/components/site/cms-page";
import { getPublishedPageSlugs } from "@/lib/cms";

export const dynamic = "force-dynamic";

const RESERVED = new Set(["blog", "admin", "api", "uploads", "case-studies"]);

export async function generateStaticParams() {
  try {
    const slugs = await getPublishedPageSlugs();
    return slugs.filter((s) => !RESERVED.has(s)).map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return generatePageMetadata(slug);
}

export default async function DynamicCmsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (RESERVED.has(slug)) notFound();
  return <CmsPageContent slug={slug} />;
}
