//having bug

import { test, expect } from "@playwright/test";
import { BASE_URL } from "../config";

// Test Case 1: Course Selection to Payment Process
test("E2E - Course Selection to Payment Process", async ({ page }) => {
  await page.goto(BASE_URL);

  // Select a Course
  await page.click("text=Courses");
  await page.click("text=Business & Leadership");
  await page.click("text=Diploma of Leadership and Management");

  // View Course Details
  await expect(page.locator("h1")).toContainText(
    "Diploma of Leadership and Management"
  );
  //await page.click("//*[@id="ProductSubmitButton-template--24248591122751__main"]");

  // Proceed to Checkout
  //await page.click("//*[@id="variant-radios-template--24248591122751__main"]/fieldset/ul/li[3]/label/span");
  //await page.click("//*[@id="cart"]/input");

  // Fill Personal Information
  await page.fill('//input[@name="firstName"]', "John");
  await page.fill('//input[@name="lastName"]', "Doe");
  await page.fill('//input[@name="email"]', "john.doe@example.com");
  await page.fill('//input[@name="phone"]', "1234567890");
  await page.fill('//input[@name="address1"]', "123 Main St");
  await page.fill('//input[@name="city"]', "Sydney");
  await page.fill('//input[@name="postalCode"]', "2000");

  // Select State (Dropdown Example)
  await page.click('//select[@name="province"]');
  await page.selectOption('//select[@name="province"]', {
    label: "New South Wales",
  });

  // Proceed to Payment
  await page.click('//button[contains(text(), "Continue to payment")]');

  // Payment Process
  await page.click("text=Credit Card");
  await page.fill("#card-number", "4111111111111111");
  await page.fill("#expiry-date", "12/25");
  await page.fill("#cvv", "123");
  await page.click("text=Pay Now");

  // Verify Payment Success
  await expect(page.locator(".confirmation-message")).toContainText(
    "Payment Successful"
  );
});

// Test Case 2: Free Trial Registration Success
test("E2E - Free Trial Registration Success", async ({ page }) => {
  await page.goto(BASE_URL);

  // Find Free Trial Section
  await page.click("text=Start Your Free Trial");

  // Fill Registration Form
  await page.fill("#name", "Jane Doe");
  await page.fill("#email", "jane@example.com");
  await page.fill("#phone", "9876543210");

  // Accept Terms (if applicable)
  const termsCheckbox = page.locator("#accept-terms");
  if (await termsCheckbox.isVisible()) {
    await termsCheckbox.check();
  }

  // Submit Registration
  await page.click("text=Submit");

  // Verify Registration Success
  await expect(page.locator(".success-message")).toContainText(
    "Registration Successful"
  );
});
