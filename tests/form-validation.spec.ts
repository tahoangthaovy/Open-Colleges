//CAPTCHA needs to handle

import { test, expect } from "@playwright/test";
import { BASE_URL } from "../config";
const path = "pages/contact";

test.describe("Form Validation", () => {
  test("Submit form missing required fields", async ({ page }) => {
    await page.goto(`${BASE_URL}/${path}`);

    await page.click('button[type="submit"]');

    // Validate error messages
    const invalidInputs = await page.evaluate(() => {
      return document.querySelectorAll("input:invalid, textarea:invalid")
        .length;
    });
    expect(invalidInputs).toBeGreaterThan(0);
  });

  test("Submit form successfully", async ({ page }) => {
    await page.goto(`${BASE_URL}/${path}`);

    //Fill form
    await page.fill('//*[@id="ContactForm-first_name"]', "John");
    await page.fill('//*[@id="ContactForm-last_name"]', "Doe");
    await page.fill('//*[@id="ContactForm-phone"]', "0400000000");
    await page.fill('//*[@id="ContactForm-email"]', "john.doe@example.com");
    await page.selectOption('//*[@id="ContactForm-select"]', "Now");
    await page.fill('//*[@id="ContactForm-body"]', "This is a test message.");

    // Submit form
    await page.click('//button[contains(text(), "Send Enquiry")]');

    // Wait for CAPTCHA to load
    const captcha = page.locator('//div[contains(@class, "h-captcha")]');
    if (await captcha.isVisible({ timeout: 5000 })) {
      console.log("⚠️ CAPTCHA detected! Please solve it manually.");
      await page.waitForTimeout(30000); // Wait for CAPTCHA to be solved
    }

    // Verify success message
    await expect(
      page.locator('//div[contains(@class, "success-message")]')
    ).toBeVisible({ timeout: 10000 });
  });
});
