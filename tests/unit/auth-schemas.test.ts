import { describe, expect, it } from "vitest";

import { signInSchema } from "../../src/features/auth/schemas";

describe("administrator sign-in validation", () => {
  it("normalises a valid administrator email", () => {
    const result = signInSchema.parse({
      email: " Admin@Example.com ",
      password: "a-secure-password",
    });
    expect(result.email).toBe("admin@example.com");
  });

  it("rejects short passwords before authentication", () => {
    expect(signInSchema.safeParse({ email: "admin@example.com", password: "short" }).success).toBe(
      false,
    );
  });
});
