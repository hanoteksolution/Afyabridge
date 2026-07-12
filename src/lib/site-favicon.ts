import { readFile } from "fs/promises";
import path from "path";
import { getSettings } from "@/lib/cms";
import { parseSiteSettings, resolveSiteFavicon } from "@/lib/site-settings";

function mimeForPath(filePath: string): string {
  const lower = filePath.toLowerCase();
  if (lower.endsWith(".svg")) return "image/svg+xml";
  if (lower.endsWith(".ico")) return "image/x-icon";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  return "image/png";
}

/** Load CMS favicon (or logo) bytes from /public/uploads when present. */
export async function loadSiteFaviconBytes(): Promise<{
  body: Buffer;
  contentType: string;
} | null> {
  const settings = parseSiteSettings(await getSettings());
  const favicon = resolveSiteFavicon(settings);
  if (!favicon?.startsWith("/uploads/")) return null;

  const filePath = path.join(process.cwd(), "public", favicon);
  try {
    const body = await readFile(filePath);
    if (!body.length) return null;
    return { body, contentType: mimeForPath(favicon) };
  } catch {
    return null;
  }
}

export function faviconResponse(
  body: Buffer,
  contentType: string
): Response {
  return new Response(new Uint8Array(body), {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}
