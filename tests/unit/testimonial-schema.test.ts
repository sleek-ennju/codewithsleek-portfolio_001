import { describe, expect, it } from "vitest";
import { testimonialFormSchema } from "../../src/features/testimonials/schemas";

const valid = {
  authorName: "Ada Client",
  authorRole: "Product lead",
  clientName: "Acme",
  quote: "Emmanuel translated a complex brief into a clear and dependable product.",
  projectId: "",
  photoId: "",
  published: true,
  featured: true,
};

describe("testimonialFormSchema", () => {
  it("accepts attributable client proof", () =>
    expect(testimonialFormSchema.safeParse(valid).success).toBe(true));
  it("rejects an anonymous client", () =>
    expect(testimonialFormSchema.safeParse({ ...valid, authorName: "" }).success).toBe(false));
  it("rejects an unhelpfully short quote", () =>
    expect(testimonialFormSchema.safeParse({ ...valid, quote: "Nice work." }).success).toBe(false));
});
