import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const cartItemSchema = z.object({
  productId: z.union([z.number().int().positive(), z.string().min(1)]),
  quantity: z.number().int().positive(),
  price: z.number().nonnegative(),
  name: z.string().optional(),
  slug: z.string().optional(),
  imageUrl: z.string().optional(),
  variantSummary: z.string().optional(),
  variantId: z.number().int().positive().optional()
});

const bodySchema = z.object({
  email: z.string().email(),
  amount: z.number().positive(),
  cartItems: z.array(cartItemSchema).min(1),
  shippingAddress: z.record(z.unknown()),
  userId: z.string().uuid().optional(),
  subtotal: z.number().nonnegative(),
  shippingCost: z.number().nonnegative(),
  tax: z.number().nonnegative(),
  discount: z.number().nonnegative(),
  total: z.number().nonnegative()
});

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      return NextResponse.json({ error: "Paystack is not configured. Set PAYSTACK_SECRET_KEY." }, { status: 503 });
    }

    const json = await request.json();
    const body = bodySchema.parse(json);

    const expectedTotal = Math.round((body.subtotal + body.shippingCost + body.tax - body.discount) * 100) / 100;
    if (Math.abs(expectedTotal - body.total) > 0.02) {
      return NextResponse.json({ error: "Total does not match line items." }, { status: 400 });
    }

    const amountInPesewas = Math.round(body.total * 100);
    if (amountInPesewas < 100) {
      return NextResponse.json({ error: "Minimum charge amount not met." }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "";
    const callbackUrl = siteUrl ? `${siteUrl}/checkout/verify` : undefined;

    const metadata: Record<string, string> = {
      items_json: JSON.stringify(body.cartItems),
      shipping_json: JSON.stringify(body.shippingAddress),
      subtotal: String(body.subtotal),
      shipping_cost: String(body.shippingCost),
      tax: String(body.tax),
      discount: String(body.discount),
      total: String(body.total)
    };
    if (body.userId) metadata.user_id = body.userId;

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: body.email,
        amount: amountInPesewas,
        currency: "GHS",
        ...(callbackUrl ? { callback_url: callbackUrl } : {}),
        metadata,
        channels: ["card", "mobile_money", "bank", "ussd"]
      })
    });

    const data = (await response.json()) as {
      status?: boolean;
      message?: string;
      data?: { authorization_url?: string; access_code?: string; reference?: string };
    };

    if (!data.status || !data.data?.access_code) {
      return NextResponse.json({ error: data.message ?? "Paystack initialize failed." }, { status: 400 });
    }

    return NextResponse.json({
      authorizationUrl: data.data.authorization_url,
      accessCode: data.data.access_code,
      reference: data.data.reference
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Initialize failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
