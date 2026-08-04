type LighthouseCategory = { score?: number | null };
type LighthouseAudit = { numericValue?: number | null; displayValue?: string };

export type PageSpeedResponse = {
  id?: string;
  lighthouseResult?: {
    finalUrl?: string;
    fetchTime?: string;
    lighthouseVersion?: string;
    runWarnings?: unknown[];
    runtimeError?: { message?: string };
    configSettings?: unknown;
    categories?: Record<string, LighthouseCategory>;
    audits?: Record<string, LighthouseAudit>;
  };
  error?: { message?: string };
};

function score(category: LighthouseCategory | undefined) {
  return typeof category?.score === "number" ? Math.round(category.score * 100) : null;
}

function metric(audit: LighthouseAudit | undefined) {
  return typeof audit?.numericValue === "number" ? audit.numericValue : null;
}

export function parsePageSpeedResult(payload: PageSpeedResponse) {
  const result = payload.lighthouseResult;
  if (!result) throw new Error(payload.error?.message ?? "PageSpeed returned no Lighthouse result.");
  if (result.runtimeError?.message) throw new Error(result.runtimeError.message);

  const categories = result.categories ?? {};
  const audits = result.audits ?? {};
  const auditedAt = result.fetchTime ? new Date(result.fetchTime) : new Date();
  if (Number.isNaN(auditedAt.getTime())) throw new Error("PageSpeed returned an invalid audit date.");

  const selectedAuditIds = ["largest-contentful-paint", "cumulative-layout-shift", "first-contentful-paint", "speed-index", "total-blocking-time", "interaction-to-next-paint"] as const;
  const selectedAudits = Object.fromEntries(selectedAuditIds.map((id) => [id, audits[id] ?? null]));

  return {
    performanceScore: score(categories.performance),
    accessibilityScore: score(categories.accessibility),
    bestPracticesScore: score(categories["best-practices"]),
    seoScore: score(categories.seo),
    lcpMs: metric(audits["largest-contentful-paint"]),
    cls: metric(audits["cumulative-layout-shift"]),
    fcpMs: metric(audits["first-contentful-paint"]),
    speedIndexMs: metric(audits["speed-index"]),
    totalBlockingTimeMs: metric(audits["total-blocking-time"]),
    inpMs: metric(audits["interaction-to-next-paint"]),
    lighthouseVersion: result.lighthouseVersion ?? null,
    auditedAt,
    rawSnapshot: {
      id: payload.id ?? null,
      finalUrl: result.finalUrl ?? null,
      fetchTime: result.fetchTime ?? null,
      lighthouseVersion: result.lighthouseVersion ?? null,
      runWarnings: result.runWarnings ?? [],
      configSettings: result.configSettings ?? null,
      categories,
      audits: selectedAudits,
    },
  };
}

export async function runPageSpeedAudit(testedUrl: string, strategy: "MOBILE" | "DESKTOP", apiKey: string) {
  const endpoint = new URL("https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed");
  endpoint.searchParams.set("url", testedUrl);
  endpoint.searchParams.set("strategy", strategy.toLowerCase());
  endpoint.searchParams.set("key", apiKey);
  for (const category of ["performance", "accessibility", "best-practices", "seo"]) endpoint.searchParams.append("category", category);

  const response = await fetch(endpoint, { cache: "no-store", signal: AbortSignal.timeout(120_000) });
  const payload = await response.json() as PageSpeedResponse;
  if (!response.ok) throw new Error(payload.error?.message ?? `PageSpeed request failed with status ${response.status}.`);
  return parsePageSpeedResult(payload);
}
