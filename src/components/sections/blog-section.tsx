"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { HEALTHCARE_IMAGES } from "@/lib/images";
import { sectionEyebrow } from "@/lib/section-content";
import type { FullSection } from "@/lib/cms";
import type { BlogPost, BlogCategory, User } from "@prisma/client";

type BlogPostWithRelations = BlogPost & {
  category: BlogCategory | null;
  author: User | null;
};

interface BlogSectionProps {
  section: FullSection;
  blogPosts: BlogPostWithRelations[];
}

const FALLBACK_IMAGES = [
  HEALTHCARE_IMAGES.dataAnalytics,
  HEALTHCARE_IMAGES.nurse,
  HEALTHCARE_IMAGES.surgeon,
];

export function BlogSection({ section, blogPosts }: BlogSectionProps) {
  if (!blogPosts.length) return null;

  const readTime = (content: string) => Math.max(2, Math.round(content.split(" ").length / 200));

  return (
    <section className="bg-mesh py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 flex flex-col items-end justify-between gap-4 sm:flex-row">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-wider text-[var(--secondary,#2D7FF9)]">
              {sectionEyebrow(section, "Insights")}
            </span>
            <h2 className="mt-3 text-3xl font-bold text-[#0A2A8B] sm:text-4xl lg:text-[2.7rem]">
              {section.title || "Healthcare technology insights"}
            </h2>
          </div>
          <Button variant="outline" asChild>
            <Link href="/blog">View All <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-[0_30px_60px_rgba(10,42,139,0.14)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={post.coverImage || FALLBACK_IMAGES[i % 3]}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                {post.category && (
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#0A2A8B] backdrop-blur">
                    {post.category.name}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-3 flex items-center gap-3 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {readTime(post.content)} min read
                  </span>
                  {post.publishedAt && <span>· {format(new Date(post.publishedAt), "MMM d, yyyy")}</span>}
                </div>
                <h3 className="text-lg font-bold text-[#0A2A8B] transition-colors group-hover:text-[#2D7FF9]">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="mt-2 line-clamp-2 flex-1 text-sm text-slate-600">{post.excerpt}</p>
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#0A2A8B] to-[#2D7FF9] text-xs font-bold text-white">
                      {(post.author?.name || "A").charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-slate-600">{post.author?.name || "Afya Bridge"}</span>
                  </div>
                  <Link href={`/blog/${post.slug}`} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F4F7FF] text-[#2D7FF9] transition-colors group-hover:bg-[#2D7FF9] group-hover:text-white">
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
