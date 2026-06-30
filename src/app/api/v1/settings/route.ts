import { fetchSettingsMap } from "@/lib/db/queries";
import { jsonError, jsonOk } from "@/lib/api/http";

export async function GET() {
  try {
    const settings = await fetchSettingsMap();
    return jsonOk(settings);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load settings";
    return jsonError(message, 500);
  }
}
