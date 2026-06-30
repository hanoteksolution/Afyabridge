import { fetchPageBySlug, fetchPageSections } from "@/lib/db/queries";
import { jsonError, jsonOk } from "@/lib/api/http";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const page = await fetchPageBySlug(slug);
    if (!page) {
      return jsonError("Page not found", 404);
    }

    const sections = await fetchPageSections(page.id);
    return jsonOk({ ...page, sections });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load page";
    return jsonError(message, 500);
  }
}
