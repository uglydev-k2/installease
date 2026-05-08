import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { findOrderByPaymentReference } from "@/lib/server/paystack-order";

export async function POST(request: NextRequest) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const body = await request.text();
  const hash = crypto.createHmac("sha512", secret).update(body).digest("hex");
  const signature = request.headers.get("x-paystack-signature");

  if (hash !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: { event?: string; data?: Record<string, unknown> };
  try {
    event = JSON.parse(body) as { event?: string; data?: Record<string, unknown> };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (event.event === "charge.success" && event.data) {
    const data = event.data as { reference?: string };
    const ref = typeof data.reference === "string" ? data.reference : null;
    if (ref) {
      try {
        const supabase = createServerSupabaseClient();
        const order = await findOrderByPaymentReference(supabase, ref);
        if (order) {
          await supabase.from("orders").update({ status: "confirmed" }).eq("payment_reference", ref);
        }
      } catch {
        /* acknowledge */
      }
    }
  }

  return NextResponse.json({ received: true });
}
