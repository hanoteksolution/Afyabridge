import { fetchVisibleTestimonials } from "@/lib/db/queries";
import { jsonError, jsonOk } from "@/lib/api/http";

export async function GET() {
  try {
    const testimonials = await fetchVisibleTestimonials();
    return jsonOk(testimonials);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load testimonials";
    return jsonError(message, 500);
  }
}
