import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/header";
import { SlideManager } from "@/components/admin/slide-manager";

export const dynamic = "force-dynamic";

export default async function SlidesAdminPage() {
  const heroSection = await prisma.section.findFirst({
    where: { type: "HERO", page: { isHome: true } },
    orderBy: { order: "asc" },
    select: { id: true },
  });

  const slides = heroSection
    ? await prisma.heroSlide.findMany({
        where: { sectionId: heroSection.id },
        orderBy: { order: "asc" },
      })
    : [];

  return (
    <div>
      <AdminHeader title="Hero Slider" />
      <div className="p-6">
        <p className="text-sm text-slate-500 mb-6">
          Manage the slides shown in the homepage hero. Add headlines, images,
          badges, and call-to-action buttons.
        </p>
        <SlideManager slides={slides} hasHeroSection={!!heroSection} />
      </div>
    </div>
  );
}
