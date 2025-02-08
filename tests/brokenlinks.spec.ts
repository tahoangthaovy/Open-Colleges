//handle timeout

import { test, expect } from "@playwright/test";
import * as fs from "fs";
import { BASE_URL } from "../config";

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
  await page.goto(BASE_URL);

  // Get full valid URLs from the page
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

  // Create a log file to save broken links
  const logFile = "broken-links.log";
  fs.writeFileSync(logFile, "Broken Links:\n", "utf8");

  // Delay between requests to avoid being blocked
  const DELAY_BETWEEN_REQUESTS = 2000; // 2 giây

  // Test each link
  for (const [index, link] of links.entries()) {
    console.log(`🔗 Checking (${index + 1}/${links.length}): ${link}`);

    try {
      // Test each link with a 5-second timeout
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

    // Delay between requests to avoid being blocked
    await page.waitForTimeout(DELAY_BETWEEN_REQUESTS);
  }

  console.log("✅ Finished checking all links. Log saved in broken-links.log");
});
