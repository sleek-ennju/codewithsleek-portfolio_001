import { expect, test } from "@playwright/test";

test("production safeguards are exposed", async ({ request }) => {
  const pageResponse = await request.get("/");
  expect(pageResponse.ok()).toBeTruthy();
  expect(pageResponse.headers()["x-content-type-options"]).toBe("nosniff");
  expect(pageResponse.headers()["x-frame-options"]).toBe("DENY");
  expect(pageResponse.headers()["referrer-policy"]).toBe("strict-origin-when-cross-origin");

  const healthResponse = await request.get("/api/health");
  expect([200, 503]).toContain(healthResponse.status());
  expect(healthResponse.headers()["cache-control"]).toContain("no-store");
  const healthBody = await healthResponse.json();
  expect(healthBody).toEqual(
    healthResponse.status() === 200
      ? { status: "ok", checks: { database: "ok" } }
      : { status: "unavailable", checks: { database: "unavailable" } },
  );
});

test("landing page exposes its primary conversion journey", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toContainText("Crafting logic");
  await expect(page.getByRole("link", { name: /start a project/i }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /explore my work/i }).first()).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /^https?:\/\//);
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);
});

test("project archive leads to a complete published case study", async ({ page }) => {
  await page.goto("/projects");

  const firstProject = page.locator('a[href^="/projects/"]').first();
  await expect(firstProject).toBeVisible();
  await firstProject.click();

  await expect(page).toHaveURL(/\/projects\/[a-z0-9-]+$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: /all projects/i })).toBeVisible();
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    /^https?:\/\//,
  );
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(2);
});

test("crawler endpoints expose public content and exclude private surfaces", async ({
  request,
}) => {
  const [robotsResponse, sitemapResponse] = await Promise.all([
    request.get("/robots.txt"),
    request.get("/sitemap.xml"),
  ]);

  expect(robotsResponse.ok()).toBeTruthy();
  expect(sitemapResponse.ok()).toBeTruthy();

  const robots = await robotsResponse.text();
  const sitemap = await sitemapResponse.text();
  expect(robots).toContain("Disallow: /admin/");
  expect(robots).toContain("Disallow: /api/");
  expect(sitemap).toContain("/projects/");
  expect(sitemap).not.toContain("/admin");
  expect(sitemap).not.toContain("localhost");
});

test("unknown and unpublished-looking project slugs stay private", async ({ page }) => {
  const response = await page.goto("/projects/codex-e2e-unpublished-project");
  expect(response?.status()).toBe(404);
  await expect(page).toHaveURL(/\/projects\/codex-e2e-unpublished-project$/);
});
