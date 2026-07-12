import { faviconResponse, loadSiteFaviconBytes } from "@/lib/site-favicon";

export const dynamic = "force-dynamic";

/** Browsers still request /favicon.ico by default. */
export async function GET() {
  const file = await loadSiteFaviconBytes();
  if (!file) {
    return new Response(null, { status: 404 });
  }
  return faviconResponse(file.body, file.contentType);
}
