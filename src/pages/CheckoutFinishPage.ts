import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutFinishPage extends BasePage {
  readonly header: Locator;
  readonly orderNumber: Locator;
  readonly paymentMethodSummary: Locator;

  constructor(page: Page) {
    super(page);
    this.header = page.locator('.finish-header');
    this.orderNumber = page.locator('.finish-ordernumber');
    this.paymentMethodSummary = page.locator('.finish-order-details, .checkout-aside-summary').first();
  }

  async assertOrderPlaced(): Promise<void> {
    await this.expectUrlContains('/checkout/finish');
    await expect(this.header).toBeVisible();
    await expect(this.orderNumber).toBeVisible();
  }

  async getOrderNumber(): Promise<string> {
    const raw = await this.orderNumber.innerText();
    const match = raw.match(/(\d{3,})/);
    expect(match, `No order number found in "${raw}"`).not.toBeNull();
    return match![1];
  }
}
