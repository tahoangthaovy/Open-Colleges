import { test, expect } from "@playwright/test";
import * as fs from "fs";
import { BASE_URL } from "../config";

test("Extract all links from the page", async ({ page }) => {
  test.setTimeout(600000); // Đảm bảo timeout 10 phút

  console.log(`⏳ Test timeout: ${test.info().timeout} ms`);

  await page.goto(BASE_URL);

  // Lấy tất cả link hợp lệ
  const links = await page.$$eval("a", (anchors) =>
    anchors
      .map((a) => a.href)
      .filter(
        (href) =>
          href.startsWith("http") &&
          !href.includes("cdn.") &&
          !href.endsWith(".pdf") &&
          !href.endsWith(".css") &&
          !href.endsWith(".js") &&
          !href.includes("#")
      )
  );

  console.log(`🔍 Found ${links.length} links to test`);

  // Giới hạn số lượng link kiểm tra
  const MAX_LINKS_TO_TEST = 50;
  const linksToTest = links.slice(0, MAX_LINKS_TO_TEST);
  console.log(`🛠 Testing first ${linksToTest.length} links...`);

  // Ghi log vào file
  const logFile = "broken-links.log";
  fs.writeFileSync(logFile, "Broken Links:\n", "utf8");

  const logBrokenLink = (link, message) => {
    console.error(`❌ Broken: ${link} - ${message}`);
    fs.appendFileSync(logFile, `${link} - ${message}\n`);
  };

  // Cấu hình test
  const BATCH_SIZE = 10; // Giảm batch size để tránh quá tải
  const TIMEOUT = 2000; // Timeout mỗi request 2 giây
  let brokenLinks: string[] = [];

  // Chia nhóm và kiểm tra từng batch
  for (let i = 0; i < linksToTest.length; i += BATCH_SIZE) {
    const batch = linksToTest.slice(i, i + BATCH_SIZE);

    console.log(`🔹 Checking batch ${i / BATCH_SIZE + 1}/${Math.ceil(linksToTest.length / BATCH_SIZE)}`);

    // Chạy request song song với retry
    const results = await Promise.allSettled(
      batch.map(async (link) => {
        try {
          const response = await fetchWithRetry(page, link);
          if (response.status() >= 400) {
            logBrokenLink(link, `Status: ${response.status()}`);
          } else {
            console.log(`✅ OK: ${link}`);
          }
        } catch (error) {
          logBrokenLink(link, "FAILED TO LOAD");
        }
      })
    );
  }

  console.log(`✅ Finished checking all links.`);
  console.log("📜 Log saved in broken-links.log");
});

// Hàm retry nếu request thất bại
const fetchWithRetry = async (page, url, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await page.request.get(url, { timeout: 2000 });
      return response;
    } catch (error) {
      console.warn(`🔄 Retry ${i + 1}/${retries} for ${url}`);
      await page.waitForTimeout(1000); // Chờ 1 giây trước khi thử lại
    }
  }
  throw new Error(`🚨 Failed after ${retries} retries: ${url}`);
};
