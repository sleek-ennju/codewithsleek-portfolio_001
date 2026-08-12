import { cache } from "react";
import { defaultSiteSettings, siteSettingsSchema } from "@/features/settings/schemas";
import { getDb } from "@/server/db";

export const getSiteSettings = cache(async () => {
  const record = await getDb().siteSetting.findUnique({ where: { key: "site" }, select: { value: true } });
  const parsed = siteSettingsSchema.safeParse(record?.value);
  return parsed.success ? parsed.data : defaultSiteSettings;
});
