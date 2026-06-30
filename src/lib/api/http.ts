import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json({ ok: true, data }, { status });
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function requireAdminSession() {
  const session = await auth();
  if (!session?.user) {
    return { session: null, error: jsonError("Unauthorized", 401) as NextResponse };
  }
  return { session, error: null };
}

export function parseJsonBody<T extends Record<string, unknown>>(body: unknown): T | null {
  if (!body || typeof body !== "object") return null;
  return body as T;
}
