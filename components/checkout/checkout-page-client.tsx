"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PaystackCheckoutFlow } from "@/components/checkout/paystack-checkout-flow";
import { MobileOrderSummaryAccordion, OrderSummaryPanel, type PromoState } from "@/components/checkout/order-summary-panel";
import { useInitialSession } from "@/components/providers/auth-session-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CURRENCY_SYMBOL,
  DELIVERY_OPTIONS,
  VAT_RATE,
  estimateDeliveryRange,
  shippingForMethod,
  type DeliveryMethodId
} from "@/lib/checkout/constants";
import { buildShippingAddress, deliveryStepSchema, type DeliveryFormValues } from "@/lib/checkout/delivery-schema";
import { formatVariantLabel, lineImageUrl, lineUnitPrice } from "@/lib/checkout/cart-line";
import { useCartStore, type CartItem } from "@/lib/store/cart-store";

const paystackConfigured = Boolean(process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY);

function StepIndicator({ step }: { step: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: "Delivery" },
    { n: 2, label: "Payment" },
    { n: 3, label: "Review" }
  ];
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between gap-2">
        {steps.map((s, idx) => {
          const done = step > s.n;
          const current = step === s.n;
          return (
            <div key={s.n} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition",
                    done && "border-[#16A34A] bg-[#16A34A] text-white",
                    current && !done && "border-[#0F172A] bg-[#0F172A] text-white",
                    !done && !current && "border-[#E5E7EB] bg-white text-[#9CA3AF]"
                  )}
                >
                  {done ? <Check className="h-5 w-5" /> : s.n}
                </div>
                <span className="hidden text-xs font-semibold text-[#6B7280] sm:block">{s.label}</span>
              </div>
              {idx < steps.length - 1 ? (
                <div className="mx-1 h-0.5 flex-1 rounded-full" style={{ background: step > s.n ? "#16A34A" : "#E5E7EB" }} />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function CheckoutPageClient() {
  const session = useInitialSession();
  const items = useCartStore((s) => s.items);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [phonePrefix, setPhonePrefix] = useState("+233");
  const [promo, setPromo] = useState<PromoState>({ status: "idle" });
  const [promoDraft, setPromoDraft] = useState("");
  const [promoExpanded, setPromoExpanded] = useState(false);
  const [placing, setPlacing] = useState(false);

  const deliveryForm = useForm<DeliveryFormValues>({
    resolver: zodResolver(deliveryStepSchema),
    mode: "onBlur",
    defaultValues: {
      email: session?.user?.email ?? "",
      phoneLocal: "",
      fullName: "",
      line1: "",
      line2: "",
      city: "",
      region: "Greater Accra",
      country: "Ghana",
      deliveryMethod: "standard"
    }
  });

  const { register, handleSubmit, watch, formState: { errors } } = deliveryForm;
  const deliveryMethod = watch("deliveryMethod") as DeliveryMethodId;

  const subtotal = useMemo(
    () => items.reduce((sum, { product, quantity }) => sum + lineUnitPrice(product) * quantity, 0),
    [items]
  );

  const discount = promo.status === "applied" ? promo.discount : 0;
  const { amount: shippingAmount, label: shippingLabel } = shippingForMethod(deliveryMethod, subtotal);
  const tax = Math.round(subtotal * VAT_RATE * 100) / 100;
  const total = Math.max(0, subtotal + shippingAmount + tax - discount);

  const summaryProps = {
    items,
    itemCount: items.reduce((n, i) => n + i.quantity, 0),
    subtotal,
    shippingAmount,
    shippingLabel: shippingAmount > 0 ? `${CURRENCY_SYMBOL}${shippingAmount.toFixed(2)}` : shippingLabel,
    tax,
    discount,
    total,
    promo,
    promoDraft,
    setPromoDraft,
    onApplyPromo: async () => {
      const code = promoDraft.trim();
      if (!code) return;
      try {
        const res = await fetch("/api/promo/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, subtotal })
        });
        const body = (await res.json()) as { valid?: boolean; discount?: number; code?: string; message?: string };
        if (body.valid && typeof body.discount === "number" && body.code) {
          setPromo({ status: "applied", code: body.code, discount: body.discount });
          toast.success(body.message ?? "Promo applied");
        } else {
          setPromo({ status: "error", message: body.message ?? "Invalid or expired code" });
        }
      } catch {
        setPromo({ status: "error", message: "Could not validate code." });
      }
    },
    onRemovePromo: () => {
      setPromo({ status: "idle" });
      setPromoDraft("");
    },
    promoExpanded,
    setPromoExpanded
  };

  const onDeliveryContinue = handleSubmit(() => {
    setStep(2);
  });

  const phoneE164 = `${phonePrefix.replace(/\s/g, "")}${watch("phoneLocal").replace(/\s/g, "")}`;
  const deliveryValues = deliveryForm.watch();

  const cartPayload = useMemo(() => {
    const vals = deliveryValues;
    const shippingAddress = {
      ...buildShippingAddress(vals, phoneE164),
      delivery_method: vals.deliveryMethod,
      delivery_estimate: estimateDeliveryRange(vals.deliveryMethod)
    };
    const cartItems = items.map(({ product, quantity }) => {
      const img = lineImageUrl(product);
      return {
        productId: (product.databaseId ?? product.id) as string | number,
        quantity,
        price: lineUnitPrice(product),
        name: product.name,
        slug: product.slug,
        ...(img ? { imageUrl: img } : {}),
        variantSummary: formatVariantLabel(product)
      };
    });
    return { cartItems, shippingAddress };
  }, [deliveryValues, items, phoneE164]);

  if (!items.length) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border border-[#E5E7EB] bg-white p-10 text-center">
        <p className="text-lg font-semibold text-[#0F172A]">Your cart is empty</p>
        <Link href="/products" className="mt-4 inline-block rounded-full bg-[#0F172A] px-6 py-2 text-sm font-semibold text-white">
          Continue shopping
        </Link>
      </div>
    );
  }

  const showPaystack = step >= 2 && paystackConfigured;

  return (
    <div className="min-h-[80vh]" style={{ background: "#FAFAFA" }}>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-2 text-2xl font-bold text-[#0F172A] md:text-3xl">Checkout</h1>
        <p className="mb-8 text-sm text-[#6B7280]">Complete your order in three quick steps.</p>

        <MobileOrderSummaryAccordion {...summaryProps} />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,1fr)]">
          <div className="space-y-8">
            <StepIndicator step={step} />

            {step === 1 ? (
              <form onSubmit={onDeliveryContinue} className="space-y-8 rounded-xl border border-[#E5E7EB] bg-white p-6 md:p-8">
                <section className="space-y-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#6B7280]">Contact</p>
                  <div>
                    <label className="text-sm font-medium text-[#374151]">Email address</label>
                    <input type="email" {...register("email")} className="mt-2 w-full text-sm" />
                    {errors.email ? <p className="mt-1 text-xs text-[#DC2626]">{errors.email.message}</p> : null}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#374151]">Phone number</label>
                    <div className="mt-2 flex gap-2">
                      <select
                        value={phonePrefix}
                        onChange={(e) => setPhonePrefix(e.target.value)}
                        className="w-28 shrink-0 text-sm"
                      >
                        <option value="+233">+233</option>
                      </select>
                      <input
                        {...register("phoneLocal")}
                        placeholder="24 000 0000"
                        className="min-w-0 flex-1 text-sm"
                      />
                    </div>
                    {errors.phoneLocal ? <p className="mt-1 text-xs text-[#DC2626]">{errors.phoneLocal.message}</p> : null}
                  </div>
                </section>

                <section className="space-y-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#6B7280]">Shipping address</p>
                  <div>
                    <label className="text-sm font-medium text-[#374151]">Full name</label>
                    <input {...register("fullName")} className="mt-2 w-full text-sm" />
                    {errors.fullName ? <p className="mt-1 text-xs text-[#DC2626]">{errors.fullName.message}</p> : null}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#374151]">Address line 1</label>
                    <input {...register("line1")} className="mt-2 w-full text-sm" />
                    {errors.line1 ? <p className="mt-1 text-xs text-[#DC2626]">{errors.line1.message}</p> : null}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#374151]">Address line 2 (optional)</label>
                    <input {...register("line2")} placeholder="Apartment, suite, etc." className="mt-2 w-full text-sm" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-[#374151]">City</label>
                      <input {...register("city")} className="mt-2 w-full text-sm" />
                      {errors.city ? <p className="mt-1 text-xs text-[#DC2626]">{errors.city.message}</p> : null}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[#374151]">Region / State</label>
                      <select {...register("region")} className="mt-2 w-full text-sm">
                        {["Greater Accra", "Ashanti", "Western", "Eastern", "Central", "Northern", "Volta", "Brong-Ahafo", "Upper East", "Upper West"].map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                      {errors.region ? <p className="mt-1 text-xs text-[#DC2626]">{errors.region.message}</p> : null}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#374151]">Country</label>
                    <select {...register("country")} className="mt-2 w-full text-sm">
                      <option>Ghana</option>
                    </select>
                  </div>
                </section>

                <section className="space-y-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#6B7280]">Delivery method</p>
                  <div className="space-y-3">
                    {DELIVERY_OPTIONS.map((opt) => {
                      const selected = deliveryMethod === opt.id;
                      const ship = shippingForMethod(opt.id, subtotal);
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => deliveryForm.setValue("deliveryMethod", opt.id, { shouldValidate: true })}
                          className={cn(
                            "flex w-full items-start gap-3 rounded-xl border p-4 text-left transition",
                            selected ? "border-[#0F172A] ring-1 ring-[#0F172A]" : "border-[#E5E7EB] hover:border-[#CBD5E1]"
                          )}
                        >
                          <span
                            className={cn(
                              "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                              selected ? "border-[#0F172A] bg-[#0F172A]" : "border-[#D1D5DB]"
                            )}
                          >
                            {selected ? <Check className="h-3 w-3 text-white" /> : null}
                          </span>
                          <span className="flex-1">
                            <span className="block font-semibold text-[#0F172A]">{opt.title}</span>
                            <span className="mt-1 block text-sm text-[#6B7280]">{opt.description}</span>
                            <span className="mt-2 block text-sm font-medium text-[#374151]">
                              {opt.id === "standard" && ship.amount === 0 ? "Free" : `${CURRENCY_SYMBOL}${opt.flatFee.toFixed(2)}`}
                              {opt.id === "standard" && opt.freeOver ? ` · Free over ${CURRENCY_SYMBOL}${opt.freeOver}` : null}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {errors.deliveryMethod ? <p className="text-xs text-[#DC2626]">{errors.deliveryMethod.message}</p> : null}
                </section>

                <Button type="submit" className="h-12 w-full rounded-full bg-[#0F172A] text-base font-semibold text-white hover:opacity-90">
                  Continue to Payment
                </Button>
              </form>
            ) : null}

            {step >= 2 && !paystackConfigured ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
                Add <code className="font-mono">NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY</code> and{" "}
                <code className="font-mono">PAYSTACK_SECRET_KEY</code> to enable checkout payments.
              </div>
            ) : null}

            {showPaystack ? (
              <PaystackCheckoutFlow
                step={step}
                setStep={setStep}
                items={items}
                delivery={deliveryValues}
                phoneE164={phoneE164}
                subtotal={subtotal}
                shippingAmount={shippingAmount}
                tax={tax}
                discount={discount}
                total={total}
                userId={session?.user?.id}
                cartPayload={cartPayload}
                placing={placing}
                setPlacing={setPlacing}
              />
            ) : null}
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-28">
              <OrderSummaryPanel {...summaryProps} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
