import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class OffcanvasCartPage extends BasePage {
  readonly container: Locator;
  readonly lineItems: Locator;
  readonly totalPrice: Locator;
  readonly goToCheckoutButton: Locator;
  readonly viewCartLink: Locator;
  readonly closeButton: Locator;
  readonly addedToCartAlert: Locator;

  constructor(page: Page) {
    super(page);
    this.container = page
      .locator(".offcanvas.is-open, .offcanvas.show")
      .first();
    this.lineItems = this.container.locator(".line-item");
    this.totalPrice = this.container
      .locator(".offcanvas-summary .summary-value")
      .last();
    this.goToCheckoutButton = this.container.locator(".begin-checkout-btn");
    this.viewCartLink = this.container.getByRole("link", {
      name: /Warenkorb anzeigen/i,
    });
    this.closeButton = this.container.locator(".js-offcanvas-close");
    this.addedToCartAlert = page.locator(".alert-success");
  }

  async isOpen(): Promise<boolean> {
    await this.container
      .waitFor({ state: "visible", timeout: 3_000 })
      .catch(() => {});
    return this.container.isVisible().catch(() => false);
  }

  async assertContains(productName: string, quantity?: number): Promise<void> {
    if (await this.isOpen()) {
      const item = this.lineItems.filter({ hasText: productName }).first();
      await expect(item).toBeVisible();
      if (quantity !== undefined)
        await expect(item).toContainText(String(quantity));
      return;
    }

    await expect(this.addedToCartAlert).toBeVisible();
    await this.open("/checkout/cart");
    const item = this.page
      .locator(".line-item")
      .filter({ hasText: productName })
      .first();
    await expect(item).toBeVisible();
    if (quantity !== undefined)
      await expect(item).toContainText(String(quantity));
  }

  async proceedToCheckout(): Promise<void> {
    if (await this.isOpen()) {
      await this.goToCheckoutButton.click();
      return;
    }

    if (!this.page.url().includes("/checkout/cart")) {
      await this.open("/checkout/cart");
    }
    const button = this.page.locator(".begin-checkout-btn").first();
    if (await button.count()) {
      await button.click();
    } else {
      await this.page
        .getByRole("link", { name: /Zur Kasse/i })
        .first()
        .click();
    }
  }

  async close(): Promise<void> {
    if (await this.isOpen()) {
      await this.closeButton.click();
      await expect(this.container).toBeHidden();
    }
  }
}
