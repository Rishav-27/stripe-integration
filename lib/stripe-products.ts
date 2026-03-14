import { stripe } from "./stripe";

const PRODUCT_NAME = "Default Subscription";
const AMOUNT_CENTS = 1000; // $10

export async function getOrCreateSubscriptionPriceId(): Promise<string> {
  const products = await stripe.products.list({
    active: true,
    limit: 100,
  });

  let product = products.data.find((p) => p.name === PRODUCT_NAME);
  if (!product) {
    product = await stripe.products.create({
      name: PRODUCT_NAME,
      description: "Monthly subscription",
    });
  }

  const prices = await stripe.prices.list({
    product: product.id,
    active: true,
  });

  let price = prices.data.find(
    (p) =>
      p.recurring?.interval === "month" &&
      p.unit_amount === AMOUNT_CENTS &&
      p.currency === "usd"
  );

  if (!price) {
    price = await stripe.prices.create({
      product: product.id,
      unit_amount: AMOUNT_CENTS,
      currency: "usd",
      recurring: { interval: "month" },
    });
  }

  return price.id;
}
