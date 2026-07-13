import { revalidatePath, updateTag } from "next/cache";
import { CMS_CACHE_TAG } from "@/lib/cms-config";
import { bumpContentRevision } from "@/lib/content-revision";

/** Bust CMS data cache and refresh public pages after admin edits. */
export function revalidatePublicSite(paths: string[] = ["/"]) {
  updateTag(CMS_CACHE_TAG);

  const all = new Set(["/", ...paths, "/blog", "/faq", "/case-studies"]);
  for (const p of all) {
    revalidatePath(p);
  }
  revalidatePath("/", "layout");

  // Signal open browser tabs to soft-refresh (see LiveContentRefresh)
  void bumpContentRevision().catch((err) => {
    console.error("Failed to bump content revision:", err);
  });
}
