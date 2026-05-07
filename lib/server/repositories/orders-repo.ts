import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { z } from "zod";
import type { createOrderSchema } from "@/lib/server/validators";

type OrderLine = z.infer<typeof createOrderSchema>["items"][number];

interface CreateOrderInput {
  userId?: string;
  shippingAddress: Record<string, unknown>;
  items: OrderLine[];
  shippingCost: number;
  discount: number;
  tax: number;
  stripePaymentIntent?: string;
}

function numericProductId(line: OrderLine): number | null {
  if (typeof line.productId === "number" && Number.isFinite(line.productId)) {
    return line.productId;
  }
  if (typeof line.productId === "string" && /^\d+$/.test(line.productId)) {
    return parseInt(line.productId, 10);
  }
  return null;
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

  const itemsJson = payload.items.map((item) => ({
    productId: item.productId,
    variantId: item.variantId ?? null,
    quantity: item.quantity,
    price: item.price,
    name: item.name,
    slug: item.slug,
    imageUrl: item.imageUrl,
    variantSummary: item.variantSummary
  }));

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: payload.userId ?? null,
      status: "placed",
      items: itemsJson,
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

  const orderItemsToInsert = payload.items
    .map((item) => {
      const pid = numericProductId(item);
      if (pid == null) return null;
      return {
        order_id: order.id,
        product_id: pid,
        variant_id: item.variantId ?? null,
        quantity: item.quantity,
        price: item.price
      };
    })
    .filter((row): row is NonNullable<typeof row> => row != null);

  if (orderItemsToInsert.length > 0) {
    const { error: itemsError } = await supabase.from("order_items").insert(orderItemsToInsert);
    if (itemsError) throw itemsError;
  }

  return order;
}
