import { cache } from "react";
import { withDbRetry, type PrismaClient } from "@/lib/prisma";
import type { Page, Section, SectionType, SEO } from "@prisma/client";

type PageWithSections = Page & {
  sections: Section[];
  seo: SEO | null;
};

function groupBySectionId<T extends { sectionId: string }>(items: T[]) {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const list = map.get(item.sectionId) ?? [];
    list.push(item);
    map.set(item.sectionId, list);
  }
  return map;
}

/** Smaller queries — one deep include overwhelms Prisma dev Postgres. */
async function fetchPageWithSectionRelations(
  loadPage: (prisma: PrismaClient) => Promise<PageWithSections | null>
) {
  const page = await withDbRetry(loadPage);
  if (!page) return null;

  const sectionIds = page.sections.map((section) => section.id);
  if (sectionIds.length === 0) {
    return {
      ...page,
      sections: page.sections.map((section) => ({
        ...section,
        heroSlides: [],
        trustStats: [],
        whyCards: [],
        industries: [],
        serviceModules: [],
        approachSteps: [],
        missionValues: [],
      })),
    };
  }

  const [
    heroSlides,
    trustStats,
    whyCards,
    industries,
    serviceModules,
    approachSteps,
    missionValues,
  ] = await Promise.all([
    withDbRetry((prisma) =>
      prisma.heroSlide.findMany({
        where: { sectionId: { in: sectionIds }, isVisible: true },
        orderBy: { order: "asc" },
      })
    ),
    withDbRetry((prisma) =>
      prisma.trustStat.findMany({
        where: { sectionId: { in: sectionIds } },
        orderBy: { order: "asc" },
      })
    ),
    withDbRetry((prisma) =>
      prisma.whyCard.findMany({
        where: { sectionId: { in: sectionIds }, isVisible: true },
        orderBy: { order: "asc" },
      })
    ),
    withDbRetry((prisma) =>
      prisma.industry.findMany({
        where: { sectionId: { in: sectionIds }, isVisible: true },
        orderBy: { order: "asc" },
      })
    ),
    withDbRetry((prisma) =>
      prisma.serviceModule.findMany({
        where: { sectionId: { in: sectionIds }, isVisible: true },
        orderBy: { order: "asc" },
      })
    ),
    withDbRetry((prisma) =>
      prisma.approachStep.findMany({
        where: { sectionId: { in: sectionIds }, isVisible: true },
        orderBy: { order: "asc" },
      })
    ),
    withDbRetry((prisma) =>
      prisma.missionValue.findMany({
        where: { sectionId: { in: sectionIds }, isVisible: true },
        orderBy: { order: "asc" },
      })
    ),
  ]);

  const heroMap = groupBySectionId(heroSlides);
  const trustMap = groupBySectionId(trustStats);
  const whyMap = groupBySectionId(whyCards);
  const industryMap = groupBySectionId(industries);
  const moduleMap = groupBySectionId(serviceModules);
  const stepMap = groupBySectionId(approachSteps);
  const valueMap = groupBySectionId(missionValues);

  return {
    ...page,
    sections: page.sections.map((section) => ({
      ...section,
      heroSlides: heroMap.get(section.id) ?? [],
      trustStats: trustMap.get(section.id) ?? [],
      whyCards: whyMap.get(section.id) ?? [],
      industries: industryMap.get(section.id) ?? [],
      serviceModules: moduleMap.get(section.id) ?? [],
      approachSteps: stepMap.get(section.id) ?? [],
      missionValues: valueMap.get(section.id) ?? [],
    })),
  };
}

function isDbUnreachable(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const e = error as { code?: string; message?: string };
  const message = e.message ?? "";
  return (
    e.code === "P1001" ||
    e.code === "P1000" ||
    e.code === "P1017" ||
    message.includes("Can't reach database server") ||
    message.includes("Connection refused") ||
    message.includes("ECONNREFUSED") ||
    message.includes("Server has closed the connection") ||
    message.includes("Connection terminated unexpectedly") ||
    message.includes("ConnectionClosed")
  );
}

/** Public-site queries: return fallback instead of crashing the page when DB is down. */
async function cmsSafe<T>(label: string, fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.warn(`[cms] ${label} failed:`, error);
    if (isDbUnreachable(error) && process.env.NODE_ENV === "development") {
      console.warn(
        "[cms] Database unreachable. Run: npm run db:dev && npm run db:sync-url"
      );
    }
    return fallback;
  }
}

const pageWithSectionsInclude = {
  sections: {
    where: { isVisible: true },
    orderBy: { order: "asc" as const },
  },
  seo: true,
} as const;

export const getHomePage = cache(async function getHomePage() {
  return cmsSafe(
    "getHomePage",
    () =>
      fetchPageWithSectionRelations((prisma) =>
        prisma.page.findFirst({
          where: { isHome: true, isPublished: true },
          include: pageWithSectionsInclude,
        })
      ),
    null
  );
});

export const getPageBySlug = cache(async function getPageBySlug(slug: string) {
  return cmsSafe(
    `getPageBySlug(${slug})`,
    () =>
      fetchPageWithSectionRelations(async (prisma) => {
        const page = await prisma.page.findUnique({
          where: { slug },
          include: pageWithSectionsInclude,
        });
        return page?.isPublished ? page : null;
      }),
    null
  );
});

export const getTestimonials = cache(async function getTestimonials() {
  return cmsSafe(
    "getTestimonials",
    () =>
      withDbRetry((prisma) =>
        prisma.testimonial.findMany({
          where: { isVisible: true },
          orderBy: { order: "asc" },
        })
      ),
    []
  );
});

export const getCaseStudies = cache(async function getCaseStudies(limit = 6) {
  return cmsSafe(
    "getCaseStudies",
    () =>
      withDbRetry((prisma) =>
        prisma.caseStudy.findMany({
          where: { isPublished: true },
          orderBy: { order: "asc" },
          take: limit,
        })
      ),
    []
  );
});

export const getBlogPosts = cache(async function getBlogPosts(limit = 4) {
  return cmsSafe(
    "getBlogPosts",
    () =>
      withDbRetry((prisma) =>
        prisma.blogPost.findMany({
          where: { isPublished: true },
          orderBy: { publishedAt: "desc" },
          take: limit,
          include: { category: true, author: true },
        })
      ),
    []
  );
});

export const getMenuBySlug = cache(async function getMenuBySlug(slug: string) {
  return cmsSafe(
    `getMenuBySlug(${slug})`,
    () =>
      withDbRetry((prisma) =>
        prisma.menu.findUnique({
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
        })
      ),
    null
  );
});

export const getBlogPostBySlug = cache(async function getBlogPostBySlug(
  slug: string,
  options?: { publishedOnly?: boolean }
) {
  const post = await withDbRetry((prisma) =>
    prisma.blogPost.findUnique({
      where: { slug },
      include: { category: true, author: true, seo: true },
    })
  );
  if (options?.publishedOnly && post && !post.isPublished) return null;
  return post;
});

export const getPublishedBlogPostsList = cache(async function getPublishedBlogPostsList() {
  return cmsSafe(
    "getPublishedBlogPostsList",
    () =>
      withDbRetry((prisma) =>
        prisma.blogPost.findMany({
          where: { isPublished: true },
          orderBy: { publishedAt: "desc" },
          include: { category: true, author: true },
        })
      ),
    []
  );
});

export const getSettings = cache(async function getSettings() {
  return cmsSafe(
    "getSettings",
    async () => {
      const settings = await withDbRetry((prisma) => prisma.setting.findMany());
      return settings.reduce(
        (acc, s) => {
          acc[s.key] = s.value;
          return acc;
        },
        {} as Record<string, unknown>
      );
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
  return cmsSafe(
    "getFAQs",
    () =>
      withDbRetry((prisma) =>
        prisma.fAQ.findMany({
          where: { isVisible: true },
          orderBy: { order: "asc" },
        })
      ),
    []
  );
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
