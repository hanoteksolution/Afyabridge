import { fetchVisibleFaqs } from "@/lib/db/queries";
import { jsonError, jsonOk } from "@/lib/api/http";

export async function GET() {
  try {
    const faqs = await fetchVisibleFaqs();
    return jsonOk(faqs);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load FAQs";
    return jsonError(message, 500);
  }
}
