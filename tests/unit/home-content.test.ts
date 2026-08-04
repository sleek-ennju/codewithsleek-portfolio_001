import { describe, expect, it } from "vitest";

import { credibilityMetrics, processSteps } from "../../src/features/home/content";

describe("home content contracts", () => {
  it("keeps the four-stage delivery process in order", () => {
    expect(processSteps.map((step) => step.number)).toEqual(["01", "02", "03", "04"]);
    expect(processSteps.every((step) => step.output.length > 0)).toBe(true);
  });

  it("provides a label for every credibility metric", () => {
    expect(credibilityMetrics.every((metric) => metric.value && metric.label)).toBe(true);
  });
});
