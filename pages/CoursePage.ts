import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CoursePage extends BasePage {
  readonly searchResults: Locator;
  readonly courseCards: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    super(page);
    this.searchResults = page.locator("#ProductGridContainer");
    this.courseCards = page.locator("#ProductGridContainer .grid__item");
    this.sortDropdown = page.locator("#SortBy").first();
  }

  async getCourseCount(): Promise<number> {
    return await this.courseCards.count();
  }

  async getCoursePrices(): Promise<number[]> {
    const priceElements = this.page.locator(".price-item.price-item--regular");
    const prices = await priceElements.allInnerTexts();
    return prices.map((price) =>
      parseFloat(price.replace("$", "").replace(",", "").trim())
    );
  }

  async sortBy(sortValue: string) {
    await this.sortDropdown.selectOption(sortValue);
    await this.page.waitForLoadState("domcontentloaded");
  }
}
