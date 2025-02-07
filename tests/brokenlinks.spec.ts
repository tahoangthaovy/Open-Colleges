//handle timeout

import {
  test,
  expect,
  request,
  Page,
  expect as expectPlaywright,
} from "@playwright/test";
import * as fs from "fs";

// test("Extract all links from the page", async ({ page }) => {
//   await page.goto("https://www.opencolleges.edu.au/");

//   // Lấy danh sách tất cả các link hợp lệ
//   const links = await page.$$eval("a", (anchors) =>
//     anchors
//       .map((a) => a.href)
//       .filter(
//         (href) =>
//           href.startsWith("http") &&
//           !href.includes("cdn.") &&
//           !href.endsWith(".pdf") &&
//           !href.endsWith(".css") &&
//           !href.endsWith(".js") &&
//           !href.includes("#")
//       )
//   );

//   console.log("🔍 Found ${links.length} valid links:");
//   console.log(links);

// Giới hạn số link kiểm tra để tránh timeout
// const MAX_LINKS_TO_TEST = 10;
// const linksToTest = links.slice(0, MAX_LINKS_TO_TEST);

// // Kiểm tra link song song với timeout 5 giây
// await Promise.all(
//   linksToTest.map(async (link) => {
//     try {
//       const response = await page.request.get(link, { timeout: 5000 });
//       if (response.status() >= 400) {
//         console.error(
//           "❌ Broken Link: ${link} - Status: ${response.status()}"
//         );
//       }
//     } catch (error) {
//       console.error("🚨 Failed to load: ${link}");
//     }
//   })
// );
// });

test("Extract all links from the page", async ({ page }) => {
  const baseUrl = "https://www.opencolleges.edu.au/";
  await page.goto(baseUrl);

  // Lấy danh sách tất cả các link hợp lệ
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

  // Tạo file log để lưu link bị lỗi
  const logFile = "broken-links.log";
  fs.writeFileSync(logFile, "Broken Links:\n", "utf8");

  // Thời gian nghỉ giữa mỗi request (giúp tránh bị chặn)
  const DELAY_BETWEEN_REQUESTS = 2000; // 2 giây

  // Duyệt từng link và kiểm tra response
  for (const [index, link] of links.entries()) {
    console.log(`🔗 Checking (${index + 1}/${links.length}): ${link}`);

    try {
      // Dùng context.request.get() để không phụ thuộc vào trang hiện tại
      const response = await page.request.get(link, { timeout: 5000 });

      if (response.status() >= 400) {
        console.error(`❌ Broken Link: ${link} - Status: ${response.status()}`);
        fs.appendFileSync(logFile, `${link} - Status: ${response.status()}\n`);
      } else {
        console.log(`✅ OK: ${link}`);
      }
    } catch (error) {
      console.error(`🚨 Failed to load: ${link}`);
      fs.appendFileSync(logFile, `${link} - FAILED TO LOAD\n`);
    }

    // Nghỉ 2 giây trước khi kiểm tra link tiếp theo để tránh bị chặn
    await page.waitForTimeout(DELAY_BETWEEN_REQUESTS);
  }

  console.log("✅ Finished checking all links. Log saved in broken-links.log");
});
