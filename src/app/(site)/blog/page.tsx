import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { getPublishedBlogPostsList } from "@/lib/cms";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";
export const revalidate = 120;

export const metadata: Metadata = {
  title: "Blog",
  description: "Healthcare technology insights from Afya Bridge.",
};

export default async function BlogPage() {
  const posts = await getPublishedBlogPostsList();

  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-[#0A1F78]">
            Healthcare Technology Insights
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Latest news, guides, and insights from Afya Bridge.
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-slate-500 py-12">
            No blog posts published yet.
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.id}
                className="rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-xl transition-shadow bg-white"
              >
                <div className="aspect-[16/10] bg-slate-100 relative">
                  {post.coverImage && (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="p-6">
                  {post.category && (
                    <Badge variant="secondary" className="mb-2">
                      {post.category.name}
                    </Badge>
                  )}
                  <h2 className="text-lg font-semibold text-[#0A1F78]">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-[#2563EB]"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-2 text-sm text-slate-600 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 text-xs text-slate-400">
                    {post.author?.name} ·{" "}
                    {post.publishedAt &&
                      format(new Date(post.publishedAt), "MMM d, yyyy")}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
