import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CategoryPage extends BasePage {
  readonly productCards: Locator;
  readonly heading: Locator;

  constructor(page: Page) {
    super(page);
    this.productCards = page.locator('.product-box');
    this.heading = page.locator('.cms-element-product-listing-wrapper, .breadcrumb');
  }

  async goto(path: string): Promise<void> {
    await this.open(path);
  }

  productCard(name: string): Locator {
    return this.productCards.filter({ hasText: name }).first();
  }

  async assertProductVisible(name: string): Promise<void> {
    await expect(this.productCard(name)).toBeVisible();
  }

  async openProduct(name: string): Promise<void> {
    await this.productCard(name).getByRole('link', { name }).first().click();
  }

  async addToCartFromListing(name: string): Promise<void> {
    await this.productCard(name).locator('button.btn-buy').click();
  }
}
