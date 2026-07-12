import { readFile } from "fs/promises";
import { getSettings } from "@/lib/cms";
import { parseSiteSettings, resolveSiteFavicon } from "@/lib/site-settings";
import { mimeForFilename, resolveUploadFile } from "@/lib/uploads";

/** Load CMS favicon (or logo) bytes from the uploads volume when present. */
export async function loadSiteFaviconBytes(): Promise<{
  body: Buffer;
  contentType: string;
} | null> {
  const settings = parseSiteSettings(await getSettings());
  const favicon = resolveSiteFavicon(settings);
  if (!favicon?.startsWith("/uploads/")) return null;

  const filePath = resolveUploadFile(favicon.slice("/uploads/".length));
  if (!filePath) return null;

  try {
    const body = await readFile(filePath);
    if (!body.length) return null;
    return { body, contentType: mimeForFilename(favicon) };
  } catch {
    return null;
  }
}

export function faviconResponse(body: Buffer, contentType: string): Response {
  return new Response(new Uint8Array(body), {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}
