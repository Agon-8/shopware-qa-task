import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CheckoutConfirmPage extends BasePage {
  readonly paymentMethods: Locator;
  readonly showMorePaymentMethods: Locator;
  readonly termsCheckbox: Locator;
  readonly submitOrderButton: Locator;
  readonly lineItems: Locator;
  readonly grandTotal: Locator;

  constructor(page: Page) {
    super(page);
    this.paymentMethods = page.locator(".payment-methods");
    this.showMorePaymentMethods = page.locator(
      ".payment-methods .collapse-payment-methods-btn, #collapsePaymentMethodsToggle",
    );
    this.termsCheckbox = page.locator("#tos");
    this.submitOrderButton = page.locator("#confirmFormSubmit");
    this.lineItems = page.locator(".checkout-item, .line-item");
    this.grandTotal = page.locator(".checkout-aside-summary-total").first();
  }

  async goto(): Promise<void> {
    await this.open("/checkout/confirm");
  }

  async assertLoaded(): Promise<void> {
    await this.expectUrlContains("/checkout/confirm");
    await expect(this.submitOrderButton).toBeVisible();
  }

  async assertContainsProduct(name: string): Promise<void> {
    await expect(
      this.lineItems.filter({ hasText: name }).first(),
    ).toBeVisible();
  }

  async selectPaymentMethod(label: string): Promise<void> {
    if (await this.showMorePaymentMethods.isVisible().catch(() => false)) {
      await this.showMorePaymentMethods.click();
    }

    const radios = this.page.locator(
      'input[type="radio"][name="paymentMethodId"]',
    );
    await radios.first().waitFor({ state: "attached" });

    const count = await radios.count();
    const available: string[] = [];

    for (let i = 0; i < count; i++) {
      const radio = radios.nth(i);
      const id = await radio.getAttribute("id");
      const text = id
        ? await this.page
            .locator(`label[for="${id}"]`)
            .innerText()
            .catch(() => "")
        : "";
      available.push(text.trim());

      if (new RegExp(label, "i").test(text)) {
        if (id) {
          await this.page.locator(`label[for="${id}"]`).click();
        } else {
          await radio.check({ force: true });
        }
        await expect(radio).toBeChecked();
        return;
      }
    }

    throw new Error(
      `Payment method "${label}" not found. Available: ${available.filter(Boolean).join(" | ") || "(none)"}`,
    );
  }

  async acceptTerms(): Promise<void> {
    if (!(await this.termsCheckbox.count())) return;
    if (await this.termsCheckbox.isChecked()) return;

    const label = this.page.locator('label[for="tos"]').first();
    if (await label.count()) {
      await label.click();
    } else {
      await this.termsCheckbox.evaluate((el: HTMLInputElement) => {
        el.checked = true;
        el.dispatchEvent(new Event("change", { bubbles: true }));
      });
    }

    await expect(this.termsCheckbox).toBeChecked();
  }

  async placeOrder(): Promise<void> {
    await this.submitOrderButton.click();
  }
}
