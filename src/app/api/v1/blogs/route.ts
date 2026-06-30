import { fetchPublishedBlogs } from "@/lib/db/queries";
import { jsonError, jsonOk } from "@/lib/api/http";

export async function GET() {
  try {
    const posts = await fetchPublishedBlogs();
    return jsonOk(posts);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load blogs";
    return jsonError(message, 500);
  }
}
