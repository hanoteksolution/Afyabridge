/** Page cache interval (seconds). Public routes use `export const revalidate = 120` — keep in sync. */
export const CMS_REVALIDATE_SECONDS = 120;

export const CMS_CACHE_TAG = "cms";

/** Runtime override for data cache only (route segment stays at CMS_REVALIDATE_SECONDS). */
export function getCmsCacheRevalidate(): number {
  const n = Number(process.env.CMS_REVALIDATE_SECONDS);
  return Number.isFinite(n) && n > 0 ? n : CMS_REVALIDATE_SECONDS;
}
