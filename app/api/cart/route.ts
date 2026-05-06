import { NextRequest } from "next/server";
import { handleRouteError, ok } from "@/lib/server/http";
import { addToCart, deleteCartItem, fetchCart } from "@/lib/server/services/cart-service";

export async function GET(request: NextRequest) {
  try {
    const data = await fetchCart(request.nextUrl.searchParams);
    return ok(data);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await addToCart(body);
    return ok(data, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const data = await deleteCartItem(request.nextUrl.searchParams);
    return ok(data);
  } catch (error) {
    return handleRouteError(error);
  }
}
