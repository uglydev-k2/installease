import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAdminApiAccess } from "@/lib/server/admin-auth";

export async function GET() {
  try {
    const auth = await requireAdminApiAccess();
    if (!auth.ok) return auth.response;

    const supabase = createServerSupabaseClient();
    const [categoriesRes, brandsRes] = await Promise.all([
      supabase.from("categories").select("id, name, slug").order("name"),
      supabase.from("brands").select("id, name").order("name")
    ]);

    if (categoriesRes.error) {
      return NextResponse.json({ error: categoriesRes.error.message }, { status: 500 });
    }
    if (brandsRes.error) {
      return NextResponse.json({ error: brandsRes.error.message }, { status: 500 });
    }

    return NextResponse.json({
      categories: categoriesRes.data ?? [],
      brands: brandsRes.data ?? []
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load catalog.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
