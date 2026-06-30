import { fetchContacts, insertContact } from "@/lib/db/queries";
import { jsonError, jsonOk, parseJsonBody, requireAdminSession } from "@/lib/api/http";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  try {
    const contacts = await fetchContacts();
    return jsonOk(contacts);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load contacts";
    return jsonError(message, 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = parseJsonBody<{
      name?: string;
      email?: string;
      facilityName?: string;
      role?: string;
      facilityType?: string;
      phone?: string;
      country?: string;
      message?: string;
      requestDemo?: boolean;
    }>(await request.json());

    if (!body?.name?.trim() || !body?.email?.trim()) {
      return jsonError("name and email are required", 422);
    }

    const contact = await insertContact({
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      facilityName: body.facilityName,
      role: body.role,
      facilityType: body.facilityType,
      phone: body.phone,
      country: body.country,
      message: body.message,
      requestDemo: Boolean(body.requestDemo),
    });

    return jsonOk(contact, 201);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save contact";
    return jsonError(message, 500);
  }
}
