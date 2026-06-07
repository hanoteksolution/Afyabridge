import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/header";
import { BlogForm } from "@/components/admin/blog-form";

export default async function NewBlogPage() {
  const categories = await prisma.blogCategory.findMany();
  return (
    <div>
      <AdminHeader title="New Blog Post" />
      <div className="p-6"><BlogForm categories={categories} /></div>
    </div>
  );
}
