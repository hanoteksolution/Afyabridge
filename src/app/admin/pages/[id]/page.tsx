import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/header";
import { SectionManager } from "@/components/admin/section-manager";
import { PageForm } from "@/components/admin/page-form";
import { SeoForm } from "@/components/admin/seo-form";
import { PageEditorHero } from "@/components/admin/page-editor-hero";
import { withDbRetry } from "@/lib/prisma";

export default async function PageEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const page = await withDbRetry((prisma) =>
    prisma.page.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: { order: "asc" },
          include: {
            heroSlides: true,
            trustStats: true,
            whyCards: true,
            industries: true,
            serviceModules: true,
            approachSteps: true,
            missionValues: true,
          },
        },
        seo: true,
      },
    })
  );

  if (!page) notFound();

  return (
    <div className="min-h-screen">
      <AdminHeader title={`Edit: ${page.title}`} />
      <div className="space-y-6 p-6 lg:p-8">
        <PageEditorHero
          title={page.title}
          slug={page.slug}
          isPublished={page.isPublished}
          isHome={page.isHome}
          mode="edit"
        />

        <div className="grid gap-6 xl:grid-cols-2">
          <PageForm page={page} />
          <SeoForm pageId={page.id} seo={page.seo} />
        </div>

        <SectionManager pageId={page.id} sections={page.sections} />
      </div>
    </div>
  );
}
