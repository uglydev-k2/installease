"use client";

import { useRef } from "react";
import PaystackPop from "@paystack/inline-js";
import { Building2, CreditCard, Hash, Loader2, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CURRENCY_SYMBOL, DELIVERY_OPTIONS, estimateDeliveryRange } from "@/lib/checkout/constants";
import { lineImageUrl, lineUnitPrice } from "@/lib/checkout/cart-line";
import { useCartStore, type CartItem } from "@/lib/store/cart-store";
import type { DeliveryFormValues } from "@/lib/checkout/delivery-schema";

function PaymentMethodCards() {
  const cardClass =
    "flex flex-col gap-3 rounded-xl border border-[#E5E7EB] bg-white p-4 text-left shadow-sm transition hover:border-[#CBD5E1]";
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className={cardClass}>
        <div className="flex items-center gap-2 text-[#0F172A]">
          <Smartphone className="h-6 w-6 shrink-0" aria-hidden />
          <span className="text-sm font-bold">Mobile Money</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#374151]">
          <span className="rounded-md bg-[#FFCC00] px-2 py-1 text-[#000]">MTN</span>
          <span className="rounded-md bg-[#E60000] px-2 py-1 text-white">Vodafone</span>
          <span className="rounded-md bg-[#0066CC] px-2 py-1 text-white">AirtelTigo</span>
        </div>
        <p className="text-xs text-[#6B7280]">Pay with your mobile wallet</p>
      </div>
      <div className={cardClass}>
        <div className="flex items-center gap-2 text-[#0F172A]">
          <CreditCard className="h-6 w-6 shrink-0" aria-hidden />
          <span className="text-sm font-bold">Card Payment</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded border border-[#1A1F71] bg-white px-2 py-0.5 text-[10px] font-black tracking-tight text-[#1A1F71]">VISA</span>
          <span className="rounded border border-[#EB001B] bg-white px-2 py-0.5 text-[10px] font-black text-[#EB001B]">MC</span>
        </div>
        <p className="text-xs text-[#6B7280]">Credit or debit card</p>
      </div>
      <div className={cardClass}>
        <div className="flex items-center gap-2 text-[#0F172A]">
          <Building2 className="h-6 w-6 shrink-0" aria-hidden />
          <span className="text-sm font-bold">Bank Transfer</span>
        </div>
        <p className="text-xs text-[#6B7280]">Direct bank transfer</p>
      </div>
      <div className={cardClass}>
        <div className="flex items-center gap-2 text-[#0F172A]">
          <Hash className="h-6 w-6 shrink-0" aria-hidden />
          <span className="text-sm font-bold">USSD</span>
        </div>
        <p className="text-xs text-[#6B7280]">Pay via USSD code</p>
      </div>
    </div>
  );
}

export type PaystackCheckoutFlowProps = {
  step: 1 | 2 | 3;
  setStep: (s: 1 | 2 | 3) => void;
  items: CartItem[];
  delivery: DeliveryFormValues;
  phoneE164: string;
  subtotal: number;
  shippingAmount: number;
  tax: number;
  discount: number;
  total: number;
  userId?: string;
  cartPayload: {
    cartItems: Record<string, unknown>[];
    shippingAddress: Record<string, unknown>;
  };
  placing: boolean;
  setPlacing: (v: boolean) => void;
};

export function PaystackCheckoutFlow({
  step,
  setStep,
  items,
  delivery,
  phoneE164,
  subtotal,
  shippingAmount,
  tax,
  discount,
  total,
  userId,
  cartPayload,
  placing,
  setPlacing
}: PaystackCheckoutFlowProps) {
  const router = useRouter();
  const clearCart = useCartStore((s) => s.clearCart);
  const placedRef = useRef(false);

  const openPaystack = async () => {
    if (placedRef.current) return;

    setPlacing(true);
    try {
      const initRes = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: delivery.email,
          amount: total,
          cartItems: cartPayload.cartItems,
          shippingAddress: cartPayload.shippingAddress,
          userId,
          subtotal,
          shippingCost: shippingAmount,
          tax,
          discount,
          total
        })
      });
      const initBody = (await initRes.json()) as { accessCode?: string; error?: string };
      if (!initRes.ok || !initBody.accessCode) {
        throw new Error(initBody.error ?? "Could not start payment.");
      }

      const paystack = new PaystackPop();
      paystack.resumeTransaction(initBody.accessCode, {
        async onSuccess(transaction) {
          const ref = transaction.reference;
          try {
            const res = await fetch(`/api/paystack/verify?reference=${encodeURIComponent(ref)}`);
            const body = (await res.json()) as {
              success?: boolean;
              error?: string;
              sessionPayload?: Record<string, unknown>;
            };
            if (!res.ok || !body.success || !body.sessionPayload) {
              throw new Error(body.error ?? "Verification failed.");
            }
            placedRef.current = true;
            try {
              sessionStorage.setItem("installease_checkout_success", JSON.stringify(body.sessionPayload));
            } catch {
              /* ignore */
            }
            clearCart();
            router.push("/checkout/success");
          } catch (e) {
            placedRef.current = false;
            toast.error(e instanceof Error ? e.message : "Could not verify payment.");
          }
        },
        onCancel() {
          toast.error("Payment cancelled.");
        },
        onError(err: { message?: string }) {
          toast.error(err?.message ?? "Payment could not load.");
        }
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Payment setup failed.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <>
      <div
        className={cn(
          "rounded-xl border border-[#E5E7EB] bg-white p-6 md:p-8",
          step === 3 &&
            "pointer-events-none fixed left-0 top-0 z-0 h-[460px] w-[min(100%,480px)] max-w-[480px] -translate-x-[120vw] opacity-0"
        )}
        aria-hidden={step === 3}
      >
        <div>
          <h2 className="text-xl font-bold text-[#0F172A]">Payment</h2>
          <p className="mt-1 text-sm text-[#6B7280]">
            Choose how you&apos;d like to pay. You&apos;ll complete payment securely in the Paystack window.
          </p>
        </div>
        <div className="mt-6">
          <PaymentMethodCards />
        </div>
        <div className="mt-8 flex flex-col gap-4 border-t border-[#E5E7EB] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" className="text-sm font-semibold text-[#0F172A] underline-offset-2 hover:underline" onClick={() => setStep(1)}>
            ← Back to Delivery
          </button>
          <Button type="button" className="rounded-full bg-[#0F172A] px-6" onClick={() => setStep(3)}>
            Review Order →
          </Button>
        </div>
      </div>

      {step === 3 ? (
        <div className="space-y-8 rounded-xl border border-[#E5E7EB] bg-white p-6 md:p-8">
          <h2 className="text-xl font-bold text-[#0F172A]">Review &amp; pay</h2>

          <div className="space-y-6 text-sm">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wide text-[#6B7280]">Delivery to</p>
                <button type="button" className="text-xs font-semibold text-[#0F172A] underline" onClick={() => setStep(1)}>
                  Edit
                </button>
              </div>
              <div className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-4 text-[#374151]">
                <p className="font-semibold text-[#0F172A]">{delivery.fullName}</p>
                <p className="mt-1">
                  {delivery.line1}
                  {delivery.line2 ? `, ${delivery.line2}` : ""}
                </p>
                <p>
                  {delivery.city}, {delivery.region}
                </p>
                <p>{delivery.country}</p>
                <p className="mt-2 text-[#6B7280]">{phoneE164}</p>
                <p className="mt-2 font-medium text-[#0F172A]">
                  {DELIVERY_OPTIONS.find((o) => o.id === delivery.deliveryMethod)?.title} ·{" "}
                  {estimateDeliveryRange(delivery.deliveryMethod)}
                </p>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wide text-[#6B7280]">Payment</p>
                <button type="button" className="text-xs font-semibold text-[#0F172A] underline" onClick={() => setStep(2)}>
                  Edit
                </button>
              </div>
              <div className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-4 text-[#374151]">
                <p className="font-medium text-[#0F172A]">Paystack</p>
                <p className="mt-1 text-xs text-[#6B7280]">Card, Mobile Money, bank transfer, or USSD — you&apos;ll pick in the secure Paystack window.</p>
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[#6B7280]">Items</p>
              <ul className="space-y-3">
                {items.map(({ product, quantity }) => (
                  <li key={product.id} className="flex gap-3">
                    <div className="relative h-[60px] w-[60px] shrink-0 overflow-hidden rounded-lg bg-[#F3F4F6]">
                      {lineImageUrl(product) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={lineImageUrl(product)} alt="" className="h-full w-full object-cover" />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{product.name}</p>
                      <p className="text-xs text-[#6B7280]">Qty {quantity}</p>
                    </div>
                    <p className="font-semibold">
                      {CURRENCY_SYMBOL}
                      {(lineUnitPrice(product) * quantity).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] p-4 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>
                  {CURRENCY_SYMBOL}
                  {subtotal.toFixed(2)}
                </span>
              </div>
              <div className="mt-2 flex justify-between">
                <span>Shipping</span>
                <span>
                  {CURRENCY_SYMBOL}
                  {shippingAmount.toFixed(2)}
                </span>
              </div>
              <div className="mt-2 flex justify-between">
                <span>Tax</span>
                <span>
                  {CURRENCY_SYMBOL}
                  {tax.toFixed(2)}
                </span>
              </div>
              {discount > 0 ? (
                <div className="mt-2 flex justify-between text-[#16A34A]">
                  <span>Discount</span>
                  <span>
                    −{CURRENCY_SYMBOL}
                    {discount.toFixed(2)}
                  </span>
                </div>
              ) : null}
              <div className="mt-3 flex justify-between border-t border-[#E5E7EB] pt-3 text-base font-bold">
                <span>Total</span>
                <span>
                  {CURRENCY_SYMBOL}
                  {total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-[#6B7280]">
            By paying you agree to our Terms of Service and Privacy Policy.
          </p>

          <button
            type="button"
            disabled={placing || placedRef.current}
            onClick={() => void openPaystack()}
            className="flex h-14 w-full flex-col items-center justify-center gap-1 rounded-full bg-[#16A34A] text-base font-bold text-white transition hover:bg-[#15803d] disabled:opacity-60"
          >
            {placing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Opening Paystack…</span>
              </>
            ) : (
              <>
                <span>
                  Pay {CURRENCY_SYMBOL}
                  {total.toFixed(2)}
                </span>
                <span className="text-xs font-normal opacity-90">Card · Mobile Money · Bank · USSD</span>
              </>
            )}
          </button>

          <p className="text-center text-xs font-medium text-[#9CA3AF]">Powered by Paystack</p>
        </div>
      ) : null}
    </>
  );
}
