import { test, expect } from "@playwright/test";
import { DashboardPage } from "../pages/dashboardPage";

test.beforeEach(async ({ page }) => {
  await page.goto("https://e-commerce-kib.netlify.app/");
});

test.describe("Product Actions", () => {
  test("User edit a specific product", async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.getProductCard();
    // dashboardPage.getProductCard();
  });
});

test("has title", async ({ page }) => {
  await page.goto("https://playwright.dev/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test("get started link", async ({ page }) => {
  await page.goto("https://playwright.dev/");

  // Click the get started link.
  await page.getByRole("link", { name: "Get started" }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(
    page.getByRole("heading", { name: "Installation" })
  ).toBeVisible();
});
