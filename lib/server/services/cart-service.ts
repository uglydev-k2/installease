import { getCart, removeCartItem, upsertCartItem } from "@/lib/server/repositories/cart-repo";
import { ApiError } from "@/lib/server/http";
import { cartMutationSchema } from "@/lib/server/validators";

export async function fetchCart(searchParams: URLSearchParams) {
  const userId = searchParams.get("userId") ?? undefined;
  const sessionId = searchParams.get("sessionId") ?? undefined;
  return getCart({ userId, sessionId });
}

export async function addToCart(body: unknown) {
  const payload = cartMutationSchema.parse(body);
  return upsertCartItem(payload);
}

export async function deleteCartItem(searchParams: URLSearchParams) {
  const itemId = Number(searchParams.get("itemId"));
  if (!itemId || Number.isNaN(itemId)) {
    throw new ApiError("itemId query parameter is required.", 400);
  }
  await removeCartItem(itemId);
  return { deleted: true, itemId };
}
