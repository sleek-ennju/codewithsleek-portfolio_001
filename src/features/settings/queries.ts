import { cache } from "react";
import { defaultSiteSettings, siteSettingsSchema } from "@/features/settings/schemas";
import { isDatabaseUnavailable, withDatabaseRetry } from "@/server/database-resilience";
import { getDb } from "@/server/db";

export const getSiteSettings = cache(async () => {
  try {
    const record = await withDatabaseRetry(() => getDb().siteSetting.findUnique({ where: { key: "site" }, select: { value: true } }));
    const parsed = siteSettingsSchema.safeParse(record?.value);
    return parsed.success ? parsed.data : defaultSiteSettings;
  } catch (error) {
    if (!isDatabaseUnavailable(error)) throw error;
    console.error("[settings:read] Database temporarily unavailable after retries");
    return defaultSiteSettings;
  }
});
