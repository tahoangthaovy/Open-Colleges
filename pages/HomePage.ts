import { Page, Locator } from "@playwright/test";

export class HomePage {
  private readonly page: Page;

  // Locators
  readonly logo: Locator;
  readonly courseSearchInput: Locator;
  readonly acceptCookiesBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.locator(
      '//*[@id="shopify-section-sections--24248581325119__header"]/div/div/h1/a/div/img'
    );
    this.courseSearchInput = page.locator(
      '//*[@id="hero-banner-search-input"]'
    );
    this.acceptCookiesBtn = page.locator('button:has-text("Accept")');
  }

  async navigate() {
    await this.page.goto("https://www.opencolleges.edu.au/");
    await this.handleCookies();
    await this.page.waitForLoadState("networkidle");
  }

  private async handleCookies() {
    if (await this.acceptCookiesBtn.isVisible()) {
      await this.acceptCookiesBtn.click();
    }
  }

  async searchCourse(keyword: string) {
    await this.courseSearchInput.fill(keyword);
    await this.page.keyboard.press("Enter");

    // Chờ trang hiển thị tiêu đề "Search results for"
    await this.page.waitForSelector(
      '//h1[contains(text(), "Search results for")]',
      { timeout: 10000 }
    );

    // Chờ danh sách khóa học xuất hiện
    await this.page.waitForSelector('//*[@id="ProductGridContainer"]', {
      timeout: 10000,
    });

    // Kiểm tra số lượng kết quả tìm thấy
    const count = await this.page
      .locator('//*[@id="ProductGridContainer"]')
      .count();
    if (count === 0) {
      throw new Error("Không tìm thấy khóa học nào.");
    }
  }
}
