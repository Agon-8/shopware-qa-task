# Manual Test Plan — Shopware 6 Guest Checkout

**Flow under test:** a guest visitor finds a product, adds it to the cart, and completes checkout using Cash on delivery (Nachnahme).

| Item                | Value                                             |
| ------------------- | ------------------------------------------------- |
| Environment         | https://www.shopware6-demo.development-s25.com/   |
| Storefront language | German (de-DE)                                    |
| Browser             | Google Chrome, Windows                            |
| Test product        | Demo Produkt (SW10001), €10.00, category Clothing |
| Payment method      | Nachnahme (Cash on delivery)                      |
| Date executed       | 2026-09-02                                        |

**Global preconditions for every case:** storefront reachable, cookie bar accepted, no active customer session, cart empty unless stated otherwise.

---

## Positive test cases

### TC-P01 — Complete guest checkout with Cash on delivery (happy path)

| Field         | Value                     |
| ------------- | ------------------------- |
| Preconditions | Empty cart, guest session |
| Priority      | High                      |

| #   | Action                                                                               | Expected result                                                           |
| --- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| 1   | Open the storefront root URL                                                         | Homepage renders, header and main navigation visible                      |
| 2   | Open the Clothing category                                                           | Product listing shows Demo Produkt at €10.00                              |
| 3   | Open Demo Produkt                                                                    | Product detail page loads, name and price match the listing               |
| 4   | Click "In den Warenkorb"                                                             | Off-canvas cart opens with 1 x Demo Produkt, subtotal €10.00              |
| 5   | Click "Zur Kasse"                                                                    | /checkout/register loads with the guest form                              |
| 6   | Fill salutation, first name, last name, email, street, ZIP, city, country and submit | /checkout/confirm loads, address block shows the entered data             |
| 7   | Select "Nachnahme"                                                                   | Radio is selected and stays selected after the page updates               |
| 8   | Tick the terms checkbox and click "Zahlungspflichtig bestellen"                      | /checkout/finish loads with a thank-you header and a numeric order number |

**Expected result:** the order is created, the confirmation page shows an order number and Nachnahme as the payment method.

**Actual Result:**  
The guest checkout was completed successfully. Demo Produkt was added to
the cart with quantity 1 and a total of €10.00. Cash on delivery was
selected, the order was placed successfully, and order number 11016 was
displayed on the confirmation page.

**Status:** Passed

**Evidence:**

- `screenshots/positive/TC-P01-cart.png`
- `screenshots/positive/TC-P01-checkout-form.png`
- `screenshots/positive/TC-P01-final-review.png`
- `screenshots/positive/TC-P01-order-confirmation.png`

---

### TC-P02 — Reach the product through search instead of the category

| Field         | Value      |
| ------------- | ---------- |
| Preconditions | Empty cart |
| Priority      | High       |

| #   | Action                                        | Expected result                              |
| --- | --------------------------------------------- | -------------------------------------------- |
| 1   | Type "Demo" into the header search and submit | Search results page lists Demo Produkt       |
| 2   | Open the product and add it to the cart       | Off-canvas cart shows 1 x Demo Produkt       |
| 3   | Complete the guest checkout as in TC-P01      | Order confirmation page with an order number |

**Expected result:** the entry point does not change the checkout outcome.
**Actual Result:**  
Demo Produkt was found successfully through search. The guest checkout was
completed using Cash on delivery, and order number 11029 was displayed.

**Status:** Passed

**Evidence:**

- `screenshots/positive/TC-P02-search-results.png`
- `screenshots/positive/TC-P02-order-confirmation.png`

---

### TC-P03 — Checkout with quantity 3

| Field         | Value      |
| ------------- | ---------- |
| Preconditions | Empty cart |
| Priority      | Medium     |

| #   | Action                                  | Expected result                                                  |
| --- | --------------------------------------- | ---------------------------------------------------------------- |
| 1   | Open Demo Produkt and set quantity to 3 | Quantity selector shows 3                                        |
| 2   | Add to cart                             | Off-canvas cart shows 3 x Demo Produkt, subtotal €30.00          |
| 3   | Complete the guest checkout             | Confirm page total matches €30.00 plus shipping; order is placed |

**Expected result:** line totals and grand total scale correctly with quantity.
**Actual Result:**  
The product quantity was set to 3. The cart subtotal and final order total
were correctly updated to €30.00. The checkout was completed using Cash on
delivery, and order number 11038 was displayed.

**Status:** Passed

**Evidence:**

- `screenshots/positive/TC-P03-cart-quantity-3.png`
- `screenshots/positive/TC-P03-order-confirmation.png`

---

### TC-P04 — Update quantity on the cart page before checkout

| Field         | Value                          |
| ------------- | ------------------------------ |
| Preconditions | Cart contains 1 x Demo Produkt |
| Priority      | Medium                         |

| #   | Action                                   | Expected result                                     |
| --- | ---------------------------------------- | --------------------------------------------------- |
| 1   | Open /checkout/cart                      | Cart page lists Demo Produkt                        |
| 2   | Change the quantity from 1 to 2          | Cart recalculates, line total €20.00, no page error |
| 3   | Continue to checkout and place the order | Confirmation page reflects quantity 2               |

**Expected result:** cart recalculation is applied to the created order.

---

### TC-P05 — Add product from the listing page (quick add)

| Field         | Value      |
| ------------- | ---------- |
| Preconditions | Empty cart |
| Priority      | Low        |

| #   | Action                           | Expected result                                                              |
| --- | -------------------------------- | ---------------------------------------------------------------------------- |
| 1   | Open the Clothing category       | Listing shows a buy button on the Demo Produkt card                          |
| 2   | Click the buy button on the card | Off-canvas cart opens with 1 x Demo Produkt without visiting the detail page |
| 3   | Complete the guest checkout      | Order placed, confirmation page shown                                        |

**Expected result:** the listing buy button produces the same cart state as the detail page.

---

## Negative test cases

### TC-N01 — Checkout with an empty cart

| Field         | Value         |
| ------------- | ------------- |
| Preconditions | Cart is empty |
| Priority      | High          |

| #   | Action                                 | Expected result                                           |
| --- | -------------------------------------- | --------------------------------------------------------- |
| 1   | Open /checkout/cart                    | Empty cart message is shown, no checkout button available |
| 2   | Navigate directly to /checkout/confirm | Redirected back to the cart, no order is created          |

**Expected result:** an order can never be placed without line items.

---

### TC-N02 — Submit the guest form with all required fields empty

| Field         | Value                                                 |
| ------------- | ----------------------------------------------------- |
| Preconditions | Cart contains 1 x Demo Produkt, on /checkout/register |
| Priority      | High                                                  |

| #   | Action                                           | Expected result                                                                                       |
| --- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| 1   | Click the submit button without filling anything | Page stays on /checkout/register                                                                      |
| 2   | Inspect the form                                 | Every required field is marked invalid with a visible message; focus moves to the first invalid field |

**Expected result:** no navigation to the confirm page, clear field-level validation.

---

### TC-N03 — Submit a malformed email address

| Field         | Value                                                 |
| ------------- | ----------------------------------------------------- |
| Preconditions | Cart contains 1 x Demo Produkt, on /checkout/register |
| Priority      | High                                                  |

| #   | Action                                                     | Expected result                                                      |
| --- | ---------------------------------------------------------- | -------------------------------------------------------------------- |
| 1   | Fill every field correctly but set email to `not-an-email` | Field accepts the keystrokes                                         |
| 2   | Submit the form                                            | Validation error on the email field only, other values are preserved |

**Expected result:** invalid email is rejected server-side as well as client-side, and the user does not lose typed data.

---

## Edge cases

### TC-E01 — 255 character first and last name

| Field         | Value                                                 |
| ------------- | ----------------------------------------------------- |
| Preconditions | Cart contains 1 x Demo Produkt, on /checkout/register |
| Priority      | Medium                                                |

| #   | Action                                           | Expected result                                                                                                   |
| --- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| 1   | Fill first and last name with 255 "A" characters | Input either truncates at the documented limit or shows a length validation message                               |
| 2   | Submit and inspect /checkout/confirm             | Address block wraps the long value inside its container, no horizontal overflow, the order button stays reachable |

**Expected result:** either a length limit is enforced or the long value is rendered without breaking layout. Actual behaviour is reported in `Bug-Report.md`.

---

### TC-E02 — Quantity 0 and an extremely large quantity

| Field         | Value                          |
| ------------- | ------------------------------ |
| Preconditions | Cart contains 1 x Demo Produkt |
| Priority      | Medium                         |

| #   | Action                                 | Expected result                                                                                                       |
| --- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| 1   | On the cart page set the quantity to 0 | Either the line item is removed or a validation message appears; the cart never shows a €0.00 line item at quantity 0 |
| 2   | Set the quantity to 9999               | Quantity is clamped to the available stock or the max purchase limit, with a clear message                            |
| 3   | Continue to checkout                   | Totals match the quantity actually stored in the cart                                                                 |

**Expected result:** quantity bounds are enforced in the cart, not only in the input widget.

---

## Coverage summary

| Type     | Count | IDs              |
| -------- | ----- | ---------------- |
| Positive | 5     | TC-P01 to TC-P05 |
| Negative | 3     | TC-N01 to TC-N03 |
| Edge     | 2     | TC-E01, TC-E02   |

Automated: TC-P01 only (the complete positive guest checkout flow), as required by the assignment. TC-N01 to TC-N03 and TC-E01 to TC-E02 are executed manually.
