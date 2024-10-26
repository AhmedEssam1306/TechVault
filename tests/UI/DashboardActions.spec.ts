import { test, expect } from "@playwright/test";
import { createWorker } from "tesseract.js";
import { DashboardPage } from "../../pages/dashboardPage";
import { ProductPage } from "../../pages/productPage";
import sharp from "sharp";
import { CommonClass } from "../../classes/commonClass";

test.beforeEach(async ({ page }) => {
  await page.goto("https://e-commerce-kib.netlify.app/");
  await page.waitForLoadState("networkidle");
});

test.describe("Incrementation of the number", () => {
  test("User clicks on + sign and assert the count incrementation", async ({
    page,
  }) => {
    await page.goto("https://flutter-angular.web.app/");
    await page.waitForLoadState("networkidle");
    const element = page.locator("canvas");
    const box = (await element.boundingBox())!;
    await page.mouse.click(box.x + 280 / 1, box.y + box.height - 50);

    await page.locator("canvas").screenshot({
      path: "counter.png",
    });

    await sharp("counter.png")
      .resize(800)
      .grayscale()
      .normalize()
      .toFile("processed-image.png");

    const worker = await createWorker("eng");
    await worker.setParameters({
      tessedit_char_whitelist: "0123456789",
      user_defined_dpi: "300",
    });

    const {
      data: { text },
    } = await worker.recognize("processed-image.png");
    console.log("Recognized Numbers:", text);
    await worker.terminate();
  });
});

test.describe("Dashboard Actions", () => {
  test("Delete and verify a product", async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const productPage = new ProductPage(page);
    const commonClass = new CommonClass(page);

    const newTitle = "New Product";
    const newDescription =
      "New Description for the new product to show the users info about it.";
    const newPrice = "250";
    const imageTitle = "PS5.jpg";

    await dashboardPage.addProduct();

    await productPage.editTitle(newTitle);
    await productPage.editDescription(newDescription);
    await productPage.editPrice(newPrice);
    await productPage.uploadFile(imageTitle);
    await productPage.createProduct();

    await dashboardPage.productAction(newTitle, "Delete");
    await expect(page.getByText(newTitle)).not.toBeVisible();

    await commonClass.takeScreenshot();
  });

  test("User", async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.getNthProduct(1);
  });
});
