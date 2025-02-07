//having bug

import { test, expect } from "@playwright/test";

// Test Case 1: Course Selection to Payment Process
test("E2E - Course Selection to Payment Process", async ({ page }) => {
  await page.goto("https://www.opencolleges.edu.au");

  // Select a Course
  await page.click("text=Courses");
  await page.click("text=Business & Leadership");
  await page.click("text=Diploma of Leadership and Management");

  // View Course Details
  await expect(page.locator("h1")).toContainText(
    "Diploma of Leadership and Management"
  );
  await page.click("text=Enroll Now");

  // Proceed to Checkout
  await page.click("text=Cart");
  await page.click("text=Checkout");

  // Fill in Personal Details
  await page.fill("#name", "John Doe");
  await page.fill("#email", "john@example.com");
  await page.fill("#phone", "1234567890");
  await page.fill("#address", "123 Main St, City, Country");

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
  await page.goto("https://www.opencolleges.edu.au");

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
