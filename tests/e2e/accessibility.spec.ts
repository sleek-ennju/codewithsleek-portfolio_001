import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial", timeout: 60_000 });

const publicRoutes = ["/", "/projects", "/projects/routepilot-logistics-control-center", "/admin/login"];

for (const route of publicRoutes) {
  test(`${route} has no serious or critical accessibility violations`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    const blockingViolations = results.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical");
    expect(blockingViolations.map((violation) => ({ id: violation.id, nodes: violation.nodes.map((node) => node.target) }))).toEqual([]);
  });
}

test("skip navigation moves keyboard focus to the public content", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");

  const skipLink = page.getByRole("link", { name: "Skip to content" });
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
});

test("admin login is fully operable from the keyboard", async ({ page }) => {
  await page.goto("/admin/login");

  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "CODEwithSleek" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Email")).toBeFocused();
  await page.keyboard.type("keyboard@example.com");
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Password")).toBeFocused();
  await page.keyboard.type("keyboard-test-password");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Sign in securely" })).toBeFocused();
  await expect(page.getByRole("button", { name: "Sign in securely" })).toBeEnabled();
});

test("reduced-motion preference disables animated transitions", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const motion = await page.locator(".hero-glow").first().evaluate((element) => {
    const style = getComputedStyle(element);
    return { animationDuration: style.animationDuration, transitionDuration: style.transitionDuration };
  });
  expect(parseFloat(motion.animationDuration)).toBeLessThanOrEqual(0.01);
  expect(parseFloat(motion.transitionDuration)).toBeLessThanOrEqual(0.01);
});

test("mobile navigation remains operable and accessible", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const menu = page.getByText("Menu", { exact: true });
  await expect(menu).toBeVisible();
  await menu.click();
  await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();

  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  const blockingViolations = results.violations.filter((violation) => violation.impact === "serious" || violation.impact === "critical");
  expect(blockingViolations.map((violation) => ({ id: violation.id, nodes: violation.nodes.map((node) => node.target) }))).toEqual([]);
});
