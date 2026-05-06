import { createServerSupabaseClient } from "@/lib/supabase/server";

interface CreateOrderInput {
  userId?: string;
  shippingAddress: Record<string, unknown>;
  items: Array<{ productId: number; variantId?: number; quantity: number; price: number }>;
  shippingCost: number;
  discount: number;
  tax: number;
  stripePaymentIntent?: string;
}

export async function listOrders(userId?: string) {
  const supabase = createServerSupabaseClient();
  let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (userId) query = query.eq("user_id", userId);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function createOrder(payload: CreateOrderInput) {
  const supabase = createServerSupabaseClient();

  const subtotal = payload.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + payload.shippingCost + payload.tax - payload.discount;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: payload.userId ?? null,
      status: "placed",
      items: payload.items,
      shipping_address: payload.shippingAddress,
      subtotal,
      shipping_cost: payload.shippingCost,
      discount: payload.discount,
      tax: payload.tax,
      total,
      stripe_payment_intent: payload.stripePaymentIntent ?? null
    })
    .select("*")
    .single();

  if (orderError) throw orderError;

  const orderItems = payload.items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    variant_id: item.variantId ?? null,
    quantity: item.quantity,
    price: item.price
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
  if (itemsError) throw itemsError;

  return order;
}
