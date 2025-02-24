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

  test("Verify Image Recognition CAPTCHA appears on submission", async ({
    page,
  }) => {
    // Fill and submit form
    await page.goto(`${BASE_URL}/${path}`);
    await page.getByLabel("First Name").fill("John");
    await page.getByLabel("Last Name").fill("Doe");
    await page.getByLabel("Your number").fill("0400000000");
    await page.getByLabel("Your email").fill("john.doe@example.com");
    await page.getByLabel("Message").fill("This is a test message.");

    await page.getByRole("button", { name: "Send Enquiry" }).click();
    // Check for Image Recognition CAPTCHA
    const captchaIframes = [
      'iframe[title="hCaptcha challenge"]', // hCAPTCHA Invisible
      'iframe[title="Widget containing checkbox for hCaptcha challenge"]', // hCAPTCHA Checkbox
      'iframe[title="reCAPTCHA"]', // reCAPTCHA Checkbox
      'iframe[src*="recaptcha"]', // reCAPTCHA iframe
    ];

    let captchaVisible = false;

    for (const selector of captchaIframes) {
      const captcha = page.locator(selector);
      if (await captcha.isVisible({ timeout: 5000 })) {
        console.log(`CAPTCHA detected: ${selector}`);
        captchaVisible = true;
        break;
      }
    }

    if (!captchaVisible) {
      console.log("No CAPTCHA detected.");
    }
  });
});
