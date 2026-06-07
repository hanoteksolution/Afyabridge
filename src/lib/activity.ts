import { prisma } from "@/lib/prisma";
import { Prisma, type ActivityAction } from "@prisma/client";

export async function logActivity({
  userId,
  action,
  entity,
  entityId,
  details,
  ipAddress,
}: {
  userId?: string;
  action: ActivityAction;
  entity: string;
  entityId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
}) {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        details: details ? (details as Prisma.InputJsonValue) : undefined,
        ipAddress,
      },
    });
  } catch {
    // Non-blocking audit logging
  }
}
