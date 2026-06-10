import { AdminHeader } from "@/components/admin/header";
import { SlideManager } from "@/components/admin/slide-manager";
import { withDbRetry } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SlidesAdminPage() {
  const heroSection = await withDbRetry((prisma) =>
    prisma.section.findFirst({
      where: { type: "HERO", page: { isHome: true } },
      orderBy: { order: "asc" },
      select: { id: true },
    })
  );

  const slides = heroSection
    ? await withDbRetry((prisma) =>
        prisma.heroSlide.findMany({
          where: { sectionId: heroSection.id },
          orderBy: { order: "asc" },
        })
      )
    : [];

  return (
    <div className="min-h-screen">
      <AdminHeader title="Hero Slider" />
      <div className="p-6 lg:p-8">
        <SlideManager slides={slides} hasHeroSection={!!heroSection} />
      </div>
    </div>
  );
}
