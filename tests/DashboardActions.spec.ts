import { test, expect } from "@playwright/test";
import { createWorker } from "tesseract.js";
import sharp from "sharp";

test.beforeEach(async ({ page }) => {
  await page.goto("https://flutter-angular.web.app/");
  await page.waitForLoadState("networkidle");
});

test.describe("Incrementation of the number", () => {
  test("User clicks on + sign and assert the count incrementation", async ({
    page,
  }) => {
    const element = page.locator("canvas");
    const box = (await element.boundingBox())!;
    await page.mouse.click(box.x + 280 / 1, box.y + box.height - 50);

    await page.locator("canvas").screenshot({
      path: "counter.png",
    });

    await sharp("counter.png")
      .resize(800) // Resize to a consistent size (optional)
      .grayscale() // Convert to grayscale
      .normalize() // Normalize contrast
      .toFile("processed-image.png");

    const worker = await createWorker("eng");
    await worker.setParameters({
      tessedit_char_whitelist: "0123456789", // Try different page segmentation modes (0-13)
      user_defined_dpi: "300",
    });

    const {
      data: { text },
    } = await worker.recognize("processed-image.png");
    console.log("Recognized Numbers:", text);
    await worker.terminate();
  });
});
