import { cache } from "react";
import { withDbRetry } from "@/lib/prisma";
import type { SectionType } from "@prisma/client";

export const getHomePage = cache(async function getHomePage() {
  return withDbRetry((prisma) => prisma.page.findFirst({
    where: { isHome: true, isPublished: true },
    include: {
      sections: {
        where: { isVisible: true },
        orderBy: { order: "asc" },
        include: {
          heroSlides: { where: { isVisible: true }, orderBy: { order: "asc" } },
          trustStats: { orderBy: { order: "asc" } },
          whyCards: { where: { isVisible: true }, orderBy: { order: "asc" } },
          industries: { where: { isVisible: true }, orderBy: { order: "asc" } },
          serviceModules: { where: { isVisible: true }, orderBy: { order: "asc" } },
          approachSteps: { where: { isVisible: true }, orderBy: { order: "asc" } },
          missionValues: { where: { isVisible: true }, orderBy: { order: "asc" } },
        },
      },
      seo: true,
    },
  }));
});

export const getPageBySlug = cache(async function getPageBySlug(slug: string) {
  return withDbRetry((prisma) => prisma.page.findUnique({
    where: { slug, isPublished: true },
    include: {
      sections: {
        where: { isVisible: true },
        orderBy: { order: "asc" },
        include: {
          heroSlides: { where: { isVisible: true }, orderBy: { order: "asc" } },
          trustStats: { orderBy: { order: "asc" } },
          whyCards: { where: { isVisible: true }, orderBy: { order: "asc" } },
          industries: { where: { isVisible: true }, orderBy: { order: "asc" } },
          serviceModules: { where: { isVisible: true }, orderBy: { order: "asc" } },
          approachSteps: { where: { isVisible: true }, orderBy: { order: "asc" } },
          missionValues: { where: { isVisible: true }, orderBy: { order: "asc" } },
        },
      },
      seo: true,
    },
  }));
});

export const getTestimonials = cache(async function getTestimonials() {
  return withDbRetry((prisma) => prisma.testimonial.findMany({
    where: { isVisible: true },
    orderBy: { order: "asc" },
  }));
});

export const getCaseStudies = cache(async function getCaseStudies(limit = 6) {
  return withDbRetry((prisma) => prisma.caseStudy.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
    take: limit,
  }));
});

export const getBlogPosts = cache(async function getBlogPosts(limit = 4) {
  return withDbRetry((prisma) => prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
    include: { category: true, author: true },
  }));
});

export const getMenuBySlug = cache(async function getMenuBySlug(slug: string) {
  return withDbRetry((prisma) => prisma.menu.findUnique({
    where: { slug },
    include: {
      items: {
        where: { isVisible: true, parentId: null },
        orderBy: { order: "asc" },
        include: {
          children: {
            where: { isVisible: true },
            orderBy: { order: "asc" },
          },
        },
      },
    },
  }));
});

export const getSettings = cache(async function getSettings() {
  const settings = await withDbRetry((prisma) => prisma.setting.findMany());
  return settings.reduce(
    (acc, s) => {
      acc[s.key] = s.value;
      return acc;
    },
    {} as Record<string, unknown>
  );
});

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const setting = await withDbRetry((prisma) =>
    prisma.setting.findUnique({ where: { key } })
  );
  return (setting?.value as T) ?? fallback;
}

export type FullSection = NonNullable<
  Awaited<ReturnType<typeof getHomePage>>
>["sections"][number];

export function getSectionByType(sections: FullSection[], type: SectionType) {
  return sections.find((s) => s.type === type);
}

export const getFAQs = cache(async function getFAQs() {
  return withDbRetry((prisma) => prisma.fAQ.findMany({
    where: { isVisible: true },
    orderBy: { order: "asc" },
  }));
});

export const getPublishedPageSlugs = cache(async function getPublishedPageSlugs() {
  const pages = await withDbRetry((prisma) => prisma.page.findMany({
    where: { isPublished: true, isHome: false },
    select: { slug: true },
  }));
  return pages.map((p) => p.slug);
});

export const getPageAuxiliaryData = cache(async function getPageAuxiliaryData() {
  const [testimonials, caseStudies, blogPosts, faqs] = await Promise.all([
    getTestimonials(),
    getCaseStudies(),
    getBlogPosts(),
    getFAQs(),
  ]);
  return { testimonials, caseStudies, blogPosts, faqs };
});
