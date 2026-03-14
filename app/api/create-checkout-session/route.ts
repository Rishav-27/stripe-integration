import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { getOrCreateSubscriptionPriceId } from "@/lib/stripe-products";

function getBaseUrl(request: Request): string {
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const customerId = typeof body.customerId === "string" ? body.customerId.trim() : null;

    if (!customerId || !customerId.startsWith("cus_")) {
      return NextResponse.json(
        { error: "Valid customer ID is required" },
        { status: 400 }
      );
    }

    const customer = await stripe.customers.retrieve(customerId);
    if (customer.deleted) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 400 }
      );
    }

    const priceId = await getOrCreateSubscriptionPriceId();
    const baseUrl = getBaseUrl(request);

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "subscription",
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // card = cards + Apple Pay/Google Pay (when enabled in Dashboard). link = Stripe Link.
      payment_method_types: ["card", "link"],
      success_url: `${baseUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/onboarding?step=2`,
      subscription_data: {
        metadata: {
          customer_id: customerId,
        },
      },
      allow_promotion_codes: true,
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    if (!session.url) {
      return NextResponse.json(
        { error: "Failed to create checkout session" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error("Checkout session error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to create checkout session",
      },
      { status: 500 }
    );
  }
}
