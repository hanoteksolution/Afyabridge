import { faviconResponse, loadSiteFaviconBytes } from "@/lib/site-favicon";

export const dynamic = "force-dynamic";

/** App-router /icon — used by Next metadata and modern browsers. */
export async function GET() {
  const file = await loadSiteFaviconBytes();
  if (!file) {
    return new Response(null, { status: 404 });
  }
  return faviconResponse(file.body, file.contentType);
}
