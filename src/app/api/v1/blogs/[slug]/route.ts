import { fetchBlogBySlug } from "@/lib/db/queries";
import { jsonError, jsonOk } from "@/lib/api/http";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const post = await fetchBlogBySlug(slug);
    if (!post) {
      return jsonError("Blog post not found", 404);
    }
    return jsonOk(post);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load blog post";
    return jsonError(message, 500);
  }
}
