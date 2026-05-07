"use client";

import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { CartLineThumb } from "@/components/checkout/cart-line-thumb";
import { useCartStore } from "@/lib/store/cart-store";
import { Button } from "@/components/ui/button";
import { CURRENCY_SYMBOL } from "@/lib/checkout/constants";
import { formatVariantLabel, lineImageUrl, lineUnitPrice } from "@/lib/checkout/cart-line";

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.total());
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Cart ({items.reduce((n, i) => n + i.quantity, 0)})
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setOpen(false)}>
          <aside
            className="ml-auto flex h-full w-full max-w-md flex-col border-l border-[#E5E7EB] bg-white shadow-2xl"
            style={{ background: "#FFFFFF" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
              <h3 className="text-lg font-bold text-[#0F172A]">Your cart</h3>
              <button onClick={() => setOpen(false)} aria-label="Close cart" className="rounded-full p-2 hover:bg-[#F3F4F6]">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <p className="text-center text-sm text-[#6B7280]">Your cart is empty.</p>
              ) : (
                items.map((item) => {
                  const img = lineImageUrl(item.product);
                  const variant = formatVariantLabel(item.product);
                  const unit = lineUnitPrice(item.product);
                  return (
                    <div key={item.product.id} className="flex gap-3 rounded-xl border border-[#E5E7EB] p-3">
                      <CartLineThumb imageUrl={img} name={item.product.name} quantity={item.quantity} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-[#0F172A]">{item.product.name}</p>
                        {variant ? <p className="mt-0.5 text-xs text-[#6B7280]">{variant}</p> : null}
                        <div className="mt-3 flex items-center gap-2">
                          <button
                            type="button"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB]"
                            aria-label="Decrease quantity"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                          <button
                            type="button"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB]"
                            aria-label="Increase quantity"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            className="ml-auto rounded-lg p-2 text-[#9CA3AF] hover:bg-red-50 hover:text-[#DC2626]"
                            aria-label="Remove item"
                            onClick={() => removeItem(item.product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="shrink-0 text-sm font-bold text-[#0F172A]">
                        {CURRENCY_SYMBOL}
                        {(unit * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
            <div className="border-t border-[#E5E7EB] bg-[#FAFAFA] px-5 py-4">
              <div className="mb-4 flex justify-between text-sm font-semibold text-[#0F172A]">
                <span>Subtotal</span>
                <span>
                  {CURRENCY_SYMBOL}
                  {total.toFixed(2)}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <Link href="/checkout" onClick={() => setOpen(false)}>
                  <Button className="h-12 w-full rounded-full bg-[#0F172A] font-semibold text-white">Proceed to Checkout</Button>
                </Link>
                <Link href="/cart" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="h-12 w-full rounded-full border-[#0F172A] font-semibold text-[#0F172A]">
                    View Cart
                  </Button>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
