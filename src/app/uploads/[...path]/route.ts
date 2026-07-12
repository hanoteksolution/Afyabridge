import { readFile, stat } from "fs/promises";
import { mimeForFilename, resolveUploadFile } from "@/lib/uploads";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Params = { path: string[] };

/**
 * Serve runtime uploads. Next.js production does not serve files written to
 * `public/` after build — this route reads them from the uploads volume.
 */
export async function GET(
  _request: Request,
  context: { params: Promise<Params> }
) {
  const { path: segments } = await context.params;
  if (!segments?.length) {
    return new Response("Not found", { status: 404 });
  }

  const filePath = resolveUploadFile(segments.join("/"));
  if (!filePath) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const info = await stat(filePath);
    if (!info.isFile()) {
      return new Response("Not found", { status: 404 });
    }

    const body = await readFile(filePath);
    const filename = segments[segments.length - 1] || "file";

    return new Response(new Uint8Array(body), {
      headers: {
        "Content-Type": mimeForFilename(filename),
        "Content-Length": String(info.size),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
