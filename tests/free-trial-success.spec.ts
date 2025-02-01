import { test, expect } from "@playwright/test";

test.describe("Critical Flows", () => {
  test("Enquire Now → Lead được gửi đến CRM", async ({ page }) => {
    await page.goto("/enquire");
    await page.fill("#name", "Test User");
    await page.fill("#email", "test@example.com");
    await page.click('button[type="submit"]');
    await expect(page.locator(".lead-success")).toBeVisible();
  });

  test("Free Trial registration success", async ({ page }) => {
    await page.goto("/free-trial");
    await page.fill("#name", "Test User");
    await page.fill("#email", "test@example.com");
    await page.click('button[type="submit"]');
    await expect(page.locator(".trial-success")).toBeVisible();
  });
});
