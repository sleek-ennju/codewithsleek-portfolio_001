import { describe, expect, it } from "vitest";

import { technologyFormSchema } from "../../src/features/technologies/schemas";
import {
  EXPERIENCED_STACK,
  FOCUSED_STACK,
  TECHNOLOGY_LIBRARY,
  technologySlug,
} from "../../src/features/technologies/library";

describe("technologyFormSchema", () => {
  it("accepts a reusable technology", () => {
    expect(
      technologyFormSchema.safeParse({ name: "Next.js", category: "Frontend", icon: "nextjs" })
        .success,
    ).toBe(true);
  });

  it("requires a category", () => {
    expect(
      technologyFormSchema.safeParse({ name: "PostgreSQL", category: "", icon: "" }).success,
    ).toBe(false);
  });

  it("only accepts categories from the managed library", () => {
    expect(
      technologyFormSchema.safeParse({
        name: "Flutterwave",
        category: "Payments",
        icon: "flutterwave",
      }).success,
    ).toBe(false);
    expect(
      technologyFormSchema.safeParse({
        name: "Flutterwave",
        category: "Integrations",
        icon: "flutterwave",
      }).success,
    ).toBe(true);
  });

  it("limits long technology names", () => {
    expect(
      technologyFormSchema.safeParse({ name: "x".repeat(61), category: "Frontend", icon: "" })
        .success,
    ).toBe(false);
  });
});

describe("technology library", () => {
  it("keeps the focused homepage stack at 17 tools", () => {
    expect(FOCUSED_STACK).toHaveLength(17);
  });

  it("uses unique names and slugs across the reusable library", () => {
    expect(new Set(TECHNOLOGY_LIBRARY.map((technology) => technology.name)).size).toBe(
      TECHNOLOGY_LIBRARY.length,
    );
    expect(
      new Set(TECHNOLOGY_LIBRARY.map((technology) => technologySlug(technology.name))).size,
    ).toBe(TECHNOLOGY_LIBRARY.length);
  });

  it("partitions every library entry between focused and experienced stacks", () => {
    expect([...FOCUSED_STACK, ...EXPERIENCED_STACK]).toHaveLength(TECHNOLOGY_LIBRARY.length);
    expect(new Set([...FOCUSED_STACK, ...EXPERIENCED_STACK]).size).toBe(TECHNOLOGY_LIBRARY.length);
  });
});
