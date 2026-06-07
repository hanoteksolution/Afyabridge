import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getHomePage, getPageBySlug, getPageAuxiliaryData, getSettings } from "@/lib/cms";
import { SectionRenderer } from "@/components/sections/section-renderer";
import { PageHeaderSection } from "@/components/sections/page-header-section";
import { FaqListSection } from "@/components/sections/faq-section";
import type { FullSection } from "@/lib/cms";

function getVariant(section: FullSection) {
  return (section.content as { variant?: string } | null)?.variant;
}

export async function generatePageMetadata(slug?: string): Promise<Metadata> {
  const page = slug ? await getPageBySlug(slug) : await getHomePage();
  if (!page) return { title: "Afya Bridge" };
  const seo = page.seo;
  return {
    title: seo?.metaTitle || page.title,
    description: seo?.metaDescription || page.description || undefined,
    keywords: seo?.metaKeywords || undefined,
    openGraph: {
      title: seo?.ogTitle || seo?.metaTitle || page.title,
      description: seo?.ogDescription || seo?.metaDescription || undefined,
      images: seo?.ogImage ? [seo.ogImage] : undefined,
    },
    robots: seo?.noIndex ? { index: false } : undefined,
  };
}

export async function CmsPageContent({ slug }: { slug?: string }) {
  const page = slug ? await getPageBySlug(slug) : await getHomePage();
  if (!page) notFound();

  const [{ testimonials, caseStudies, blogPosts, faqs }, settings] = await Promise.all([
    getPageAuxiliaryData(),
    getSettings(),
  ]);

  const faqSection = page.sections.find((s) => s.type === "CUSTOM" && getVariant(s) === "FAQ");
  if (faqSection) return <FaqListSection section={faqSection} faqs={faqs} />;

  const pageHeader = page.sections.find((s) => s.type === "CUSTOM" && getVariant(s) === "PAGE_HEADER");
  const hasHero = page.sections.some((s) => s.type === "HERO");
  const contentSections = page.sections.filter((s) => {
    const v = getVariant(s);
    return !(s.type === "CUSTOM" && (v === "PAGE_HEADER" || v === "FAQ"));
  });

  return (
    <>
      {!hasHero && !pageHeader && slug && (
        <PageHeaderSection
          section={{
            id: "page-meta",
            title: page.title,
            subtitle: page.description || "",
            content: null,
          } as FullSection}
          breadcrumb={page.title}
        />
      )}
      {pageHeader && <PageHeaderSection section={pageHeader} breadcrumb={page.title} />}
      <SectionRenderer
        sections={contentSections}
        testimonials={testimonials}
        caseStudies={caseStudies}
        blogPosts={blogPosts}
        faqs={faqs}
        settings={settings}
      />
    </>
  );
}
