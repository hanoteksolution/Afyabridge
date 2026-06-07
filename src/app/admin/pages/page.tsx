import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/header";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { format } from "date-fns";

export default async function PagesAdminPage() {
  const pages = await prisma.page.findMany({
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { sections: true } } },
  });

  return (
    <div>
      <AdminHeader title="Pages" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500">Manage website pages and their content sections.</p>
          <Button asChild>
            <Link href="/admin/pages/new"><Plus className="mr-1 h-4 w-4" /> New Page</Link>
          </Button>
        </div>
        <DataTable
          columns={[
            { key: "title", label: "Title" },
            { key: "slug", label: "Slug" },
            {
              key: "isPublished",
              label: "Status",
              render: (item) => (
                <Badge variant={item.isPublished ? "success" : "outline"}>
                  {item.isPublished ? "Published" : "Draft"}
                </Badge>
              ),
            },
            {
              key: "sections",
              label: "Sections",
              render: (item) => item._count.sections,
            },
            {
              key: "isHome",
              label: "Home",
              render: (item) => item.isHome ? "Yes" : "—",
            },
            {
              key: "updatedAt",
              label: "Updated",
              render: (item) => format(new Date(item.updatedAt), "MMM d, yyyy"),
            },
            {
              key: "actions",
              label: "",
              render: (item) => (
                <Link href={`/admin/pages/${item.id}`} className="text-sm text-[#2563EB] hover:underline">
                  Edit
                </Link>
              ),
            },
          ]}
          data={pages}
        />
      </div>
    </div>
  );
}
