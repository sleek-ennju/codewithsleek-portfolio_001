import { expect, test } from "@playwright/test";

test("protected admin pages redirect anonymous visitors to sign in", async ({ page }) => {
  await page.goto("/admin/dashboard");

  await expect(page).toHaveURL(/\/admin\/login/);
  await expect(page.getByRole("heading", { name: "Welcome back." })).toBeVisible();
});

test("invalid credentials render accessible feedback without repeated clicks", async ({ page }) => {
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill("not-the-admin@example.com");
  await page.getByLabel("Password").fill("definitely-not-the-password");
  await page.getByRole("button", { name: "Sign in securely" }).click();

  await expect(page.locator(".admin-form-error")).toContainText("incorrect", { timeout: 15_000 });
  await expect(page).toHaveURL(/\/admin\/login/);
});

test("protected media API rejects anonymous requests", async ({ request }) => {
  const response = await request.post("/api/admin/media", { multipart: {} });
  expect(response.status()).toBe(401);
  await expect(response.json()).resolves.toMatchObject({ error: "Unauthorized" });
});

test("administrator can reach the content-management workspace", async ({ page }) => {
  test.skip(!process.env.E2E_ADMIN_EMAIL || !process.env.E2E_ADMIN_PASSWORD, "Dedicated E2E admin credentials were not supplied.");

  await page.goto("/admin/login");
  await page.getByLabel("Email").fill(process.env.E2E_ADMIN_EMAIL!);
  await page.getByLabel("Password").fill(process.env.E2E_ADMIN_PASSWORD!);
  await page.getByRole("button", { name: "Sign in securely" }).click();

  await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 15_000 });
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  await page.getByRole("link", { name: "Projects" }).click();
  await expect(page).toHaveURL(/\/admin\/projects/);
  await expect(page.getByRole("link", { name: /create project/i })).toBeVisible();
});
