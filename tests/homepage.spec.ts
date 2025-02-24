import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { CoursePage } from "../pages/CoursePage";
import { BASE_URL } from "../config";

test.describe("Homepage Functionality", () => {
  let homePage: HomePage;
  let coursePage: CoursePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    coursePage = new CoursePage(page);
    try {
      await homePage.navigate();
    } catch (error) {
      console.error("❌ Navigation timeout or error:", error);
      await page.screenshot({ path: "error-screenshot.png" }); // For debugging
    }
  });

  // ✅ Test 1: Verify homepage elements
  test("Verify homepage elements", async () => {
    await test.step("Check critical elements visibility", async () => {
      await expect(homePage.logo).toBeVisible();
      await expect(homePage.courseSearchInput).toBeVisible();
    });
  });

  // ✅ Test 2: Course search functionality
  test("Course search functionality", async () => {
    await test.step('Search for "Business" courses', async () => {
      await homePage.searchCourse("Business");
    });

    await test.step("Verify search results", async () => {
      await expect(coursePage.searchResults).toBeVisible();
      const count = await coursePage.getCourseCount();
      expect(count).toBeGreaterThan(0);
    });
  });

  // ✅ Test 3: Verify Footer Links

  test("Verify footer links navigate correctly", async ({ page }) => {
    const footerLinks = [
      {
        name: "Certificates",
        baseUrl: "/collections/all",
        queryParams: [
          "sort_by=best-selling",
          "filter.p.m.custom.course_qualification=Certificate+II",
          "filter.p.m.custom.course_qualification=Certificate+III",
          "filter.p.m.custom.course_qualification=Certificate+IV",
        ],
      },
      {
        name: "Diplomas",
        baseUrl: "/collections/all",
        queryParams: [
          "sort_by=best-selling",
          "filter.p.m.custom.course_qualification=Diploma",
        ],
      },
    ];

    for (const link of footerLinks) {
      await test.step(`Check footer link: ${link.name}`, async () => {
        await page.locator(`footer a:has-text("${link.name}")`).click();

        await page.waitForLoadState("domcontentloaded");
        await page.waitForTimeout(2000);

        //  Get the current URL
        const currentURL = new URL(page.url());
        console.log(
          `🔍 Debug: Expected base URL: ${link.baseUrl}, Actual: ${currentURL.pathname}`
        );

        //    Check the base URL and query parameters
        expect(currentURL.pathname).toBe(link.baseUrl);

        //  Check query parameters
        for (const param of link.queryParams) {
          expect(currentURL.search).toContain(param);
        }
      });

      //      Navigate back to the homepage
      await page.goto(BASE_URL);
    }
  });

  // ✅ Test 4: Verify Responsive Design
  test("Verify homepage responsiveness on mobile", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.setViewportSize({ width: 375, height: 812 }); // Set before navigation
    await homePage.navigate(); // Moved this here

    await test.step("Verify mobile menu is visible", async () => {
      await expect(page.locator(".hamburger")).toBeVisible();
    });

    await test.step("Open mobile menu and check links", async () => {
      await page.click("//button[@class='hamburger']");
      await expect(page.locator(".mobile-nav")).toBeVisible();
    });
  });

  // ✅ Test 5: Verify Page Load Performance
  test("Verify homepage load performance", async ({ page }) => {
    const startTime = performance.now();
    await page.goto(BASE_URL);
    await page.waitForLoadState("load");
    const loadTime = performance.now() - startTime;

    console.log(`⏳ Page load time: ${loadTime.toFixed(2)}ms`);

    expect(loadTime).toBeLessThan(3000);
  });
  // ✅ Test 6: Verify Banner and text
  test("Verify Banner and text", async ({ page }) => {
    await page.goto(BASE_URL);
    //check banner
    const banner = page.locator('xpath=//*[@id="slick-slide00"]');
    await expect(banner)
      .toBeVisible()
      .then(() => {
        console.log("Banner is visible");
      });

    //check banner text

    const bannerText = page.locator(
      'xpath=//*[@id="shopify-section-template--24248589123903__pd_new_hero_banner_8mp7Vb"]'
    );
    await expect(bannerText)
      .toBeVisible()
      .then(() => {
        console.log("Banner text is visible");
      });
  });
  // ✅ Test 7: Verify the CTA button functionality (redirection to a detailed information page).
  test("Verify the CTA button functionality", async ({ page }) => {
    await page.goto(BASE_URL);
    const ctaButton = page.locator(
      'xpath=//*[@id="shopify-section-template--24248589123903__pd_new_hero_banner_8mp7Vb"]'
    );
    await ctaButton.click();
    await page.waitForLoadState("load");
    const currentURL = new URL(page.url());
    console.log(
      `🔍 Debug: Expected base URL: ${BASE_URL}, Actual: ${currentURL}`
    );
    expect(currentURL).toBe(BASE_URL);
  });
});
