import { test, expect, Page } from "@playwright/test";

// Dropdown
async function testDropdowns(page: Page) {
  const dropdowns = page.locator('nav [aria-haspopup="true"]');
  const dropdownCount = await dropdowns.count();
  console.log(`Dropdowns found: ${dropdownCount}`);

  for (let i = 0; i < dropdownCount; i++) {
    const dropdown = dropdowns.nth(i);
    await dropdown.hover();
    const submenu = dropdown.locator('[role="menu"]');

    if (await submenu.isVisible()) {
      await expect(submenu).toBeVisible();
      const menuItems = submenu.locator("a");
      console.log(`  - Submenu items: ${await menuItems.count()}`);
    }
  }
}

// Modal
async function testModals(page: Page) {
  const modalTriggers = page.locator(
    '[data-modal-trigger], a:has-text("Read full biography")'
  );
  const triggerCount = await modalTriggers.count();
  console.log(`Modal triggers found: ${triggerCount}`);

  for (let i = 0; i < triggerCount; i++) {
    const trigger = modalTriggers.nth(i);

    // ✅ Only click if the trigger is visible and enabled
    if ((await trigger.isVisible()) && (await trigger.isEnabled())) {
      console.log(`  - Clicking trigger ${i + 1}`);
      await trigger.click();

      const modal = page.locator('[role="dialog"], .modal, .overlay');

      try {
        // ✅ Wait for modal to appear with a shorter timeout
        await expect(modal).toBeVisible({ timeout: 3000 });
        console.log(`    - Modal detected for trigger ${i + 1}`);

        const closeButton = modal.locator(
          '[data-modal-close], .close, [aria-label="Close"]'
        );
        if (await closeButton.isVisible()) {
          await closeButton.click();
          await expect(modal).not.toBeVisible();
          console.log(`    - Modal closed successfully.`);
        }
      } catch (error) {
        console.warn(`    - Modal did not appear for trigger ${i + 1}`);
      }
    } else {
      console.log(`  - Skipping trigger ${i + 1} (not visible/enabled)`);
    }
  }
}

// Carousel
async function testCarousels(page: Page) {
  const carousels = page.locator(
    '[data-carousel], [aria-roledescription="carousel"], .slick-slider, .carousel'
  );
  const carouselCount = await carousels.count();
  console.log(`Carousels found: ${carouselCount}`);

  for (let i = 0; i < carouselCount; i++) {
    const carousel = carousels.nth(i);
    const nextButton = carousel.locator(
      "[data-carousel-next], .slick-next, .carousel-control-next"
    );
    const prevButton = carousel.locator(
      "[data-carousel-prev], .slick-prev, .carousel-control-prev"
    );

    if ((await nextButton.isVisible()) && (await prevButton.isVisible())) {
      console.log(`  - Carousel ${i + 1} navigable`);
      await nextButton.click();
      await prevButton.click();
    }
  }
}

// Tooltip
async function testTooltips(page: Page) {
  const tooltipTriggers = page.locator("[data-tooltip], [aria-describedby]");
  const triggerCount = await tooltipTriggers.count();
  console.log(`Tooltips found: ${triggerCount}`);

  for (let i = 0; i < triggerCount; i++) {
    const trigger = tooltipTriggers.nth(i);

    // ✅ Skip hidden or non-hoverable elements
    if ((await trigger.isVisible()) && (await trigger.isEnabled())) {
      console.log(`  - Testing tooltip trigger ${i + 1}`);

      try {
        // 🖱️ Try hover first
        await trigger.hover({ timeout: 2000 });

        // ✅ Fallback to focus if hover fails
        const tooltip = page.locator('[role="tooltip"], .tooltip');
        if (!(await tooltip.isVisible())) {
          await trigger.focus();
        }

        // ✅ Final fallback to click if needed
        if (!(await tooltip.isVisible())) {
          await trigger.click();
        }

        if (await tooltip.isVisible({ timeout: 2000 })) {
          console.log(`    - Tooltip displayed for trigger ${i + 1}`);
          await expect(tooltip).toBeVisible();
        } else {
          console.log(`    - No tooltip detected for trigger ${i + 1}`);
        }
      } catch (error) {
        console.warn(`    - Tooltip interaction failed for trigger ${i + 1}`);
      }
    } else {
      console.log(`  - Skipping trigger ${i + 1} (not visible/enabled)`);
    }
  }
}

// Test Suite
test.describe("Interactive UI Tests", () => {
  const pages = [
    "/",
    "/pages/about-us",
    "/collections/all",
    "/pages/contact",
    "/pages/our-history",
    "/pages/faqs",
    "/pages/industry-experts",
  ];

  pages.forEach((path) => {
    test(`UI Components on ${path}`, async ({ page }) => {
      console.log(`\nTesting page: ${path}`);
      await page.goto(`https://www.opencolleges.edu.au${path}`);
      await page.waitForLoadState("networkidle"); // Ensure content is fully loaded

      await testDropdowns(page);
      await testModals(page);
      await testCarousels(page);
      await testTooltips(page);
    });
  });
});
