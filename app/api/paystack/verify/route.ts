import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { insertPaystackPaidOrder, parsePaystackMetadata } from "@/lib/server/paystack-order";
import { buildCheckoutSuccessSession } from "@/lib/checkout/success-payload";

export async function GET(request: NextRequest) {
  const reference = request.nextUrl.searchParams.get("reference");

  if (!reference) {
    return NextResponse.json({ error: "No reference provided" }, { status: 400 });
  }

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "Paystack is not configured." }, { status: 503 });
  }

  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: {
        Authorization: `Bearer ${secret}`
      }
    });

    const data = (await response.json()) as {
      status?: boolean;
      message?: string;
      data?: {
        status?: string;
        amount?: number;
        reference?: string;
        channel?: string;
        metadata?: Record<string, unknown>;
      };
    };

    if (!data.status || data.data?.status !== "success") {
      return NextResponse.json({ error: data.message ?? "Payment not successful" }, { status: 400 });
    }

    const transaction = data.data;
    const meta = parsePaystackMetadata(transaction.metadata);
    if (!meta) {
      return NextResponse.json({ error: "Missing order metadata on transaction." }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    const order = await insertPaystackPaidOrder(supabase, {
      reference: transaction.reference ?? reference,
      channel: transaction.channel ?? "unknown",
      amountPesewas: transaction.amount ?? 0,
      metadata: meta
    });

    const sessionPayload = buildCheckoutSuccessSession(order);
    const { orderId: _omit, ...forSession } = sessionPayload;

    return NextResponse.json({
      success: true,
      orderId: order.id,
      reference: transaction.reference ?? reference,
      sessionPayload: forSession
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Verification failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
