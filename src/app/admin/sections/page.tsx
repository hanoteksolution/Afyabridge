import { AdminHeader } from "@/components/admin/header";
import {
  SectionsAdminView,
  type SectionRow,
} from "@/components/admin/sections-admin-view";
import { withDbRetry } from "@/lib/prisma";

export default async function SectionsAdminPage() {
  const sections = await withDbRetry((prisma) =>
    prisma.section.findMany({
      orderBy: [{ page: { title: "asc" } }, { order: "asc" }],
      include: { page: { select: { id: true, title: true, slug: true, isHome: true } } },
    })
  );

  const rows: SectionRow[] = sections.map((s) => ({
    id: s.id,
    title: s.title,
    type: s.type,
    order: s.order,
    isVisible: s.isVisible,
    page: {
      id: s.page.id,
      title: s.page.isHome ? "Home" : s.page.title,
      slug: s.page.slug,
      isHome: s.page.isHome,
    },
  }));

  return (
    <div className="min-h-screen">
      <AdminHeader title="Sections" />
      <div className="p-6 lg:p-8">
        <SectionsAdminView sections={rows} />
      </div>
    </div>
  );
}
