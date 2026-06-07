import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/header";
import { BlogForm } from "@/components/admin/blog-form";

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, categories] = await Promise.all([
    prisma.blogPost.findUnique({ where: { id } }),
    prisma.blogCategory.findMany(),
  ]);
  if (!post) notFound();
  return (
    <div>
      <AdminHeader title={`Edit: ${post.title}`} />
      <div className="p-6"><BlogForm post={post} categories={categories} /></div>
    </div>
  );
}
