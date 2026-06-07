import { PageHero } from "@/components/site/page-hero";
import type { FullSection } from "@/lib/cms";

export function PageHeaderSection({ section, breadcrumb }: { section: FullSection; breadcrumb: string }) {
  const content = section.content as { description?: string; eyebrow?: string } | null;
  return (
    <PageHero
      breadcrumb={breadcrumb}
      eyebrow={content?.eyebrow || section.subtitle || ""}
      title={section.title || ""}
      subtitle={content?.description || section.buttonText || ""}
    />
  );
}
