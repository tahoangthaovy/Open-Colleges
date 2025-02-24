//having bug

import { test, expect } from "@playwright/test";
import { BASE_URL } from "../config";

// Test Case 1: Course Selection to Payment Process
test("E2E - Course Selection to Payment Process", async ({ page }) => {
  await page.goto(BASE_URL);

  // Select a Course
  await page.click("text=Courses");
  await page.click("text=Business & Leadership");
  const corurses = await page.locator(
    'xpath=//*[@id="StandardCardNoMediaLink-template--24248588828991__product-grid-8414893048127"]'
  );
  await corurses.click();
  // View Course Details
  await expect(page.locator("h1")).toContainText(
    "Diploma of Leadership and Management"
  );
  await page.click(
    '//*[@id="ProductSubmitButton-template--24248591122751__main"]'
  );

  //Proceed to Checkout
  await page.click(
    '//*[@id="variant-radios-template--24248591122751__main"]/fieldset/ul/li[3]/label/span'
  );
  await page.click('//*[@id="cart"]/input');
  //expect the page to navigate to the checkout page
  expect(page.url()).toBe(
    "https://prearer6pe3pis1l-69536973119.shopifypreview.com/cart"
  );
});
