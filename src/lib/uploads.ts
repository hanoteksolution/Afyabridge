import path from "path";
import { mkdir } from "fs/promises";

/** Persistent upload directory (Docker volume at /app/data/uploads in production). */
export function getUploadDir(): string {
  return process.env.UPLOAD_DIR || path.join(process.cwd(), "data", "uploads");
}

export async function ensureUploadDir(): Promise<string> {
  const dir = getUploadDir();
  await mkdir(dir, { recursive: true });
  return dir;
}

/**
 * Resolve a safe absolute path under the upload dir.
 * Accepts "file.png", "uploads/file.png", or nested relative segments.
 */
export function resolveUploadFile(relativePath: string): string | null {
  const uploadDir = path.resolve(getUploadDir());
  const cleaned = relativePath
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")
    .replace(/^uploads\//, "");

  if (!cleaned || cleaned.includes("\0") || cleaned.split("/").some((p) => p === "..")) {
    return null;
  }

  const full = path.resolve(uploadDir, cleaned);
  const prefix = uploadDir.endsWith(path.sep) ? uploadDir : uploadDir + path.sep;
  if (full !== uploadDir && !full.startsWith(prefix)) {
    return null;
  }
  return full;
}

export function mimeForFilename(filename: string): string {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".svg")) return "image/svg+xml";
  if (lower.endsWith(".ico")) return "image/x-icon";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".mp4")) return "video/mp4";
  if (lower.endsWith(".webm")) return "video/webm";
  return "application/octet-stream";
}
