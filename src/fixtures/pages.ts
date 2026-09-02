import { test as base } from '@playwright/test';
import {
  HomePage,
  CategoryPage,
  ProductDetailPage,
  OffcanvasCartPage,
  CartPage,
  CheckoutRegisterPage,
  CheckoutConfirmPage,
  CheckoutFinishPage,
} from '../pages';

type Pages = {
  homePage: HomePage;
  categoryPage: CategoryPage;
  productPage: ProductDetailPage;
  offcanvasCart: OffcanvasCartPage;
  cartPage: CartPage;
  registerPage: CheckoutRegisterPage;
  confirmPage: CheckoutConfirmPage;
  finishPage: CheckoutFinishPage;
};

/**
 * Page objects injected as fixtures, so specs never construct them by hand.
 */
export const test = base.extend<Pages>({
  homePage: async ({ page }, use) => use(new HomePage(page)),
  categoryPage: async ({ page }, use) => use(new CategoryPage(page)),
  productPage: async ({ page }, use) => use(new ProductDetailPage(page)),
  offcanvasCart: async ({ page }, use) => use(new OffcanvasCartPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  registerPage: async ({ page }, use) => use(new CheckoutRegisterPage(page)),
  confirmPage: async ({ page }, use) => use(new CheckoutConfirmPage(page)),
  finishPage: async ({ page }, use) => use(new CheckoutFinishPage(page)),
});

export { expect } from '@playwright/test';
