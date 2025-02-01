import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

test.describe("User Authentication", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test("Successful login with valid credentials", async () => {
    await loginPage.login("valid@user.com", "validPassword123");
    await expect(loginPage.userDashboard).toBeVisible();
  });

  test("Password reset flow", async () => {
    await loginPage.initiatePasswordReset("valid@user.com");
    await expect(loginPage.resetSuccessMessage).toContainText(
      "Check your email"
    );
  });
});
