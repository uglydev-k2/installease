"use client";

import { useState } from "react";
import { ChevronDown, Lock, Shield } from "lucide-react";
import { CartLineThumb } from "@/components/checkout/cart-line-thumb";
import type { CartItem } from "@/lib/store/cart-store";
import { CURRENCY_SYMBOL } from "@/lib/checkout/constants";
import { formatVariantLabel, lineImageUrl, lineUnitPrice } from "@/lib/checkout/cart-line";
import { cn } from "@/lib/utils";

export type PromoState =
  | { status: "idle" }
  | { status: "applied"; code: string; discount: number }
  | { status: "error"; message: string };

type OrderSummaryPanelProps = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  shippingAmount: number;
  shippingLabel: string;
  tax: number;
  discount: number;
  total: number;
  promo: PromoState;
  promoDraft: string;
  setPromoDraft: (v: string) => void;
  onApplyPromo: () => void;
  onRemovePromo: () => void;
  promoExpanded: boolean;
  setPromoExpanded: (v: boolean) => void;
  className?: string;
};

export function OrderSummaryPanel({
  items,
  itemCount,
  subtotal,
  shippingAmount,
  shippingLabel,
  tax,
  discount,
  total,
  promo,
  promoDraft,
  setPromoDraft,
  onApplyPromo,
  onRemovePromo,
  promoExpanded,
  setPromoExpanded,
  className
}: OrderSummaryPanelProps) {
  return (
    <div className={cn("rounded-xl border bg-[#FFFFFF] p-6 shadow-sm", className)} style={{ borderColor: "#E5E7EB" }}>
      <div className="mb-6 flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-[#0F172A]">Order Summary</h2>
        <span
          className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
          style={{ background: "#F3F4F6", color: "#374151" }}
        >
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
      </div>

      <ul className="max-h-[360px] space-y-4 overflow-y-auto pr-1">
        {items.map(({ product, quantity }) => {
          const img = lineImageUrl(product);
          const unit = lineUnitPrice(product);
          const variant = formatVariantLabel(product);
          return (
            <li key={product.id} className="flex gap-3">
              <CartLineThumb imageUrl={img} name={product.name} quantity={quantity} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-[#0F172A]" style={{ fontWeight: 500 }}>
                  {product.name}
                </p>
                {variant ? <p className="mt-0.5 text-xs text-[#6B7280]">{variant}</p> : null}
              </div>
              <p className="shrink-0 font-semibold text-[#0F172A]">
                {CURRENCY_SYMBOL}
                {(unit * quantity).toFixed(2)}
              </p>
            </li>
          );
        })}
      </ul>

      <div className="my-6 h-px bg-[#E5E7EB]" />

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-[#374151]">
          <span>Subtotal</span>
          <span className="font-medium">
            {CURRENCY_SYMBOL}
            {subtotal.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-[#374151]">
          <span>Shipping</span>
          <span className="text-right font-medium">
            {shippingAmount > 0 ? (
              <>
                {CURRENCY_SYMBOL}
                {shippingAmount.toFixed(2)}
              </>
            ) : (
              <span className="text-[#6B7280]">{shippingLabel}</span>
            )}
          </span>
        </div>
        <div className="flex justify-between text-[#374151]">
          <span>Tax (15% VAT)</span>
          <span className="font-medium">
            {CURRENCY_SYMBOL}
            {tax.toFixed(2)}
          </span>
        </div>
        {discount > 0 ? (
          <div className="flex justify-between font-medium text-[#16A34A]">
            <span>Discount</span>
            <span>
              −{CURRENCY_SYMBOL}
              {discount.toFixed(2)}
            </span>
          </div>
        ) : null}
      </div>

      <div className="my-6 h-px bg-[#E5E7EB]" />

      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-[#374151]">Total</span>
        <span className="text-xl font-bold text-[#0F172A]">
          {CURRENCY_SYMBOL}
          {total.toFixed(2)}
        </span>
      </div>

      <div className="mt-6">
        {!promoExpanded ? (
          <button
            type="button"
            className="text-sm font-semibold text-[#0F172A] underline-offset-2 hover:underline"
            onClick={() => setPromoExpanded(true)}
          >
            Add promo code
          </button>
        ) : (
          <div className="space-y-2">
            {promo.status === "applied" ? (
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ background: "#DCFCE7", color: "#166534" }}
                >
                  {promo.code}
                  <button
                    type="button"
                    className="rounded-full px-1 hover:bg-green-200"
                    onClick={onRemovePromo}
                    aria-label="Remove promo"
                  >
                    ×
                  </button>
                </span>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  value={promoDraft}
                  onChange={(e) => setPromoDraft(e.target.value)}
                  placeholder="Enter code"
                  className="min-w-0 flex-1 text-sm"
                />
                <button
                  type="button"
                  className="shrink-0 rounded-full bg-[#0F172A] px-4 py-2 text-sm font-semibold text-white"
                  onClick={onApplyPromo}
                >
                  Apply
                </button>
              </div>
            )}
            {promo.status === "error" ? <p className="text-xs font-medium text-[#DC2626]">{promo.message}</p> : null}
            {promo.status === "applied" ? <p className="text-xs font-medium text-[#16A34A]">Promo applied to your order.</p> : null}
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-[#E5E7EB] pt-6 text-xs text-[#6B7280]">
        <span className="inline-flex items-center gap-1.5">
          <Lock className="h-3.5 w-3.5" />
          256-bit SSL encryption
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Shield className="h-3.5 w-3.5" />
          Secure checkout
        </span>
      </div>
    </div>
  );
}

export function MobileOrderSummaryAccordion(props: OrderSummaryPanelProps) {
  const [open, setOpen] = useState(true);
  return (
    <div className="mb-6 md:hidden">
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-left text-sm font-semibold text-[#0F172A]"
        onClick={() => setOpen((o) => !o)}
      >
        <span>Order summary</span>
        <ChevronDown className={cn("h-4 w-4 transition", open && "rotate-180")} />
      </button>
      {open ? (
        <div className="mt-2">
          <OrderSummaryPanel {...props} className="border-0 shadow-none" />
        </div>
      ) : null}
    </div>
  );
}
