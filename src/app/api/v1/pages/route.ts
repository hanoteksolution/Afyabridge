import { fetchPublishedPages } from "@/lib/db/queries";
import { jsonError, jsonOk } from "@/lib/api/http";

export async function GET() {
  try {
    const pages = await fetchPublishedPages();
    return jsonOk(pages);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load pages";
    return jsonError(message, 500);
  }
}
