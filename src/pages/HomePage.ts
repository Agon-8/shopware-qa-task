import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly mainNavigation: Locator;
  readonly logo: Locator;

  constructor(page: Page) {
    super(page);
    this.mainNavigation = page.locator('#main-navigation-menu');
    this.logo = page.locator('.header-logo-main');
  }

  async goto(): Promise<void> {
    await this.open('/');
  }

  async assertLoaded(): Promise<void> {
    await expect(this.logo).toBeVisible();
    await expect(this.mainNavigation).toBeVisible();
  }

  async openCategory(name: string): Promise<void> {
    await this.mainNavigation.getByRole('link', { name, exact: true }).first().click();
  }
}
