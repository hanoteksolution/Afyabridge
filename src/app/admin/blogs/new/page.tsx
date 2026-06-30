import { AdminHeader } from "@/components/admin/header";
import { BlogForm } from "@/components/admin/blog-form";
import { withDbRetry } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NewBlogPage() {
  const categories = await withDbRetry((prisma) =>
    prisma.blogCategory.findMany({ orderBy: { name: "asc" } })
  );

  return (
    <div className="min-h-screen">
      <AdminHeader title="Add new post" />
      <div className="p-6 lg:p-8">
        <BlogForm categories={categories} />
      </div>
    </div>
  );
}
