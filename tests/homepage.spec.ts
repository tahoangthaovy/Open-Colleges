import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { CoursePage } from "../pages/CoursePage";

test.describe("Homepage Functionality", () => {
  let homePage: HomePage;
  let coursePage: CoursePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    coursePage = new CoursePage(page);
    await homePage.navigate();
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

        // Chờ trang tải xong
        await page.waitForLoadState("domcontentloaded");
        await page.waitForTimeout(2000);

        // Lấy URL hiện tại & phân tích nó
        const currentURL = new URL(page.url());
        console.log(
          `🔍 Debug: Expected base URL: ${link.baseUrl}, Actual: ${currentURL.pathname}`
        );

        // Kiểm tra base URL
        expect(currentURL.pathname).toBe(link.baseUrl);

        // Kiểm tra từng query parameter có trong URL
        for (const param of link.queryParams) {
          expect(currentURL.search).toContain(param);
        }
      });

      // Quay lại trang chủ để kiểm tra link tiếp theo
      await page.goto("https://www.opencolleges.edu.au/");
    }
  });

  // ✅ Test 4: Verify Responsive Design
  test("Verify homepage responsiveness on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 }); // iPhone X
    await page.reload();

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
    await page.goto("https://www.opencolleges.edu.au/");
    await page.waitForLoadState("load"); // Chờ tải xong
    const loadTime = performance.now() - startTime;

    console.log(`⏳ Page load time: ${loadTime.toFixed(2)}ms`);

    // Kiểm tra nếu load time < 3 giây
    expect(loadTime).toBeLessThan(3000);
  });
});
