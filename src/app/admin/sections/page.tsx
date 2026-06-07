import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/header";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";

const SECTION_LABELS: Record<string, string> = {
  HERO: "Hero", TRUST_BAR: "Trust Bar", WHY_AFYA: "Why Afya",
  WHO_WE_SERVE: "Who We Serve", PLATFORM_MODULES: "Modules",
  OUR_APPROACH: "Approach", MISSION_VISION: "Mission/Vision",
  TESTIMONIALS: "Testimonials", CASE_STUDIES: "Case Studies",
  BLOG: "Blog", CTA: "CTA", CONTACT: "Contact", CUSTOM: "Custom",
};

export default async function SectionsAdminPage() {
  const sections = await prisma.section.findMany({
    orderBy: [{ page: { title: "asc" } }, { order: "asc" }],
    include: { page: true },
  });

  return (
    <div>
      <AdminHeader title="Sections" />
      <div className="p-6">
        <p className="text-sm text-slate-500 mb-6">
          All sections across pages. Edit sections from the page editor.
        </p>
        <DataTable
          columns={[
            { key: "title", label: "Title", render: (s) => s.title || SECTION_LABELS[s.type] || s.type },
            { key: "type", label: "Type", render: (s) => <Badge variant="secondary">{SECTION_LABELS[s.type]}</Badge> },
            { key: "page", label: "Page", render: (s) => s.page.title },
            { key: "order", label: "Order" },
            {
              key: "isVisible",
              label: "Visible",
              render: (s) => <Badge variant={s.isVisible ? "success" : "outline"}>{s.isVisible ? "Yes" : "No"}</Badge>,
            },
          ]}
          data={sections}
        />
      </div>
    </div>
  );
}
