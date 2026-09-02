import { Page, Locator, expect } from "@playwright/test";

export abstract class BasePage {
  readonly page: Page;

  readonly cookieBanner: Locator;
  readonly acceptCookiesButton: Locator;
  readonly cartWidget: Locator;
  readonly searchInput: Locator;
  readonly searchSubmit: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cookieBanner = page.locator(".cookie-permission-container");
    this.acceptCookiesButton = this.cookieBanner.getByRole("button", {
      name: /Nur technisch notwendige|Alle akzeptieren|Akzeptieren|Accept/i,
    });
    this.cartWidget = page.locator(".header-cart");
    this.searchInput = page.locator("#header-main-search-input");
    this.searchSubmit = page.locator(".header-search-btn");
  }

  async open(path = "/"): Promise<void> {
    await this.page.goto(path, { waitUntil: "domcontentloaded" });
    await this.dismissCookieBanner();
  }

  
  async dismissCookieBanner(): Promise<void> {
    if (!(await this.cookieBanner.isVisible().catch(() => false))) return;

    const button = this.acceptCookiesButton.first();
    if (await button.count()) {
      await button.click();
    } else {
      await this.cookieBanner.locator("button").first().click();
    }
    await expect(this.cookieBanner).toBeHidden({ timeout: 5_000 });
  }

  async searchFor(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.searchSubmit.click();
  }

  async cartBadgeCount(): Promise<number> {
    const match = (await this.cartWidget.innerText()).match(/\d+/);
    if (match === null) {
      return 0;
    }
    return Number(match[0]);
  }

  async expectUrlContains(fragment: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(fragment));
  }
}
