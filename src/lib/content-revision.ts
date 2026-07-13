import { withDbRetry } from "@/lib/prisma";

export const CONTENT_REVISION_KEY = "content_revision";

/** Bump whenever CMS content changes so open public tabs can refresh. */
export async function bumpContentRevision(): Promise<string> {
  const revision = String(Date.now());
  await withDbRetry((prisma) =>
    prisma.setting.upsert({
      where: { key: CONTENT_REVISION_KEY },
      create: {
        key: CONTENT_REVISION_KEY,
        value: revision,
        group: "system",
      },
      update: { value: revision },
    })
  );
  return revision;
}

export async function getContentRevision(): Promise<string> {
  const row = await withDbRetry((prisma) =>
    prisma.setting.findUnique({ where: { key: CONTENT_REVISION_KEY } })
  );
  if (row?.value == null) return "0";
  if (typeof row.value === "string" || typeof row.value === "number") {
    return String(row.value);
  }
  return JSON.stringify(row.value);
}
