import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

test.describe("Authentication Tests", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.clickLogin();
  });

  test("Login with invalid username format", async ({ page }) => {
    await loginPage.login("invalidUsername", "dummyPassword");

    const errorMessage = page.getByText(
      "The Email field must contain a valid email address."
    );
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
    await expect(await errorMessage.textContent()).toContain(
      "The Email field must contain a valid email address."
    );
  });

  test("Login with blank username or password", async ({ page }) => {
    await loginPage.login("", ""); // Both fields blank

    // Validate error message for username
    const usernameError = page.getByText("This field is required.").first();
    await expect(usernameError).toBeVisible();
    await expect(await usernameError.textContent()).toContain(
      "This field is required."
    );

    // Validate error message for password
    const passwordError = page.getByText("This field is required.").nth(1);
    await expect(passwordError).toBeVisible();
    await expect(await passwordError.textContent()).toContain(
      "This field is required."
    );
  });

  test("Login with valid credentials", async ({ page }) => {
    await loginPage.login("validuser@example.com", "ValidPassword123");

    const errorMessage = page.getByText("Bad credentials.");
    await expect(errorMessage).toBeVisible(); // Handle delay in error message display
    await expect(await errorMessage.textContent()).toContain(
      "Bad credentials."
    );
  });

  //be careful: it sent an email to the user on the live theme
  test("Forgot password with valid email", async ({ page }) => {
    await loginPage.forgotPassword("validuser@example.com");

    const errorMessage = page.getByText("Uh-oh. Forgotten your password?");
    await expect(errorMessage).toBeVisible();
    await expect(await errorMessage.textContent()).toContain(
      "Uh-oh. Forgotten your password?"
    );
  });
});
