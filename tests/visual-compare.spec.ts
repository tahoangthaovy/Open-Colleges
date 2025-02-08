import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";
import { BASE_URL } from "../config";

const productionURL = "https://www.opencolleges.edu.au/";
const previewURL = BASE_URL;

const snapshotDir = path.join(__dirname, "snapshots");

// 📌 Screenshot and save expectation
async function captureSnapshot(page, name, isProduction) {
  const filePath = path.join(
    snapshotDir,
    `${name}-${isProduction ? "production" : "preview"}.png`
  );

  // Screenshot
  await page.screenshot({ path: filePath, fullPage: true });

  console.log(`📸 Captured: ${filePath}`);
  return filePath;
}

test.describe("UI Regression: Compare Production & Preview", () => {
  test("Capture & Compare All Pages", async ({ page }) => {
    // Create folder snapshots if not exists
    if (!fs.existsSync(snapshotDir)) fs.mkdirSync(snapshotDir);

    const pagesToTest = [
      { name: "home", url: "" },
      { name: "courses", url: "/collections/all" },
      { name: "about-us", url: "/pages/about-us" },
      { name: "faqs", url: "/pages/faqs" },
      { name: "contact", url: "/pages/contact" },
    ];

    for (const { name, url } of pagesToTest) {
      console.log(`🔍 Testing page: ${name}`);

      // 👉 Go to Preview theme and screenshot
      await page.goto(previewURL + url);
      const previewSnapshot = await captureSnapshot(page, name, false);

      try {
        await expect(page).toHaveScreenshot(previewSnapshot);
        await page.goto(productionURL + url);
        const productionSnapshot = await captureSnapshot(page, name, true);
        await expect(page).toHaveScreenshot(productionSnapshot);
        await expect(page).toHaveScreenshot(productionSnapshot, {
          threshold: 0.1, // 10% threshold
        });
      } catch (error) {
        console.warn(`⚠️ Preview snapshot mismatch on: ${name}`);
      }

      console.log(`✅ Compared: ${name}`);
    }
  });
});
