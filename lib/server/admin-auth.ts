import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { createRouteHandlerClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { createServerSupabaseClient } from "@/lib/supabase/server";

async function isAdminUser(userId: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from("profiles").select("role").eq("id", userId).maybeSingle();
  if (error) throw error;
  return data?.role === "admin";
}

export async function requireAdminPageAccess() {
  const supabaseAuth = createServerComponentClient({ cookies });
  const {
    data: { user }
  } = await supabaseAuth.auth.getUser();

  if (!user) redirect("/signin");
  const isAdmin = await isAdminUser(user.id);
  if (!isAdmin) redirect("/account");
}

export async function requireAdminApiAccess() {
  const supabaseAuth = createRouteHandlerClient({ cookies });
  const {
    data: { user }
  } = await supabaseAuth.auth.getUser();

  if (!user) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Unauthorized." }, { status: 401 })
    };
  }

  const isAdmin = await isAdminUser(user.id);
  if (!isAdmin) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Forbidden. Admin access required." }, { status: 403 })
    };
  }

  return { ok: true as const, userId: user.id };
}
