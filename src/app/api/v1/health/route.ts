import { checkDatabaseConnection } from "@/lib/db";
import { jsonError, jsonOk } from "@/lib/api/http";

export async function GET() {
  try {
    await checkDatabaseConnection();
    return jsonOk({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database unreachable";
    return jsonError(message, 503);
  }
}
