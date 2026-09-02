import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { GuestCustomer } from "../data/testData";


export class CheckoutRegisterPage extends BasePage {
  readonly form: Locator;
  readonly salutation: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly email: Locator;
  readonly street: Locator;
  readonly zipcode: Locator;
  readonly city: Locator;
  readonly country: Locator;
  readonly countryState: Locator;
  readonly createAccountCheckbox: Locator;
  readonly differentShippingCheckbox: Locator;
  readonly submitButton: Locator;
  readonly invalidFields: Locator;

  constructor(page: Page) {
    super(page);
    this.form = page
      .locator("form")
      .filter({ has: page.locator("#personalMail") })
      .first();
    this.submitButton = this.form
      .locator('button[type="submit"], input[type="submit"]')
      .last();
    this.salutation = page.locator("#personalSalutation");
    this.firstName = page.locator("#billingAddress-personalFirstName");
    this.lastName = page.locator("#billingAddress-personalLastName");
    this.email = page.locator("#personalMail");
    this.street = page.locator("#billingAddress-AddressStreet");
    this.zipcode = page.locator("#billingAddressAddressZipcode");
    this.city = page.locator("#billingAddressAddressCity");
    this.country = page.locator("#billingAddressAddressCountry");
    this.countryState = page.locator("#billingAddressAddressCountryState");

    this.createAccountCheckbox = page.locator("#personalGuest");
    this.differentShippingCheckbox = page.locator("#differentShippingAddress");

    this.submitButton = this.form.locator('button[type="submit"]').last();
    this.invalidFields = page.locator(".is-invalid, .invalid-feedback");
  }

  async goto(): Promise<void> {
    await this.open("/checkout/register");
  }

  async assertLoaded(): Promise<void> {
    await this.expectUrlContains("/checkout/register");
    await expect(this.email).toBeVisible();
    await expect(this.firstName).toBeVisible();
  }

  private async optionValues(locator: Locator): Promise<string[]> {
    return locator
      .locator("option")
      .evaluateAll((options) =>
        options
          .map((o) => (o as HTMLOptionElement).value)
          .filter((v) => v !== ""),
      );
  }

  
  private async selectOrFallback(
    locator: Locator,
    label: string,
  ): Promise<boolean> {
    const values = await this.optionValues(locator);
    if (!values.length) return false;

    try {
      await locator.selectOption({ label });
    } catch {
      await locator.selectOption(values[0]);
    }
    return true;
  }

  private async selectRequired(
    locator: Locator,
    label: string,
    field: string,
  ): Promise<void> {
    const selected = await this.selectOrFallback(locator, label);
    if (!selected) {
      throw new Error(
        `Register form: "${field}" has no selectable option (tried "${label}")`,
      );
    }
  }

  
  private async fillCountryState(): Promise<void> {
    if (!(await this.countryState.isVisible().catch(() => false))) return;

    const values = await this.optionValues(this.countryState);
    if (values.length) {
      await this.countryState.selectOption(values[0]);
    }
  }

  async fillGuestDetails(guest: GuestCustomer): Promise<void> {
    await this.selectOrFallback(this.salutation, guest.salutation);
    await this.firstName.fill(guest.firstName);
    await this.lastName.fill(guest.lastName);
    await this.email.fill(guest.email);
    await this.street.fill(guest.street);
    await this.zipcode.fill(guest.zipcode);
    await this.city.fill(guest.city);
    await this.selectRequired(this.country, guest.country, "country");
    await this.fillCountryState();
  }

  async ensureGuestCheckout(): Promise<void> {
    if (await this.createAccountCheckbox.count()) {
      if (await this.createAccountCheckbox.isChecked()) {
        await this.createAccountCheckbox.uncheck();
      }
    }
    if (await this.differentShippingCheckbox.count()) {
      if (await this.differentShippingCheckbox.isChecked()) {
        await this.differentShippingCheckbox.uncheck();
      }
    }
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async continueAsGuest(guest: GuestCustomer): Promise<void> {
    await this.ensureGuestCheckout();
    await this.fillGuestDetails(guest);
    await this.submit();
  }

  async assertValidationErrors(): Promise<void> {
    await expect(this.page).toHaveURL(/\/(checkout|account)\/register/);
    await expect(this.page).not.toHaveURL(/\/checkout\/(confirm|finish)/);
    await expect(this.invalidFields.first()).toBeVisible();
  }
}
