import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === "string" ? body.email : undefined;

    const customer = await stripe.customers.create({
      email: email ?? undefined,
      name: body.name ?? undefined,
    });

    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
      payment_method_types: ["card"],
      usage: "off_session",
      metadata: {
        customer_id: customer.id,
      },
    });

    return NextResponse.json({
      clientSecret: setupIntent.client_secret,
      customerId: customer.id,
    });
  } catch (err) {
    console.error("SetupIntent error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create setup intent" },
      { status: 500 }
    );
  }
}
