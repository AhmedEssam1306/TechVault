import { Page, test } from "@playwright/test";

export class CommonClass {
  constructor(page: Page) {
    this.page = page;
  }

  readonly page: Page;

  async generateRandomLetters(length: number) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
    return result;
  }

  async attachApiResponse(response: any) {
    test.info().attach("API Response Body", {
      body: JSON.stringify(response, null, 2),
      contentType: "application/json",
    });
  }

  async attachScreenshot(screenshot: any) {
    test.info().attach("Screenshot", {
      body: screenshot,
      contentType: "image/png",
    });
  }

  async takeScreenshot() {
    const screenshot = await this.page.screenshot();
    await this.attachScreenshot(screenshot);
  }
}
