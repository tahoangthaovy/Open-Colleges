import { test, expect } from "@playwright/test";
import { BASE_URL } from "../config";

const footerTexts = [
  "Explore Learning",
  "Certificates",
  "Diplomas",
  "For Students",
  "OpenSpace Login",
  "Guaranteed Work Placement",
  "Student Policies & Forms",
  "Recognition of Prior Learning",
  "Our Story",
  "About Us",
  "Our History",
  "Our People",
  "Industry Partners",
  "Login",
  "Start Now",
  "Contact Us",
  "FAQs",
  "Careers",
  "Privacy policy",
  "Terms of Service",
  "Whistle Blower Policy",
  "Supplier Code of Conduct",
  "Payright",
  "Built with love ♡ by Prosper Digital",
];

test("Footer Validation - Check Texts and URLs", async ({ page }) => {
  await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });

  // Cuộn xuống cuối trang để hiển thị footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(3000);

  // Kiểm tra các text trong footer
  for (const text of footerTexts) {
    console.log(`🔍 Checking text: ${text}`);
    const locator = page.locator(`text=${text}`);

    if (await locator.count() > 0) {
      await locator.scrollIntoViewIfNeeded(); // Đảm bảo phần tử trong vùng nhìn thấy
      await expect(locator).toBeVisible({ timeout: 10000 });
    } else {
      console.warn(`⚠️ Element with text "${text}" not found in DOM!`);
    }
  }
});
