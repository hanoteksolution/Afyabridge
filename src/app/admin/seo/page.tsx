import { AdminHeader } from "@/components/admin/header";
import {
  SeoAdminView,
  type SeoRow,
} from "@/components/admin/seo-admin-view";
import { withDbRetry } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SEOAdminPage() {
  const seoEntries = await withDbRetry((prisma) =>
    prisma.sEO.findMany({
      include: {
        page: { select: { id: true, title: true, slug: true, isHome: true } },
        blogPost: { select: { id: true, title: true, slug: true } },
      },
      orderBy: [{ page: { title: "asc" } }, { blogPost: { title: "asc" } }],
    })
  );

  const rows: SeoRow[] = seoEntries.map((s) => ({
    id: s.id,
    metaTitle: s.metaTitle,
    metaDescription: s.metaDescription,
    ogImage: s.ogImage,
    noIndex: s.noIndex,
    updatedAt: s.updatedAt.toISOString(),
    page: s.page,
    blogPost: s.blogPost,
  }));

  return (
    <div className="min-h-screen">
      <AdminHeader title="SEO Manager" />
      <div className="p-6 lg:p-8">
        <SeoAdminView entries={rows} />
      </div>
    </div>
  );
}
