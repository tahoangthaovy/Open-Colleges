import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import { BASE_URL } from "../config";

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigate() {
    await super.navigate();
  }

  async clickLogin() {
    await this.page.click("text=Login");
  }

  async login(username: string, password: string) {
    await this.page.fill('input[name="username"]', username);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('button:has-text("Sign In")');
  }

  async forgotPassword(email: string) {
    await this.page.click("text=Forgot Your Password?");
    await this.page.fill('input[type="email"]', email);
    await this.page.click('button:has-text("Reset Password")');
  }

  async getErrorMessage(): Promise<Locator> {
    return this.page.locator('[role="tooltip"], .error-tooltip, .tooltip');
  }

  async isLoggedIn() {
    return this.page.isVisible("text=Dashboard");
  }
}
