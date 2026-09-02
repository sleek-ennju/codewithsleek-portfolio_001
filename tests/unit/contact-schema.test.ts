import { describe, expect, it } from "vitest";

import { contactFormSchema } from "../../src/features/contact/schemas";

describe("contactFormSchema", () => {
  it("accepts a complete project enquiry", () => {
    const result = contactFormSchema.safeParse({
      name: "Ada Lovelace",
      email: "ada@example.com",
      message: "I need a responsive product interface for a new operations platform.",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid email and thin messages", () => {
    const result = contactFormSchema.safeParse({
      name: "A",
      email: "not-an-email",
      message: "Hello",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.name).toBeDefined();
      expect(errors.email).toBeDefined();
      expect(errors.message).toBeDefined();
    }
  });
});
