"use server";
import { revalidatePath } from "next/cache";
import { siteSettingsSchema, type SiteSettingsState } from "@/features/settings/schemas";
import { getDb } from "@/server/db";
import { requireAdmin } from "@/server/permissions/require-admin";

export async function updateSiteSettings(
  _state: SiteSettingsState,
  formData: FormData,
): Promise<SiteSettingsState> {
  const session = await requireAdmin();
  const values = Object.fromEntries(
    [...formData.entries()].map(([key, value]) => [key, String(value)]),
  );
  const parsed = siteSettingsSchema.safeParse(values);
  if (!parsed.success)
    return {
      message: "Review the highlighted fields.",
      errors: parsed.error.flatten().fieldErrors,
      values,
      submissionId: crypto.randomUUID(),
    };
  await getDb().$transaction([
    getDb().siteSetting.upsert({
      where: { key: "site" },
      update: { value: parsed.data },
      create: { key: "site", value: parsed.data },
    }),
    getDb().auditLog.create({
      data: {
        actorId: session.user.id,
        action: "SITE_SETTINGS_UPDATED",
        entityType: "SiteSetting",
        entityId: "site",
      },
    }),
  ]);
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  return { message: "Site settings updated.", submissionId: crypto.randomUUID() };
}
