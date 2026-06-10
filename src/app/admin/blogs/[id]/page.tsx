import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/header";
import { BlogForm } from "@/components/admin/blog-form";
import { withDbRetry } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, categories] = await withDbRetry((prisma) =>
    Promise.all([
      prisma.blogPost.findUnique({ where: { id } }),
      prisma.blogCategory.findMany({ orderBy: { name: "asc" } }),
    ])
  );

  if (!post) notFound();

  return (
    <div className="min-h-screen">
      <AdminHeader title={`Edit: ${post.title}`} />
      <div className="p-6 lg:p-8">
        <BlogForm post={post} categories={categories} />
      </div>
    </div>
  );
}
