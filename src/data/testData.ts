export const store = {
  baseUrl: "https://www.shopware6-demo.development-s25.com",
  locale: "de-DE",
};

export const products = {
  demo: {
    name: "Demo Produkt",
    url: "/Demo-Produkt/SW10001",
    category: "Clothing",
    categoryUrl: "/Clothing/",
    price: "€10.00",
  },
};

export const payment = {
  cashOnDelivery: "Cash on delivery",
};

export interface GuestCustomer {
  salutation: string;
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  zipcode: string;
  city: string;
  country: string;
}

export function buildGuest(
  overrides: Partial<GuestCustomer> = {},
): GuestCustomer {
  const stamp = Date.now();
  return {
    salutation: "Not specified",
    firstName: "Ammar",
    lastName: "QaTest",
    email: `qa.guest.${stamp}@example.com`,
    street: "Rruga B 12",
    zipcode: "10000",
    city: "Prishtina",
    country: "Deutschland",
    ...overrides,
  };
}
