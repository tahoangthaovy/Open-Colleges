import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
  readonly logo: Locator;
  readonly courseSearchInput: Locator;
  readonly acceptCookiesBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.logo = page.locator("//img[contains(@class, 'header__heading-logo')]");

    this.courseSearchInput = page.locator(
      '//*[@id="hero-banner-search-input"]'
    );
    this.acceptCookiesBtn = page.locator('button:has-text("Accept")');
  }

  async navigate() {
    await super.navigate();
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

    // Wait for search results page to load
    await this.page.waitForSelector(
      '//h1[contains(text(), "Search results for")]',
      { timeout: 10000 }
    );

    // Wait for the search results to load
    await this.page.waitForSelector('//*[@id="ProductGridContainer"]', {
      timeout: 10000,
    });

    // Check if any courses were found
    const count = await this.page
      .locator('//*[@id="ProductGridContainer"]')
      .count();
    if (count === 0) {
      throw new Error("Cannot find any courses with the given keyword");
    }
  }
}
