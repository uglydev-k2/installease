import { CURRENCY_SYMBOL } from "@/lib/checkout/constants";

export type CheckoutSuccessSession = {
  orderId: number;
  orderRef: string;
  firstName: string;
  email: string;
  deliveryEstimate: string;
  lines: { image?: string; name: string; quantity: number }[];
  total: number;
  currency: string;
};

export function buildCheckoutSuccessSession(order: {
  id: number;
  items: unknown;
  shipping_address: unknown;
  total: number | string;
}): CheckoutSuccessSession {
  const ship = (order.shipping_address ?? {}) as Record<string, string>;
  const rawItems = Array.isArray(order.items) ? order.items : [];
  const lines = rawItems.map((row: Record<string, unknown>) => ({
    image: typeof row.imageUrl === "string" ? row.imageUrl : undefined,
    name: typeof row.name === "string" ? row.name : "Item",
    quantity: typeof row.quantity === "number" ? row.quantity : 1
  }));
  const year = new Date().getFullYear();
  const orderRef = `ORD-${year}-${String(order.id).padStart(4, "0")}`;
  const fullName = ship.full_name ?? "";
  const firstName = fullName.trim().split(/\s+/)[0] || "there";
  const email = ship.email ?? "";
  const deliveryEstimate =
    typeof ship.delivery_estimate === "string" ? ship.delivery_estimate : "We will email you with delivery updates.";
  const total = typeof order.total === "string" ? parseFloat(order.total) : order.total;

  return {
    orderId: order.id,
    orderRef,
    firstName,
    email,
    deliveryEstimate,
    lines,
    total: Number.isFinite(total) ? total : 0,
    currency: CURRENCY_SYMBOL
  };
}
