import { createOrder, listOrders } from "@/lib/server/repositories/orders-repo";
import { createOrderSchema } from "@/lib/server/validators";

export async function fetchOrders(userId?: string) {
  return listOrders(userId);
}

export async function placeOrder(body: unknown) {
  const payload = createOrderSchema.parse(body);
  return createOrder(payload);
}
