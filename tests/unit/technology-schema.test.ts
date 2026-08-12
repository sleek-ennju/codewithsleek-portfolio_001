import { describe, expect, it } from "vitest";

import { technologyFormSchema } from "../../src/features/technologies/schemas";

describe("technologyFormSchema", () => {
  it("accepts a reusable technology", () => {
    expect(technologyFormSchema.safeParse({ name: "Next.js", category: "Frontend", icon: "nextjs" }).success).toBe(true);
  });

  it("requires a category", () => {
    expect(technologyFormSchema.safeParse({ name: "PostgreSQL", category: "", icon: "" }).success).toBe(false);
  });

  it("limits long technology names", () => {
    expect(technologyFormSchema.safeParse({ name: "x".repeat(61), category: "Frontend", icon: "" }).success).toBe(false);
  });
});
