import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/header";
import { DataTable } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { format } from "date-fns";

export default async function BlogsAdminPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, author: true },
  });

  return (
    <div>
      <AdminHeader title="Blog" />
      <div className="p-6">
        <div className="flex justify-between mb-6">
          <p className="text-sm text-slate-500">Manage blog posts, categories, and tags.</p>
          <Button asChild><Link href="/admin/blogs/new"><Plus className="mr-1 h-4 w-4" /> New Post</Link></Button>
        </div>
        <DataTable
          columns={[
            { key: "title", label: "Title" },
            { key: "category", label: "Category", render: (p) => p.category?.name || "—" },
            { key: "author", label: "Author", render: (p) => p.author?.name || "—" },
            {
              key: "isPublished",
              label: "Status",
              render: (p) => <Badge variant={p.isPublished ? "success" : "outline"}>{p.isPublished ? "Published" : "Draft"}</Badge>,
            },
            {
              key: "publishedAt",
              label: "Published",
              render: (p) => p.publishedAt ? format(new Date(p.publishedAt), "MMM d, yyyy") : "—",
            },
            {
              key: "actions",
              label: "",
              render: (p) => (
                <Link href={`/admin/blogs/${p.id}`} className="text-sm text-[#2563EB] hover:underline">Edit</Link>
              ),
            },
          ]}
          data={posts}
        />
      </div>
    </div>
  );
}
