import { AdminHeader } from "@/components/admin/header";
import { PagesAdminView, type PageRow } from "@/components/admin/pages-admin-view";
import { withDbRetry } from "@/lib/prisma";

export default async function PagesAdminPage() {
  const pages = await withDbRetry((prisma) =>
    prisma.page.findMany({
      orderBy: { updatedAt: "desc" },
      include: { _count: { select: { sections: true } } },
    })
  );

  const rows: PageRow[] = pages.map((page) => ({
    id: page.id,
    title: page.title,
    slug: page.slug,
    description: page.description,
    isPublished: page.isPublished,
    isHome: page.isHome,
    sectionCount: page._count.sections,
    updatedAt: page.updatedAt.toISOString(),
  }));

  return (
    <div className="min-h-screen">
      <AdminHeader title="Pages" />
      <div className="p-6 lg:p-8">
        <PagesAdminView pages={rows} />
      </div>
    </div>
  );
}
