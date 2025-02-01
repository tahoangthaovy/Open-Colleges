import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { CoursePage } from "../pages/CoursePage";

test.describe("Course Search and Sort", () => {
  let homePage: HomePage;
  let coursePage: CoursePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    coursePage = new CoursePage(page);
    await homePage.navigate();
  });

  test("Search for 'Management' and verify sorting functionality", async ({
    page,
  }) => {
    await test.step("Perform search for 'Management'", async () => {
      await homePage.searchCourse("Management");

      // Chờ kết quả tìm kiếm hiển thị
      await page.waitForSelector("#ProductGridContainer", { timeout: 10000 });

      // Kiểm tra ít nhất có 1 kết quả
      await page.waitForTimeout(3000);
      const courseCount = await coursePage.getCourseCount();
      console.log(`🔍 Debug: Found ${courseCount} courses for "Management"`);
      expect(courseCount).toBeGreaterThan(0);
    });

    await test.step("Verify sorting dropdown is available", async () => {
      const sortDropdown = page.locator("//*[@id='SortBy']").first();
      await expect(sortDropdown).toBeVisible(); // Kiểm tra dropdown hiển thị
      await sortDropdown.selectOption({ label: "Price, low to high" }); // Chọn "Price, low to high"
    });

    await test.step("Sort by 'Price: Low to High' and verify sorting applied", async () => {
      await coursePage.sortBy("Price, low to high");
      await page.waitForTimeout(3000); // Chờ sorting áp dụng

      // Kiểm tra URL có cập nhật đúng không
      const currentURL = page.url();
      console.log(`🔍 Debug: Current URL after sorting: ${currentURL}`);
      expect(currentURL).toContain("sort_by=price-ascending");

      // Kiểm tra danh sách khóa học có sắp xếp đúng không
      const coursePrices = await coursePage.getCoursePrices();
      const sortedPrices = [...coursePrices].sort((a, b) => a - b);
      expect(coursePrices).toEqual(sortedPrices);
      console.log("✅ Courses sorted successfully by 'Price: Low to High'");
    });

    await test.step("Sort by 'Price: High to Low' and verify sorting applied", async () => {
      await coursePage.sortBy("price-descending");
      await page.waitForTimeout(3000);

      // Kiểm tra URL cập nhật đúng Sort By không
      const currentURL = page.url();
      console.log(`🔍 Debug: Current URL after sorting: ${currentURL}`);
      expect(currentURL).toContain("sort_by=price-descending");

      // Kiểm tra danh sách khóa học có sắp xếp đúng không
      const coursePrices = await coursePage.getCoursePrices();
      const sortedPrices = [...coursePrices].sort((a, b) => b - a);
      expect(coursePrices).toEqual(sortedPrices);
      console.log("✅ Courses sorted successfully by 'Price: High to Low'");
    });
  });
});
