import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { BASE_URL } from "../config";

test.describe("Core Navigation", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navigate();
  });

  test("Verify desktop menu links redirect", async ({ page }) => {
    const menuLinks = [
      { name: "Courses", url: "/pages/discover-your-career-in" },
      //{ name: "Study with us", url: "/pages/studying-online" },
      //{ name: "Open your mind", url: "/pages/discover-your-career-in" },
      { name: "About Us", url: "/pages/about-us" },
      { name: "FAQs", url: "/pages/faqs" },
    ];

    for (const link of menuLinks) {
      console.log(`🔎 Verify link Desktop: ${link.name}`);

      await page.hover('//nav[contains(@class, "desktop-nav")]'); // Ensure the menu is active
      await page.waitForSelector(
        `//nav[contains(@class, "desktop-nav")]//a/span[text()='${link.name}']`,
        {
          timeout: 10000,
          state: "visible",
        }
      );
      await page.click(
        `//nav[contains(@class, "desktop-nav")]//a/span[text()='${link.name}']`
      );

      const currentURL = page.url();
      console.log(`🔍 Debug: Expected ${link.url}, Actual: ${currentURL}`);
      //await page.waitForURL(`**/${link.url}`, { timeout: 10000 });
      const url = new URL(await page.url());
      console.log(
        `🔍 Debug: Expected "${link.url}", Actual: "${url.pathname}"`
      );
      await expect(url.pathname).toBe(`${link.url}`);
    }
  });

  //Issue on Mobile site

  test("Verify mobile menu links redirect", async ({ page }) => {
    const viewport = { width: 375, height: 812 }; // iPhone X
    const hamburgerSelector =
      '//button[@data-hamburger or contains(@class, "hamburger")]';
    const mobileNavSelector =
      '//nav[contains(@class, "mobile-nav") and contains(@class, "displayed")]';

    const mobileMenuLinks = [
      { name: "Courses", url: "/collections/all" },
      { name: "About Us", url: "/pages/about-us" },
      { name: "FAQs", url: "/pages/faqs" },
    ];

    await page.setViewportSize(viewport);
    await page.reload();

    const openMobileMenu = async () => {
      await page.waitForSelector(hamburgerSelector, { timeout: 10000 });
      await page.click(hamburgerSelector);
      await page.waitForSelector(mobileNavSelector, { timeout: 10000 });
    };

    const verifyLinkRedirection = async (link) => {
      console.log(`Verify link Mobile: ${link.name}`);

      await page.click(
        `//nav[contains(@class, "mobile-nav")]//a[contains(text(), "${link.name}")]`
      );
      await page.waitForURL(new RegExp(link.url), { timeout: 10000 });

      const currentURL = page.url();
      console.log(`🔍 Debug: Expected ${link.url}, Actual: ${currentURL}`);
      expect(currentURL.includes(link.url)).toBeTruthy();
    };

    for (const link of mobileMenuLinks) {
      await openMobileMenu();
      await verifyLinkRedirection(link);
    }
  });
});
