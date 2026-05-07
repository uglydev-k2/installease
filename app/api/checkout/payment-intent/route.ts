import { NextResponse } from "next/server";
import { z } from "zod";
import Stripe from "stripe";

const bodySchema = z.object({
  amountMinor: z.number().int().positive().max(50_000_000),
  currency: z.enum(["ghs"]).default("ghs")
});

export async function POST(request: Request) {
  try {
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      return NextResponse.json(
        { error: "Stripe is not configured. Set STRIPE_SECRET_KEY on the server." },
        { status: 503 }
      );
    }

    const json = await request.json();
    const { amountMinor, currency } = bodySchema.parse(json);

    const stripe = new Stripe(secret, { typescript: true });
    const intent = await stripe.paymentIntents.create({
      amount: amountMinor,
      currency,
      automatic_payment_methods: { enabled: true }
    });

    if (!intent.client_secret) {
      return NextResponse.json({ error: "Could not create payment intent." }, { status: 500 });
    }

    return NextResponse.json({ clientSecret: intent.client_secret, id: intent.id });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Payment intent failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
