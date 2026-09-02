# Shopware 6 Storefront - QA Exercise

This repository contains the manual test plan, bug report, test evidence, and Playwright end-to-end automation for the guest checkout flow of a Shopware 6 storefront.

**Flow under test:** A guest visitor finds a product, adds it to the cart, completes checkout using Cash on delivery, and receives an order confirmation number.

## Environment

| Item              | Value                                                         |
| ----------------- | ------------------------------------------------------------- |
| Target            | https://www.shopware6-demo.development-s25.com/               |
| Automation locale | German (de-DE)                                                |
| Manual testing    | Google Chrome on Windows; UI language varied during execution |
| Framework         | Playwright with TypeScript                                    |
| Automated browser | Chromium                                                      |
| Test product      | Demo Produkt (SW10001)                                        |
| Payment method    | Cash on delivery                                              |

## Project Structure

```text
shopware-qa-task/
├── src/
│   ├── data/
│   │   └── testData.ts
│   ├── fixtures/
│   │   └── pages.ts
│   └── pages/
│       ├── BasePage.ts
│       ├── HomePage.ts
│       ├── CategoryPage.ts
│       ├── ProductDetailPage.ts
│       ├── OffcanvasCartPage.ts
│       ├── CartPage.ts
│       ├── CheckoutRegisterPage.ts
│       ├── CheckoutConfirmPage.ts
│       ├── CheckoutFinishPage.ts
│       └── index.ts
├── tests/
│   └── guest-checkout.spec.ts
├── screenshots/
│   ├── positive/
│   ├── negative/
│   └── edge/
├── Manual-Test-Plan.md
├── Bug-Report.md
├── playwright.config.ts
├── tsconfig.json
├── package.json
└── package-lock.json
```

## Prerequisites

* Node.js 18 or later
* npm
* Internet access

## Setup

Install the project dependencies:

```bash
npm install
```

Install the Chromium browser required by Playwright:

```bash
npx playwright install chromium
```

## Running the Automated Test

Run the test in Chromium:

```bash
npm run test:chromium
```

Run the test with the browser visible:

```bash
npm run test:headed
```

Run the test with the Playwright Inspector:

```bash
npm run test:debug
```

Open the latest HTML report:

```bash
npm run report
```

Run the test file directly:

```bash
npx playwright test tests/guest-checkout.spec.ts --project=chromium
```

## Automated Test Scope

The assignment requires one automated positive end-to-end test. Therefore, only TC-P01 is automated.

The automated test covers the following flow:

1. Open the Shopware storefront.
2. Navigate to the Clothing category.
3. Open Demo Produkt.
4. Verify the product name and price.
5. Add the product to the cart.
6. Verify the product and quantity in the cart.
7. Continue to checkout as a guest.
8. Fill in customer and address information.
9. Select Cash on delivery.
10. Accept the Terms and Conditions.
11. Place the order.
12. Verify the confirmation page and order number.

The negative and edge cases are documented in `Manual-Test-Plan.md` for manual execution.

## Automated Test Result

The automated TC-P01 guest checkout test was executed successfully in Chromium.

```text
1 passed
0 failed
0 flaky
0 skipped
```

The test completed the full flow and displayed a valid order confirmation number.

## Page Object Model

The project uses the Page Object Model to separate test logic from page interactions.

* `BasePage` contains shared page functionality.
* `HomePage` represents the storefront homepage.
* `CategoryPage` handles product listing interactions.
* `ProductDetailPage` handles product details and quantity selection.
* `OffcanvasCartPage` represents the cart side panel.
* `CartPage` handles the full cart page.
* `CheckoutRegisterPage` handles guest and address information.
* `CheckoutConfirmPage` handles payment, Terms and Conditions, and order submission.
* `CheckoutFinishPage` verifies the order confirmation and order number.
* `pages.ts` provides the page objects as Playwright fixtures.

## Selector Strategy

The demo storefront does not provide dedicated `data-testid` attributes. Selectors are therefore chosen in the following order:

1. Stable form IDs and input names.
2. Accessible role and label selectors.
3. Stable Shopware storefront classes.
4. Text filtering scoped to a specific component.

The test avoids selectors that depend on DOM position, such as long `nth-child` chains.

## Assertions

Meaningful assertions are included at the major stages of the test:

* Storefront and navigation are visible.
* The expected product appears in the category.
* The product name and price are correct.
* The cart contains the expected product and quantity.
* The guest checkout page is displayed.
* The checkout confirmation page is reached.
* Cash on delivery is selected.
* The order confirmation page is displayed.
* A numeric order number is generated.
* The confirmation shows the selected payment method.

## Test Data

A unique guest email is generated for every automated test execution:

```text
qa.guest.<timestamp>@example.com
```

This prevents repeated executions from using the same email address on the shared demo storefront.

## Manual Testing

The manual test plan is available in `Manual-Test-Plan.md` and contains:

* 5 positive test cases
* 3 negative test cases
* 2 edge cases

Each test case includes an ID, title, preconditions, steps, expected result, and priority.

Manual execution evidence is stored in the `screenshots` directory.

## Bug Report

The bug report is available in `Bug-Report.md`.

The reported issue is documented as simulated, which is permitted by the assignment. It includes the environment, reproduction steps, expected and actual results, severity, and justification.

## Known Limitations

* The automated test creates a real order on the shared public demo storefront.
* There is no cleanup process for orders created by automated test executions.
* The automation depends on the labels and markup available in the current demo storefront.
* The Cash on delivery payment method must remain available in the sales channel.
* Changes to the shared demo environment may require updates to test data or selectors.

## What I Would Improve With More Time

* Add automated cleanup for orders created during test execution.
* Run the same E2E test in Chromium, Firefox, and WebKit.
* Add a GitHub Actions workflow and upload the Playwright report as an artifact.
* Add visual regression checks for the checkout confirmation and finish pages.
* Add accessibility checks to the main checkout pages.
* Replace class-based selectors with dedicated `data-testid` attributes if they become available.
* Create additional reusable test-data helpers.

## Reflection

The most difficult part was creating stable selectors for a shared storefront that does not provide dedicated test IDs, especially for the payment method and quantity controls.

The most enjoyable part was organizing the checkout flow with reusable Page Objects and adding assertions at every important stage instead of checking only the final page.
