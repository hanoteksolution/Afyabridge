import { AdminHeader } from "@/components/admin/header";
import { AdminStatsRow } from "@/components/admin/admin-stats-row";
import { MediaGrid } from "@/components/admin/media-grid";
import { MediaUpload } from "@/components/admin/media-upload";
import { withDbRetry } from "@/lib/prisma";

export default async function MediaAdminPage() {
  const media = await withDbRetry((prisma) =>
    prisma.media.findMany({ orderBy: { createdAt: "desc" } })
  );

  const imageCount = media.filter((m) => m.mimeType?.startsWith("image/")).length;

  return (
    <div>
      <AdminHeader title="Media Library" />
      <div className="space-y-6 p-6 lg:p-8">
        <AdminStatsRow
          stats={[
            { title: "Total assets", value: media.length, icon: "Image", variant: "indigo" },
            { title: "Images", value: imageCount, icon: "FileCheck", variant: "blue" },
            { title: "Other files", value: media.length - imageCount, icon: "Package", variant: "cyan" },
            {
              title: "Storage used",
              value: `${(media.reduce((sum, m) => sum + (m.size ?? 0), 0) / 1024 / 1024).toFixed(1)} MB`,
              icon: "BarChart3",
              variant: "emerald",
            },
          ]}
        />
        <MediaUpload />
        <div className="mt-6">
          <MediaGrid media={media} />
        </div>
      </div>
    </div>
  );
}
