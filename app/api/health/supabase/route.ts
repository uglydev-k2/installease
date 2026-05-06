import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const startedAt = Date.now();

  try {
    const supabase = createServerSupabaseClient();
    const { error } = await supabase.from("products").select("id", { head: true, count: "exact" }).limit(1);

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          service: "supabase",
          message: error.message,
          latencyMs: Date.now() - startedAt
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      service: "supabase",
      message: "Supabase connection healthy.",
      latencyMs: Date.now() - startedAt
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected health check failure.";
    return NextResponse.json(
      {
        ok: false,
        service: "supabase",
        message,
        latencyMs: Date.now() - startedAt
      },
      { status: 500 }
    );
  }
}
