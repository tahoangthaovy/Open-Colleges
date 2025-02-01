import { Page, Locator } from "@playwright/test";

export class ContactPage {
  private readonly page: Page;

  // Locators
  readonly firstNameInput: Locator;
  readonly emailError: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator("#firstName");
    this.emailError = page.locator("#email-error");
    this.successMessage = page.locator(".success-message");
  }

  async navigate() {
    await this.page.goto("https://www.opencolleges.edu.au/pages/contact");
    //await this.page.waitForLoadState("networkidle");
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
