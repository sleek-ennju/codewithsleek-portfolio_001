import { describe, expect, it } from "vitest";

import { parsePageSpeedResult } from "../../src/features/audits/pagespeed";
import { auditRequestSchema } from "../../src/features/audits/schemas";

describe("performance audit contracts", () => {
  it("accepts public audit requests and rejects unsupported protocols", () => {
    expect(auditRequestSchema.safeParse({ projectId: "project", testedUrl: "https://example.com", strategy: "MOBILE" }).success).toBe(true);
    expect(auditRequestSchema.safeParse({ projectId: "project", testedUrl: "file:///secret", strategy: "DESKTOP" }).success).toBe(false);
  });

  it("normalizes Lighthouse scores and measurements", () => {
    const result = parsePageSpeedResult({ lighthouseResult: { fetchTime: "2026-08-04T12:00:00.000Z", lighthouseVersion: "13.0.0", categories: { performance: { score: 0.94 }, accessibility: { score: 1 }, "best-practices": { score: 0.96 }, seo: { score: 0.92 } }, audits: { "largest-contentful-paint": { numericValue: 1840 }, "cumulative-layout-shift": { numericValue: 0.02 } } } });
    expect(result.performanceScore).toBe(94);
    expect(result.accessibilityScore).toBe(100);
    expect(result.lcpMs).toBe(1840);
    expect(result.cls).toBe(0.02);
    expect(result.auditedAt.toISOString()).toBe("2026-08-04T12:00:00.000Z");
  });
});
