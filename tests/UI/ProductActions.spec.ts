import { test } from "@playwright/test";
import { DashboardPage } from "../../pages/dashboardPage";
import { ProductPage } from "../../pages/productPage";
import { CommonClass } from "../../classes/commonClass";

test.beforeEach(async ({ page }) => {
  await page.goto("https://e-commerce-kib.netlify.app/");
  await page.waitForLoadState("networkidle");
});

test.describe("Product Actions", () => {
  test("User edit a specific product", async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const productPage = new ProductPage(page);
    const commonClass = new CommonClass(page);

    const targetProduct = await dashboardPage.getNthProduct(0);
    const newTitle = `Apple Mac Book Pro 20${[
      Math.floor(Math.random() * 90) + 10,
    ]}`;
    const newDescription =
      "Macbook for all of your needs, and more. Get it now and be ahead!";

    await dashboardPage.productAction(targetProduct, "Edit");

    await productPage.editTitle(newTitle);
    await productPage.editDescription(newDescription);
    await productPage.editPrice("4500");
    await productPage.saveProductChanges();

    await dashboardPage.assertNewInfo(newTitle);
    await dashboardPage.assertNewInfo(newDescription);
    await dashboardPage.assertPrice(newTitle, "4500");

    await commonClass.takeScreenshot();
  });

  test("User Adds a new product", async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const productPage = new ProductPage(page);
    const commonClass = new CommonClass(page);
    const twoDigit = [Math.floor(Math.random() * 90) + 10];

    const newTitle = `Iphone 20${twoDigit}`;
    const newDescription = `Immerse yourself in games that look and sound stunning ${twoDigit}}`;
    const newPrice = `${[Math.floor(Math.random() * 700) + 250]}`;
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

    await commonClass.takeScreenshot();
  });

  test("Search for specific Product", async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const commonClass = new CommonClass(page);
    const targetProduct = "Apple Mac Book Pro 2024";

    await dashboardPage.searchForProduct(targetProduct, false);
    await commonClass.takeScreenshot();
  });

  test("Verify more than product from Search", async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const commonClass = new CommonClass(page);
    const targetProduct = "Iphone";

    await dashboardPage.searchForProduct(targetProduct, true);
    await commonClass.takeScreenshot();
  });
});
