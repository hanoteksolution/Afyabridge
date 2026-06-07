import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/header";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";

export default async function SEOAdminPage() {
  const seoEntries = await prisma.sEO.findMany({
    include: { page: true, blogPost: true },
  });

  return (
    <div>
      <AdminHeader title="SEO Manager" />
      <div className="p-6">
        <p className="text-sm text-slate-500 mb-6">
          Manage meta titles, descriptions, OpenGraph, and structured data for all pages.
        </p>
        <DataTable
          columns={[
            {
              key: "entity",
              label: "Page / Post",
              render: (s) => s.page?.title || s.blogPost?.title || "—",
            },
            { key: "metaTitle", label: "Meta Title" },
            { key: "metaDescription", label: "Description", render: (s) => s.metaDescription?.slice(0, 50) + "..." },
            {
              key: "noIndex",
              label: "Index",
              render: (s) => <Badge variant={s.noIndex ? "outline" : "success"}>{s.noIndex ? "No Index" : "Indexed"}</Badge>,
            },
          ]}
          data={seoEntries}
          emptyMessage="No SEO entries. They are created with pages and blog posts."
        />
      </div>
    </div>
  );
}
