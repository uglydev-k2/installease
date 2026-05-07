"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/store/cart-store";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.total());

  if (!items.length) {
    return (
      <div className="rounded-2xl border p-10 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-slate-500">Discover smart devices to start automating your home.</p>
        <Link href="/products" className="mt-4 inline-block">
          <Button>Back to Shop</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Cart</h1>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.product.id} className="flex items-center justify-between rounded-xl border p-4">
            <div>
              <p className="font-semibold">{item.product.name}</p>
              <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
            </div>
            <p className="font-semibold">${(item.product.salePrice ?? item.product.price) * item.quantity}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border p-4">
        <p className="flex justify-between">
          <span>Total</span>
          <span className="font-bold">${total.toFixed(2)}</span>
        </p>
      </div>
      <Link href="/checkout">
        <Button className="w-full md:w-auto">Proceed to Checkout</Button>
      </Link>
    </div>
  );
}
