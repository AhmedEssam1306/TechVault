import { Page, expect } from "@playwright/test";

export class DashboardPage {
  constructor(page: Page) {
    this.page = page;
  }
  readonly page: Page;

  async productAction(targetProduct: string, action: string) {
    const productLocator = this.page
      .getByText(targetProduct, { exact: true })
      .locator("..")
      .locator(".card-actions")
      .locator("button");

    if (action == "Edit") {
      await productLocator.nth(0).click();
      await expect(
        this.page.getByRole("button", { name: "Save Product" })
      ).toBeEnabled();
    } else {
      await productLocator.nth(1).click();
      await this.page.locator(".grid").waitFor({ state: "visible" });
    }
  }

  async addProduct() {
    await this.page.locator('a[href="/add"]').click();
  }

  async searchForProduct(targetProduct: string, isMultiple: boolean) {
    const encodedProductName = encodeURIComponent(targetProduct);

    await this.page.getByPlaceholder("Search for products").fill(targetProduct);
    const [resp] = await Promise.all([
      this.page.waitForResponse(
        (resp) =>
          resp.url().includes(`/api/products?skip=0&q=${encodedProductName}`) &&
          resp.status() === 200
      ),
    ]);
    await this.assertSearchResults(targetProduct, isMultiple);
  }

  async assertSearchResults(targetProduct: string, isMultiple: boolean) {
    if (isMultiple) {
      const allProducts = this.page.locator(".grid > *");
      const elementCount = await allProducts.count();
      expect(elementCount).toBeGreaterThan(1);
    } else {
      await expect(
        this.page.getByText(targetProduct, { exact: true })
      ).toBeVisible();
    }
  }

  async assertNewInfo(info: string) {
    const productLocator = this.page.getByText(info, { exact: true });
    await expect(productLocator).toBeVisible();
  }

  async assertPrice(targetProduct: string, price: string) {
    const productLocator = this.page
      .getByText(targetProduct, { exact: true })
      .locator("..")
      .locator(".card-price");

    expect(productLocator).toHaveText(price + " USD");
  }

  async getNthProduct(index: number) {
    const product = this.page.locator(".grid > div").nth(index);
    const text = await product.locator(".sc-kpDqfm").innerHTML();
    return text;
  }

  async deleteProduct(targetProduct: string) {}
}
