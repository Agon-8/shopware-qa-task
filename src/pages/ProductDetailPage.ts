import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProductDetailPage extends BasePage {
  readonly title: Locator;
  readonly price: Locator;
  readonly quantitySelect: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator(".product-detail-name");
    this.price = page.locator(".product-detail-price").first();
    this.quantitySelect = page.locator("select.product-detail-quantity-select");
    this.quantityInput = page
      .locator('.quantity-selector-group-input, input[name$="[quantity]"]')
      .first();
    this.addToCartButton = page.locator(".product-detail-buy button.btn-buy");
  }

  async goto(path: string): Promise<void> {
    await this.open(path);
  }

  async assertLoaded(expectedName: string): Promise<void> {
    await expect(this.title).toHaveText(new RegExp(expectedName, "i"));
    await expect(this.addToCartButton).toBeEnabled();
  }

  
  async setQuantity(quantity: number): Promise<void> {
    if (await this.quantitySelect.count()) {
      await this.quantitySelect.selectOption(String(quantity));
      return;
    }
    await this.quantityInput.fill(String(quantity));
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }
}
