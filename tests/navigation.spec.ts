import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";

test.describe("Core Navigation", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navigate();
  });

  // ✅ Kiểm tra tất cả link trong menu desktop
  test("Verify desktop menu links redirect chính xác", async ({ page }) => {
    const menuLinks = [
      { name: "Courses", url: "pages/discover-your-career-in" },
      { name: "Study with us", url: "/pages/studying-online" },
      { name: "Open your mind", url: "/pages/discover-your-career-in" },
      { name: "About Us", url: "/pages/about-us" },
      { name: "FAQs", url: "/pages/faqs" },
    ];

    for (const link of menuLinks) {
      console.log(`🔎 Kiểm tra link: ${link.name}`);

      await page.waitForSelector(
        `//nav[contains(@class, "desktop-nav")]//a/span[text()='${link.name}']`,
        { timeout: 10000 }
      );
      await page.hover(
        `//nav[contains(@class, "desktop-nav")]//a/span[text()='${link.name}']`
      );
      await page.click(
        `//nav[contains(@class, "desktop-nav")]//a/span[text()='${link.name}']`
      );

      // Chờ URL thay đổi trước khi kiểm tra
      //await page.waitForURL(new RegExp(link.url), { timeout: 10000 });

      // Kiểm tra URL hiện tại và debug nếu cần
      const currentURL = page.url();
      console.log(`🔍 Debug: Expected ${link.url}, Actual: ${currentURL}`);
      //await page.waitForURL(`**/${link.url}`, { timeout: 10000 });
      const url = new URL(await page.url());
      console.log(
        `🔍 Debug: Expected "${link.url}", Actual: "${url.pathname}"`
      );
      await expect(url.pathname).toBe(`/${link.url}`);
    }
  });

  // ✅ Kiểm tra tất cả link trong menu mobile
  test("Verify mobile menu links redirect chính xác", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 }); // iPhone X
    await page.reload();
    await page.waitForSelector(
      '//button[@data-hamburger or contains(@class, "hamburger")]',
      { timeout: 10000 }
    );
    await page.click(
      '//button[@data-hamburger or contains(@class, "hamburger")]'
    );

    await page.waitForSelector(
      '//nav[contains(@class, "mobile-nav") and contains(@class, "displayed")]',
      { timeout: 10000 }
    );

    const mobileMenuLinks = [
      { name: "Courses", url: "/collections/all" },
      { name: "Study with us", url: "/pages/studying-online" },
      { name: "Open your mind", url: "/pages/discover-your-career-in" },
      { name: "About Us", url: "/pages/about-us" },
      { name: "FAQs", url: "/pages/faqs" },
    ];

    for (const link of mobileMenuLinks) {
      console.log(`📱 Kiểm tra link Mobile: ${link.name}`);

      await page.waitForSelector(
        `//nav[contains(@class, "mobile-nav")]//a[contains(@class, "pd-nav-link") and .//span[text()='${link.name}']]`,
        { timeout: 10000 }
      );
      await page.click(
        `//nav[contains(@class, "mobile-nav")]//a[contains(@class, "pd-nav-link") and .//span[text()='${link.name}']]`
      );

      await page.waitForURL(new RegExp(link.url), { timeout: 10000 });

      const currentURL = page.url();
      console.log(`🔍 Debug: Expected ${link.url}, Actual: ${currentURL}`);
      expect(currentURL.includes(link.url)).toBeTruthy();

      // Mở lại menu mobile để kiểm tra tiếp
      await page.waitForSelector(
        '//button[@data-hamburger or contains(@class, "hamburger")]',
        { timeout: 5000 }
      );
      await page.click(
        '//button[@data-hamburger or contains(@class, "hamburger")]'
      );
      await page.waitForSelector(
        '//nav[contains(@class, "mobile-nav") and contains(@class, "displayed")]',
        { timeout: 10000 }
      );
    }
  });
});
