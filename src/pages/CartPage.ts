import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly lineItems: Locator;
  readonly emptyCartMessage: Locator;
  readonly totalPrice: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.lineItems = page.locator('.line-item');
    this.emptyCartMessage = page.locator('.cart-empty, .alert-info');
    this.totalPrice = page.locator('.checkout-aside-summary-total').first();
    this.checkoutButton = page.locator('.begin-checkout-btn').first();
  }

  async goto(): Promise<void> {
    await this.open('/checkout/cart');
  }

  async setQuantity(productName: string, quantity: number): Promise<void> {
    const item = this.lineItems.filter({ hasText: productName }).first();
    const select = item.locator('select.quantity-select');
    if (await select.count()) {
      await select.selectOption(String(quantity));
    } else {
      await item.locator('input[name$="[quantity]"]').fill(String(quantity));
      await item.locator('button[type="submit"]').first().click();
    }
  }

  async removeItem(productName: string): Promise<void> {
    await this.lineItems
      .filter({ hasText: productName })
      .first()
      .locator('.line-item-remove-button')
      .click();
  }

  async assertEmpty(): Promise<void> {
    await expect(this.lineItems).toHaveCount(0);
    await expect(this.emptyCartMessage).toBeVisible();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
