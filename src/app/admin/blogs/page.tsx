import { AdminHeader } from "@/components/admin/header";
import {
  BlogsAdminView,
  type BlogRow,
} from "@/components/admin/blogs-admin-view";
import { withDbRetry } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function BlogsAdminPage() {
  const [posts, categoryCount] = await withDbRetry((prisma) =>
    Promise.all([
      prisma.blogPost.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          category: { select: { id: true, name: true } },
          author: { select: { name: true } },
          _count: { select: { tags: true } },
        },
      }),
      prisma.blogCategory.count(),
    ])
  );

  const rows: BlogRow[] = posts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    isPublished: post.isPublished,
    publishedAt: post.publishedAt?.toISOString() ?? null,
    updatedAt: post.updatedAt.toISOString(),
    category: post.category,
    author: post.author,
    tagCount: post._count.tags,
  }));

  return (
    <div className="min-h-screen">
      <AdminHeader title="Blog" />
      <div className="p-6 lg:p-8">
        <BlogsAdminView posts={rows} categoryCount={categoryCount} />
      </div>
    </div>
  );
}
