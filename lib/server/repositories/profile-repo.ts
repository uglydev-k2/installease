import { createServerSupabaseClient } from "@/lib/supabase/server";

interface UpdateProfileInput {
  id: string;
  full_name?: string;
  avatar_url?: string;
  ecosystem_preferences?: string[];
  loyalty_points?: number;
}

export async function getProfile(id: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertProfile(payload: UpdateProfileInput) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "id" })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}
