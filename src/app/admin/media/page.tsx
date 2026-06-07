import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/header";
import { MediaGrid } from "@/components/admin/media-grid";
import { MediaUpload } from "@/components/admin/media-upload";

export default async function MediaAdminPage() {
  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <AdminHeader title="Media Library" />
      <div className="p-6">
        <MediaUpload />
        <div className="mt-6">
          <MediaGrid media={media} />
        </div>
      </div>
    </div>
  );
}
