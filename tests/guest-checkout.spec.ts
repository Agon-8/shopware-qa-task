import { test, expect } from '../src/fixtures/pages';
import { products, payment, buildGuest } from '../src/data/testData';

const product = products.demo;

test.describe('TC-P01 Guest checkout with Cash on delivery', () => {
  test('completes the full guest checkout and shows an order number', async ({
    homePage,
    categoryPage,
    productPage,
    offcanvasCart,
    registerPage,
    confirmPage,
    finishPage,
  }) => {
    const guest = buildGuest();

    await test.step('Storefront loads', async () => {
      await homePage.goto();
      await homePage.assertLoaded();
    });

    await test.step('Open the product from the Clothing category', async () => {
      await categoryPage.goto(product.categoryUrl);
      await categoryPage.assertProductVisible(product.name);
      await categoryPage.openProduct(product.name);
      await productPage.assertLoaded(product.name);
      await expect(productPage.price).toContainText(product.price);
    });

    await test.step('Add the product to the cart', async () => {
      await productPage.setQuantity(1);
      await productPage.addToCart();
      await offcanvasCart.assertContains(product.name, 1);
    });

    await test.step('Proceed to checkout as a guest', async () => {
      await offcanvasCart.proceedToCheckout();
      await registerPage.assertLoaded();
      await registerPage.continueAsGuest(guest);
    });

    await test.step('Select Cash on delivery and accept the terms', async () => {
      await confirmPage.assertLoaded();
      await confirmPage.assertContainsProduct(product.name);
      await confirmPage.selectPaymentMethod(payment.cashOnDelivery);
      await confirmPage.acceptTerms();
    });

    await test.step('Place the order and verify the confirmation', async () => {
      await confirmPage.placeOrder();
      await finishPage.assertOrderPlaced();

      const orderNumber = await finishPage.getOrderNumber();
      expect(orderNumber).toMatch(/^\d{3,}$/);
      await expect(finishPage.paymentMethodSummary).toContainText(payment.cashOnDelivery);
    });
  });
});
