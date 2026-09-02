import { describe, expect, it } from "vitest";

import { normalizeDatabaseUrl } from "../../src/server/database-url";

describe("normalizeDatabaseUrl", () => {
  it.each(["prefer", "require", "verify-ca"])("upgrades sslmode=%s to verify-full", (sslmode) => {
    const result = normalizeDatabaseUrl(
      `postgresql://user:pass@example.com/app?sslmode=${sslmode}`,
    );
    expect(new URL(result).searchParams.get("sslmode")).toBe("verify-full");
  });

  it("preserves an explicit verify-full mode", () => {
    const result = normalizeDatabaseUrl(
      "postgresql://user:pass@example.com/app?sslmode=verify-full",
    );
    expect(new URL(result).searchParams.get("sslmode")).toBe("verify-full");
  });

  it("preserves unrelated connection parameters", () => {
    const result = normalizeDatabaseUrl(
      "postgresql://user:pass@example.com/app?sslmode=require&connect_timeout=15",
    );
    expect(new URL(result).searchParams.get("connect_timeout")).toBe("15");
  });
});
