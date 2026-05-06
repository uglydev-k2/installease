import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ApiError } from "@/lib/server/http";

interface CartScope {
  userId?: string;
  sessionId?: string;
}

interface CartMutation extends CartScope {
  productId: number;
  variantId?: number;
  quantity: number;
}

async function getOrCreateCart(scope: CartScope) {
  const supabase = createServerSupabaseClient();
  if (!scope.userId && !scope.sessionId) {
    throw new ApiError("Either userId or sessionId is required.", 400);
  }

  let query = supabase.from("carts").select("*").limit(1);
  if (scope.userId) query = query.eq("user_id", scope.userId);
  else query = query.eq("session_id", scope.sessionId as string);

  const { data, error } = await query.maybeSingle();
  if (error) throw error;
  if (data) return data;

  const { data: created, error: createError } = await supabase
    .from("carts")
    .insert({ user_id: scope.userId ?? null, session_id: scope.sessionId ?? null })
    .select("*")
    .single();
  if (createError) throw createError;
  return created;
}

export async function getCart(scope: CartScope) {
  const supabase = createServerSupabaseClient();
  const cart = await getOrCreateCart(scope);

  const { data, error } = await supabase
    .from("cart_items")
    .select("id,quantity,product_id,variant_id,products(*)")
    .eq("cart_id", cart.id);
  if (error) throw error;

  return { cart, items: data ?? [] };
}

export async function upsertCartItem(payload: CartMutation) {
  const supabase = createServerSupabaseClient();
  const cart = await getOrCreateCart(payload);

  const { data: existing, error: existingError } = await supabase
    .from("cart_items")
    .select("*")
    .eq("cart_id", cart.id)
    .eq("product_id", payload.productId)
    .eq("variant_id", payload.variantId ?? null)
    .maybeSingle();

  if (existingError) throw existingError;

  if (existing) {
    const { data, error } = await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + payload.quantity })
      .eq("id", existing.id)
      .select("*")
      .single();
    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from("cart_items")
    .insert({
      cart_id: cart.id,
      product_id: payload.productId,
      variant_id: payload.variantId ?? null,
      quantity: payload.quantity
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function removeCartItem(itemId: number) {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from("cart_items").delete().eq("id", itemId);
  if (error) throw error;
}
