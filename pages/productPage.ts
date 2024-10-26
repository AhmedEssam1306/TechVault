import { Page } from "@playwright/test";
import * as path from "path";

export class ProductPage {
  constructor(page: Page) {
    this.page = page;
  }
  readonly page: Page;

  async editTitle(title: string) {
    await this.page.locator('input[name="title"]').fill(title);
  }

  async editDescription(desc: string) {
    await this.page.locator('input[name="description"]').fill(desc);
  }

  async editPrice(price: string) {
    await this.page.locator('input[name="price"]').fill(price);
  }

  async uploadFile(fileName: string) {
    const fileChooserPromise = this.page.waitForEvent("filechooser");
    await this.page.getByText("Upload").click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(
      path.join(`fixtures/assets/uploads/${fileName}`)
    );

    const [resp] = await Promise.all([
      this.page.waitForResponse(
        (resp) => resp.url().includes("/api/media") && resp.status() === 201
      ),
    ]);
  }

  async saveProductChanges() {
    await this.page.getByRole("button", { name: "Save Product" }).click();
  }

  async createProduct() {
    await this.page.getByRole("button", { name: "Create Product" }).click();
  }
}
