import { AdminHeader } from "@/components/admin/header";
import {
  CaseStudyManager,
  type CaseStudyRow,
} from "@/components/admin/case-study-manager";
import { withDbRetry } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CaseStudiesAdminPage() {
  const caseStudies = await withDbRetry((prisma) =>
    prisma.caseStudy.findMany({ orderBy: { order: "asc" } })
  );

  const rows: CaseStudyRow[] = caseStudies.map((cs) => ({
    id: cs.id,
    title: cs.title,
    slug: cs.slug,
    summary: cs.summary,
    story: cs.story,
    image: cs.image,
    pdfUrl: cs.pdfUrl,
    order: cs.order,
    isPublished: cs.isPublished,
  }));

  return (
    <div className="min-h-screen">
      <AdminHeader title="Case Studies" />
      <div className="p-6 lg:p-8">
        <CaseStudyManager caseStudies={rows} />
      </div>
    </div>
  );
}
