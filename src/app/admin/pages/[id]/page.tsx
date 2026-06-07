import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionManager } from "@/components/admin/section-manager";
import { PageForm } from "@/components/admin/page-form";
import { SeoForm } from "@/components/admin/seo-form";
import { ArrowLeft } from "lucide-react";

export default async function PageEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const page = await prisma.page.findUnique({
    where: { id },
    include: {
      sections: {
        orderBy: { order: "asc" },
        include: {
          heroSlides: true,
          trustStats: true,
          whyCards: true,
          industries: true,
          serviceModules: true,
          approachSteps: true,
          missionValues: true,
        },
      },
      seo: true,
    },
  });

  if (!page) notFound();

  return (
    <div>
      <AdminHeader title={`Edit: ${page.title}`} />
      <div className="p-6 space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/pages"><ArrowLeft className="mr-1 h-4 w-4" /> Back</Link>
          </Button>
          <Badge variant={page.isPublished ? "success" : "outline"}>{page.isPublished ? "Published" : "Draft"}</Badge>
          {page.isHome && <Badge variant="accent">Home Page</Badge>}
          <a href={page.isHome ? "/" : `/${page.slug}`} target="_blank" className="text-sm text-[#2563EB] hover:underline">View live →</a>
        </div>

        <PageForm page={page} />
        <SeoForm pageId={page.id} seo={page.seo} />
        <SectionManager pageId={page.id} sections={page.sections} />
      </div>
    </div>
  );
}
