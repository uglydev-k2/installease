"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CURRENCY_SYMBOL } from "@/lib/checkout/constants";

type SuccessPayload = {
  orderRef: string;
  firstName: string;
  email: string;
  deliveryEstimate: string;
  lines: { image?: string; name: string; quantity: number }[];
  total: number;
  currency: string;
};

export default function CheckoutSuccessPage() {
  const [data, setData] = useState<SuccessPayload | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("installease_checkout_success");
      if (raw) setData(JSON.parse(raw) as SuccessPayload);
    } catch {
      setData(null);
    }
  }, []);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
      <div className="checkout-success-check mb-8">
        <svg viewBox="0 0 64 64" className="mx-auto h-24 w-24" aria-hidden>
          <circle className="checkout-success-circle" cx="32" cy="32" r="28" fill="none" stroke="#16A34A" strokeWidth="3" />
          <path className="checkout-success-tick" fill="none" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M18 34l10 10 18-22" />
        </svg>
      </div>

      <h1 className="font-serif text-3xl font-bold text-[#0F172A] md:text-4xl">Order Confirmed!</h1>
      <p className="mt-3 text-lg text-[#6B7280]">
        Thank you{data?.firstName ? `, ${data.firstName}` : ""} — we&apos;re on it.
      </p>

      {data?.orderRef ? (
        <span className="mt-6 inline-flex rounded-full border border-[#E5E7EB] bg-white px-4 py-1.5 text-sm font-semibold text-[#0F172A]">
          Order #{data.orderRef}
        </span>
      ) : null}

      {data?.deliveryEstimate ? (
        <p className="mt-4 text-sm text-[#374151]">
          Estimated delivery: <span className="font-semibold">{data.deliveryEstimate}</span>
        </p>
      ) : null}

      {data?.lines?.length ? (
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {data.lines.map((line, i) => (
            <div key={i} className="h-14 w-14 overflow-hidden rounded-lg border border-[#E5E7EB] bg-[#F3F4F6]">
              {line.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={line.image} alt="" className="h-full w-full object-cover" />
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {data?.email ? (
        <p className="mt-8 max-w-md text-sm text-[#6B7280]">
          A confirmation email has been sent to <span className="font-medium text-[#0F172A]">{data.email}</span>
        </p>
      ) : (
        <p className="mt-8 text-sm text-[#6B7280]">
          {data ? "You can track your order from your account." : "If you completed checkout, confirmation details will appear here. You can also check your email or account orders."}
        </p>
      )}

      <div className="mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href="/account/orders" className="flex-1">
          <Button variant="outline" className="h-12 w-full rounded-full border-[#0F172A] text-[#0F172A]">
            Track My Order
          </Button>
        </Link>
        <Link href="/products" className="flex-1">
          <Button className="h-12 w-full rounded-full bg-[#0F172A] text-white">Continue Shopping</Button>
        </Link>
      </div>

      {data?.total != null ? (
        <p className="mt-6 text-xs text-[#9CA3AF]">
          Total paid: {data.currency ?? CURRENCY_SYMBOL}
          {data.total.toFixed(2)}
        </p>
      ) : null}
    </div>
  );
}
