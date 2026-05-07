import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  code: z.string().min(1).max(64),
  subtotal: z.number().nonnegative()
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { code, subtotal } = bodySchema.parse(json);
    const normalized = code.trim().toUpperCase();

    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("promo_codes")
      .select("*")
      .eq("code", normalized)
      .eq("active", true)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ valid: false, message: "Could not validate code." }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ valid: false, message: "Invalid or expired code" });
    }

    const expiresAt = data.expires_at ? new Date(data.expires_at as string) : null;
    if (expiresAt && expiresAt < new Date()) {
      return NextResponse.json({ valid: false, message: "Invalid or expired code" });
    }

    const minSub = Number(data.min_order_subtotal ?? 0);
    if (subtotal < minSub) {
      return NextResponse.json({
        valid: false,
        message: `Minimum order of GH₵${minSub.toFixed(2)} required for this code.`
      });
    }

    const pct = data.discount_percent != null ? Number(data.discount_percent) : null;
    const amt = data.discount_amount != null ? Number(data.discount_amount) : null;

    let discount = 0;
    if (pct != null && pct > 0) {
      discount = Math.round(subtotal * (pct / 100) * 100) / 100;
    } else if (amt != null && amt > 0) {
      discount = Math.min(amt, subtotal);
    } else {
      return NextResponse.json({ valid: false, message: "Invalid or expired code" });
    }

    return NextResponse.json({
      valid: true,
      code: normalized,
      discount,
      message: "Promo applied"
    });
  } catch {
    return NextResponse.json({ valid: false, message: "Invalid request." }, { status: 400 });
  }
}
