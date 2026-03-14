import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId || typeof sessionId !== "string" || !sessionId.startsWith("cs_")) {
      return NextResponse.json(
        { error: "Invalid or missing session_id" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["customer", "subscription"],
    });

    if (session.payment_status !== "paid" && session.status !== "complete") {
      return NextResponse.json(
        { error: "Session not paid or incomplete" },
        { status: 400 }
      );
    }

    if (session.mode !== "subscription") {
      return NextResponse.json(
        { error: "Invalid session mode" },
        { status: 400 }
      );
    }

    const rawCustomer =
      typeof session.customer === "object" && session.customer
        ? session.customer
        : null;
    const customer =
      rawCustomer && !("deleted" in rawCustomer && rawCustomer.deleted)
        ? rawCustomer
        : null;
    const subscription =
      typeof session.subscription === "object" && session.subscription
        ? session.subscription
        : null;

    return NextResponse.json({
      sessionId: session.id,
      customerId: session.customer as string,
      customerEmail: customer?.email ?? null,
      customerName: customer?.name ?? null,
      subscriptionId: session.subscription as string,
      subscriptionStatus: subscription?.status ?? null,
      paymentStatus: session.payment_status,
    });
  } catch (err) {
    console.error("Verify session error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to verify session",
      },
      { status: 500 }
    );
  }
}
