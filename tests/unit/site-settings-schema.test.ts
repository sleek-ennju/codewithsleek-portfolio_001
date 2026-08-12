import { describe, expect, it } from "vitest";
import { defaultSiteSettings, siteSettingsSchema } from "../../src/features/settings/schemas";

describe("siteSettingsSchema", () => {
  it("accepts the safe defaults", () => expect(siteSettingsSchema.safeParse(defaultSiteSettings).success).toBe(true));
  it("rejects malformed social URLs", () => expect(siteSettingsSchema.safeParse({ ...defaultSiteSettings, githubUrl: "github" }).success).toBe(false));
  it("requires valid contact email", () => expect(siteSettingsSchema.safeParse({ ...defaultSiteSettings, contactEmail: "not-an-email" }).success).toBe(false));
});
