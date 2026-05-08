import type { SupabaseClient } from "@supabase/supabase-js";
import { createOrderSchema, orderLineItemSchema } from "@/lib/server/validators";
import type { z } from "zod";

type OrderLine = z.infer<typeof orderLineItemSchema>;

function numericProductId(line: OrderLine): number | null {
  if (typeof line.productId === "number" && Number.isFinite(line.productId)) {
    return line.productId;
  }
  if (typeof line.productId === "string" && /^\d+$/.test(line.productId)) {
    return parseInt(line.productId, 10);
  }
  return null;
}

export type PaystackOrderMetadata = {
  user_id?: string;
  items_json: string;
  shipping_json: string;
  subtotal: string;
  shipping_cost: string;
  tax: string;
  discount: string;
  total: string;
};

export function parsePaystackMetadata(raw: Record<string, unknown> | null | undefined): PaystackOrderMetadata | null {
  if (!raw || typeof raw !== "object") return null;
  const get = (k: string) => (typeof raw[k] === "string" ? (raw[k] as string) : null);
  let items_json = get("items_json");
  let shipping_json = get("shipping_json");
  if (!items_json || !shipping_json) {
    const cf = raw.custom_fields;
    if (Array.isArray(cf)) {
      for (const row of cf) {
        if (row && typeof row === "object" && "variable_name" in row && "value" in row) {
          const vn = (row as { variable_name?: string }).variable_name;
          const val = (row as { value?: string }).value;
          if (vn === "cart_items" && typeof val === "string" && !items_json) items_json = val;
        }
      }
    }
  }
  const subtotal = get("subtotal");
  const shipping_cost = get("shipping_cost");
  const tax = get("tax");
  const discount = get("discount");
  const total = get("total");
  if (!items_json || !shipping_json || !subtotal || !shipping_cost || !tax || !discount || !total) return null;
  return {
    user_id: get("user_id") ?? undefined,
    items_json,
    shipping_json,
    subtotal,
    shipping_cost,
    tax,
    discount,
    total
  };
}

export async function findOrderByPaymentReference(supabase: SupabaseClient, reference: string) {
  const { data, error } = await supabase.from("orders").select("*").eq("payment_reference", reference).maybeSingle();
  if (error) throw error;
  return data;
}

/**
 * Persists a paid order after Paystack verification. Idempotent on payment_reference.
 */
export async function insertPaystackPaidOrder(
  supabase: SupabaseClient,
  params: {
    reference: string;
    channel: string;
    amountPesewas: number;
    metadata: PaystackOrderMetadata;
  }
) {
  const existing = await findOrderByPaymentReference(supabase, params.reference);
  if (existing) return existing;

  let items: OrderLine[];
  let shippingAddress: Record<string, unknown>;
  try {
    items = JSON.parse(params.metadata.items_json) as OrderLine[];
    shippingAddress = JSON.parse(params.metadata.shipping_json) as Record<string, unknown>;
  } catch {
    throw new Error("Invalid order metadata.");
  }

  const parsed = createOrderSchema.safeParse({
    userId:
      params.metadata.user_id && params.metadata.user_id.length > 0 ? params.metadata.user_id : undefined,
    shippingAddress,
    items,
    shippingCost: Number(params.metadata.shipping_cost),
    discount: Number(params.metadata.discount),
    tax: Number(params.metadata.tax),
    paymentReference: params.reference
  });
  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  const subtotal = Number(params.metadata.subtotal);
  const shippingCost = Number(params.metadata.shipping_cost);
  const tax = Number(params.metadata.tax);
  const discount = Number(params.metadata.discount);
  const totalFromMeta = Number(params.metadata.total);
  const expectedPesewas = Math.round(totalFromMeta * 100);
  if (Math.abs(expectedPesewas - params.amountPesewas) > 1) {
    throw new Error("Amount mismatch for this order.");
  }

  const payload = parsed.data;
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
      status: "confirmed",
      items: itemsJson,
      shipping_address: payload.shippingAddress,
      subtotal,
      shipping_cost: shippingCost,
      discount,
      tax,
      total: totalFromMeta,
      stripe_payment_intent: null,
      payment_reference: params.reference,
      payment_method: params.channel,
      payment_channel: params.channel
    })
    .select("*")
    .single();

  if (orderError) {
    if (orderError.code === "23505") {
      const again = await findOrderByPaymentReference(supabase, params.reference);
      if (again) return again;
    }
    throw orderError;
  }

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

  await decrementStockForOrderItems(supabase, payload.items);

  return order;
}

export async function decrementStockForOrderItems(supabase: SupabaseClient, items: OrderLine[]) {
  for (const item of items) {
    const pid = numericProductId(item);
    if (pid == null) continue;
    const { data: row, error: selErr } = await supabase.from("products").select("stock").eq("id", pid).maybeSingle();
    if (selErr || !row) continue;
    const next = Math.max(0, (row.stock as number) - item.quantity);
    await supabase.from("products").update({ stock: next }).eq("id", pid);
  }
}
