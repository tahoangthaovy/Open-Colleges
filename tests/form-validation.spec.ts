//CAPTCHA needs to handle

import { test, expect } from "@playwright/test";

test.describe("Form Validation", () => {
  test("Submit form thiếu required fields", async ({ page }) => {
    await page.goto("/pages/contact");
    await page.click('button[type="submit"]');

    // Kiểm tra nếu có bất kỳ input nào không hợp lệ
    const invalidInputs = await page.evaluate(() => {
      return document.querySelectorAll("input:invalid, textarea:invalid")
        .length;
    });
    expect(invalidInputs).toBeGreaterThan(0);
  });

  test("Submit form thành công", async ({ page }) => {
    await page.goto("/pages/contact");

    // Điền form với XPath chính xác
    await page.fill('//*[@id="ContactForm-first_name"]', "John");
    await page.fill('//*[@id="ContactForm-last_name"]', "Doe");
    await page.fill('//*[@id="ContactForm-phone"]', "0400000000");
    await page.fill('//*[@id="ContactForm-email"]', "john.doe@example.com");
    await page.selectOption('//*[@id="ContactForm-select"]', "Now");
    await page.fill('//*[@id="ContactForm-body"]', "This is a test message.");

    // Nhấn nút gửi form
    await page.click('//button[contains(text(), "Send Enquiry")]');

    // Chờ CAPTCHA xuất hiện
    const captcha = page.locator('//div[contains(@class, "h-captcha")]');
    if (await captcha.isVisible({ timeout: 5000 })) {
      console.log("⚠️ CAPTCHA detected! Please solve it manually.");
      await page.waitForTimeout(30000); // Cho phép nhập CAPTCHA thủ công
    }

    // Kiểm tra thông báo gửi thành công sau CAPTCHA
    await expect(
      page.locator('//div[contains(@class, "success-message")]')
    ).toBeVisible({ timeout: 10000 });
  });
});
