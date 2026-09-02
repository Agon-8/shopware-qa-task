# Shopware 6 Storefront — QA Exercise

Manual test plan, bug report and Playwright end-to-end automation for the guest checkout flow of a Shopware 6 storefront, built with the Page Object Model.

**Flow under test:** guest visitor opens the store, finds a product, adds it to the cart, checks out as a guest, selects Cash on delivery (Nachnahme) and places the order.

## Environment

| Item | Value |
| --- | --- |
| Target | https://www.shopware6-demo.development-s25.com/ |
| Storefront language | German (de-DE) |
| Framework | Playwright + TypeScript |
| Automated browser | Chromium |
| Manual testing | Google Chrome on Windows |

The base URL is overridable: `BASE_URL=https://my-local-shop.ddev.site npm test`.

## Project structure

```
shopware-qa-task/
├── src/
│   ├── data/
│   │   └── testData.ts              # products, payment labels, guest factory, edge case data
│   ├── fixtures/
│   │   └── pages.ts                 # page objects injected as Playwright fixtures
│   └── pages/
│       ├── BasePage.ts              # cookie bar, navigation, header cart, shared assertions
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
│   └── guest-checkout.spec.ts       # TC-P01, the only automated test
├── screenshots/                     # manual testing evidence
├── Manual-Test-Plan.md
├── Bug-Report.md
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

## Setup

```bash
npm install
npx playwright install chromium
```

## Running the tests

```bash
npm run test:chromium      # run the single E2E test headlessly
npm run test:headed        # run the same test with the browser visible
npm run test:debug         # Playwright inspector
npm test                   # run the single E2E test in Chromium
npm run report             # open the HTML report
```

Run a single case:

```bash
npx playwright test tests/guest-checkout.spec.ts --project=chromium
```

## Page Object Model

Every page exposes locators as readonly fields and actions as methods. Specs never touch a CSS selector, so a storefront markup change is a one-file fix.

- `BasePage` holds what every page shares: `open()`, `dismissCookieBanner()`, header search, cart badge, URL assertion. All other pages extend it.
- Page objects assert their own "am I loaded" state (`assertLoaded()`), so a spec step fails at the page that actually broke.
- Where Shopware renders two different widgets for the same thing (quantity as a `<select>` on small step ranges, as a number input otherwise), the page object hides that branch behind `setQuantity()`.
- Page objects are wired as fixtures in `src/fixtures/pages.ts`, so specs declare the pages they need instead of constructing them.

### Selector strategy

The demo store ships no `data-test-id` attributes, so selectors are chosen in this order:

1. Stable IDs from the Shopware form templates: `#personalMail`, `#billingAddressAddressZipcode`, `#tos`, `#confirmFormSubmit`.
2. Semantic/role selectors: `getByRole('link', { name })` for navigation and product links.
3. Structural Shopware classes that are part of the storefront template contract: `.product-detail-name`, `.begin-checkout-btn`, `.finish-ordernumber`.
4. Text filtering scoped to a container (`.payment-method` filtered by `Nachnahme`) rather than nth-child chains.

No selector in this repo depends on DOM position or on generated Bootstrap utility classes.

### Assertions

Each step asserts state, not just navigation: product name and price on the detail page, product name and quantity in the off-canvas cart, the payment radio being checked after selection, the URL of every checkout stage, and finally the order number matching `\d{3,}` plus the payment method on the confirmation page.

## Test data

Guest emails are generated per run (`qa.guest.<timestamp>@example.com`) so repeated runs never hit "an account with this email already exists" on the shared demo store.

## Scope decision

The assignment asks for ONE automated positive end-to-end test. Therefore only TC-P01 is automated. The negative and edge cases remain in `Manual-Test-Plan.md` for manual execution and evidence collection.

## Known limitations

- The tests place real orders on the shared public demo store. There is no cleanup step; on a controlled instance I would reset via the Admin API between runs.
- Assertions on the storefront are written against the German UI labels of this instance. A different locale needs the labels in `testData.ts` swapped, not the page objects.
- The `Nachnahme` payment method must be active in the sales channel; if it is deactivated the test fails at the payment step with a clear message rather than silently ordering with the default method.

## What I would improve with more time

- API-level setup: create the cart through the Store API and start the UI test at `/checkout/register`, so the happy path test is not paying for coverage that already exists elsewhere.
- Visual regression snapshots on the confirm and finish pages.
- A GitHub Actions workflow running the suite on push with the HTML report uploaded as an artifact.
- Data-driven quantity and payment method cases instead of the single hardcoded product.
- Accessibility checks (axe) on each checkout step.
- Ask the team to add `data-test-id` attributes to the checkout templates and migrate the class-based selectors to them.

## Reflection

The most difficult part was making selectors stable on a shared storefront that does not provide dedicated test IDs, especially around the payment method and quantity widgets. The most enjoyable part was modelling the checkout as reusable page objects and adding assertions at each important transition instead of checking only the final page.
