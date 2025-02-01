import { BasePage } from "./BasePage";
import { expect } from "@playwright/test";

export class LoginPage extends BasePage {
  async login(username: string, password: string) {
    await this.page.fill('//input[@id="login-username"]', username);
    await this.page.fill('//input[@id="login-password"]', password);
    await this.page.click('//button[@id="login-submit"]');
  }

  async verifyLoginError() {
    await expect(
      this.page.locator('//div[contains(@class, "error-message")]')
    ).toBeVisible();
  }
}
