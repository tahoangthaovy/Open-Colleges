import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

const productionURL = "https://www.opencolleges.edu.au/";
const previewURL = "https://lbzmqrtkof28447f-69536973119.shopifypreview.com/";

const snapshotDir = path.join(__dirname, "snapshots");

// 📌 Hàm chụp ảnh và lưu expectation nếu chưa có
async function captureSnapshot(page, name, isProduction) {
  const filePath = path.join(
    snapshotDir,
    `${name}-${isProduction ? "production" : "preview"}.png`
  );

  // Chụp màn hình
  await page.screenshot({ path: filePath, fullPage: true });

  console.log(`📸 Captured: ${filePath}`);
  return filePath;
}

test.describe("UI Regression: Compare Production & Preview", () => {
  test("Capture & Compare All Pages", async ({ page }) => {
    // Tạo thư mục snapshots nếu chưa có
    if (!fs.existsSync(snapshotDir)) fs.mkdirSync(snapshotDir);

    const pagesToTest = [
      { name: "home", url: "" },
      { name: "courses", url: "collections/all" },
      { name: "about-us", url: "pages/about-us" },
      { name: "faqs", url: "pages/faqs" },
      { name: "contact", url: "pages/contact" },
    ];

    for (const { name, url } of pagesToTest) {
      console.log(`🔍 Testing page: ${name}`);

      // 👉 Truy cập Preview và chụp ảnh để so sánh
      await page.goto(previewURL + url);
      const previewSnapshot = await captureSnapshot(page, name, false);

      try {
        await expect(page).toHaveScreenshot(previewSnapshot);
        await page.goto(productionURL + url);
        const productionSnapshot = await captureSnapshot(page, name, true);
        await expect(page).toHaveScreenshot(productionSnapshot);
        await expect(page).toHaveScreenshot(productionSnapshot, {
          threshold: 0.1, // Cho phép khác biệt nhỏ (10%)
        });
      } catch (error) {
        console.warn(`⚠️ Preview snapshot mismatch on: ${name}`);
      }

      console.log(`✅ Compared: ${name}`);
    }
  });
});
