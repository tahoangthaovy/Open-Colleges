import { Page } from "@playwright/test";
import { BASE_URL } from "../config";

export class BasePage {
  protected page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async navigate(path: string = "") {
    await this.page.goto(`${BASE_URL}${path}`);
  }
}
