import { Page, expect } from "@playwright/test";

export class DashboardPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async getProductCard() {
    await this.page
      .getByPlaceholder("Search for products")
      .fill("dfdfefbhjebfhebjnf");
  }
}
