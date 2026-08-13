import { describe, expect, it } from "vitest";

import { absoluteUrl, serializeJsonLd } from "../../src/lib/seo";

describe("SEO helpers", () => {
  it("builds absolute URLs from public paths", () => {
    expect(new URL(absoluteUrl("/projects/example")).pathname).toBe("/projects/example");
  });

  it("escapes markup-significant characters in JSON-LD", () => {
    const result = serializeJsonLd({ value: "</script><script>alert(1)</script>" });
    expect(result).not.toContain("<");
    expect(JSON.parse(result).value).toBe("</script><script>alert(1)</script>");
  });
});
