# Bug Report

## BUG-001 — Guest checkout accepts a 255 character last name and the value overflows the address summary on the confirm page (simulated)

> **Reporting note:** This is a simulated issue, which the assignment explicitly permits. It demonstrates the expected bug-report format and must not be presented as a verified defect unless the behaviour is reproduced on the demo store.

### Environment

| Item | Value |
| --- | --- |
| URL | https://www.shopware6-demo.development-s25.com/checkout/register |
| Application | Shopware 6 demo storefront (German storefront, de-DE) |
| Browser | Google Chrome, desktop viewport |
| OS | Windows 11 |
| Session | Guest, no customer account |
| Found during | TC-E01 |

### Steps to reproduce

1. Open https://www.shopware6-demo.development-s25.com/ and accept the cookie bar.
2. Open the Clothing category and add "Demo Produkt" to the cart.
3. In the off-canvas cart click "Zur Kasse".
4. On /checkout/register fill in all required fields, using a 255 character string ("A" repeated 255 times) for both first name and last name.
5. Submit the form.
6. Look at the billing address block on /checkout/confirm.

### Expected result

The form either enforces a documented maximum length on the name fields and shows a validation message, or the confirm page wraps the long value inside its container so that the layout, the payment method list and the order button stay unaffected.

### Actual result

For this simulated scenario, the address summary renders the value as one unbroken string and overflows its container, reducing the readability of the checkout review page.

### Severity

**Low.**

The simulated issue affects readability and input quality, but it does not block checkout or prevent the order from being placed.

### Additional notes

- No screenshot is attached because the issue is explicitly documented as simulated. If reproduced manually, add a screenshot and replace this note with the observed browser version, viewport, date and reproducibility rate.

### Suggested fix

Add a maxlength plus server-side length constraint on `firstName` and `lastName`, and apply `overflow-wrap: anywhere` to the address summary block so that any unbroken string still wraps.
