import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

const NAME_MAX = 200;
const PHONE_MAX = 50;
const EMAIL_MAX = 254;

function isValidEmail(value: string): boolean {
  const re =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return value.length <= EMAIL_MAX && re.test(value);
}

function sanitizeString(value: unknown, maxLen: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const name = sanitizeString(body.name, NAME_MAX);
    const email = sanitizeString(body.email, EMAIL_MAX);
    const phone = sanitizeString(body.phone, PHONE_MAX);

    if (!name || name.length < 1) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }
    if (!phone || phone.length < 1) {
      return NextResponse.json(
        { error: "Contact number is required" },
        { status: 400 }
      );
    }

    const customer = await stripe.customers.create({
      name,
      email,
      phone,
    });

    return NextResponse.json({
      customerId: customer.id,
    });
  } catch (err) {
    console.error("Customer create error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to create customer",
      },
      { status: 500 }
    );
  }
}
