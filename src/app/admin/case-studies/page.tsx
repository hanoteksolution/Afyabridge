import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/header";
import { CaseStudyManager } from "@/components/admin/case-study-manager";

export default async function CaseStudiesAdminPage() {
  const caseStudies = await prisma.caseStudy.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <AdminHeader title="Case Studies" />
      <div className="p-6">
        <CaseStudyManager caseStudies={caseStudies} />
      </div>
    </div>
  );
}
