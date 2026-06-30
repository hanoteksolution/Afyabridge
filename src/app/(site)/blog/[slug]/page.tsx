import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { getBlogPostBySlug } from "@/lib/cms";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";
export const revalidate = 120;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt || undefined,
    openGraph: {
      title: post.seo?.ogTitle || post.title,
      description: post.seo?.ogDescription || post.excerpt || undefined,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug, { publishedOnly: true });

  if (!post) notFound();

  return (
    <article className="pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {post.category && (
          <Badge variant="secondary" className="mb-4">
            {post.category.name}
          </Badge>
        )}
        <h1 className="text-4xl font-bold text-[#0A1F78] leading-tight">
          {post.title}
        </h1>
        <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
          <span>{post.author?.name || "Afya Bridge"}</span>
          {post.publishedAt && (
            <span>{format(new Date(post.publishedAt), "MMMM d, yyyy")}</span>
          )}
        </div>
        {post.coverImage && (
          <div className="mt-8 aspect-[16/9] relative rounded-2xl overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div
          className="mt-8 prose prose-slate max-w-none prose-headings:text-[#0A1F78] prose-a:text-[#2563EB]"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </article>
  );
}
