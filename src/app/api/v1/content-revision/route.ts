import { NextResponse } from "next/server";
import { getContentRevision } from "@/lib/content-revision";
import { jsonError } from "@/lib/api/http";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** Lightweight poll endpoint for live public-site refresh after admin edits. */
export async function GET() {
  try {
    const revision = await getContentRevision();
    return NextResponse.json(
      { ok: true, data: { revision } },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unavailable";
    return jsonError(message, 503);
  }
}
