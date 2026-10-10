import { test, expect } from "@playwright/test";

test("keyboard navigation, real API response, and direct-route refresh", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  await page
    .getByRole("navigation", { name: "Main" })
    .getByRole("link", { name: "Service status" })
    .click();
  await expect(page.getByRole("main")).toBeFocused();
  await expect(
    page.getByRole("heading", { name: "Application ready" }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Application ready" }),
  ).toBeVisible();
});
test("offline state retries against the real backend", async ({ page }) => {
  await page.route("**/api/ready", (route) => route.abort());
  await page.goto("/status");
  await expect(page.getByRole("alert")).toBeVisible();
  await page.unroute("**/api/ready");
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(
    page.getByRole("heading", { name: "Application ready" }),
  ).toBeVisible();
});
test("narrow layout stays within viewport and unknown routes do not invent a role", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByText("Early development")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.goto("/teacher");
  await expect(
    page.getByRole("heading", { name: "Page not found" }),
  ).toBeVisible();
});
