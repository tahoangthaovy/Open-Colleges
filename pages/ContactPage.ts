import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import { BASE_URL } from "../config";

export class ContactPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly emailError: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator("#firstName");
    this.emailError = page.locator("#email-error");
    this.successMessage = page.locator(".success-message");
  }

  async navigate() {
    await super.navigate("/pages/contact");
  }

  async fillForm(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;
  }) {
    await this.firstNameInput.fill(data.firstName);
    await this.page.fill("#lastName", data.lastName);
    await this.page.fill("#email", data.email);
    await this.page.fill("#phone", data.phone);
    await this.page.fill("#message", data.message);
  }

  async submitForm() {
    await this.page.click('button[type="submit"]');
    await this.page.waitForTimeout(2000); // Wait for form processing
  }
}
