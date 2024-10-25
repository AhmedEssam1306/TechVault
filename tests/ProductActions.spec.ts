import { test, expect } from "@playwright/test";
import { DashboardPage } from "../pages/dashboardPage";
import { ProductPage } from "../pages/productPage";

test.beforeEach(async ({ page }) => {
  await page.goto("https://e-commerce-kib.netlify.app/");
  await page.waitForLoadState("networkidle");
});

test.describe("Product Actions", () => {
  test("User edit a specific product", async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const productPage = new ProductPage(page);
    const targetProduct = "Apple mac book pro 2025";
    const newTitle = "Apple Mac Book Pro 2024";
    const newDescription = "Macbook for all of your needs, and more.";

    await dashboardPage.productAction(targetProduct, "Edit");

    await productPage.editTitle(newTitle);
    await productPage.editDescription(newDescription);
    await productPage.editPrice("4500");
    await productPage.saveProductChanges();

    await dashboardPage.assertNewInfo(newTitle);
    await dashboardPage.assertNewInfo(newDescription);
    await dashboardPage.assertPrice(newTitle, "4500");
  });

  test("User Adds a new product", async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const productPage = new ProductPage(page);

    const newTitle = "Playstation 5";
    const newDescription =
      "Immerse yourself in games that look and sound stunning, including console exclusives from PlayStation Studios and full backwards compatibility for your PS4 library.";
    const newPrice = "500";
    const imageTitle = "PS5.jpg";

    await dashboardPage.addProduct();

    await productPage.editTitle(newTitle);
    await productPage.editDescription(newDescription);
    await productPage.editPrice(newPrice);
    await productPage.uploadFile(imageTitle);
    await productPage.createProduct();

    await dashboardPage.assertNewInfo(newTitle);
    await dashboardPage.assertNewInfo(newDescription);
    await dashboardPage.assertPrice(newTitle, newPrice);
  });
});
