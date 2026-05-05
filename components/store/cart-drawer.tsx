"use client";

import Link from "next/link";
import { useState } from "react";
import { X } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { Button } from "@/components/ui/button";

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.total());

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Cart ({items.length})
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 bg-black/40">
          <aside className="ml-auto h-full w-full max-w-md bg-white p-5 shadow-lg dark:bg-slate-950">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Your Cart</h3>
              <button onClick={() => setOpen(false)} aria-label="Close cart">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.product.id} className="rounded-xl border p-3">
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-3 border-t pt-4">
              <p className="flex justify-between font-semibold">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </p>
              <Link href="/cart" onClick={() => setOpen(false)}>
                <Button className="w-full">Go to Checkout</Button>
              </Link>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
