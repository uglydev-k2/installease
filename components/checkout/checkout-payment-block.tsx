"use client";

import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";

function CardBrandIcons() {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3 opacity-80">
      <svg width="40" height="26" viewBox="0 0 40 26" aria-hidden>
        <rect width="40" height="26" rx="4" fill="#1A1F71" />
        <path
          fill="#F9A533"
          d="M15 8h4l-2.5 10h-4L15 8zm8.2 0l-3.1 10h3.8l.5-2.3h2.1l.3 2.3h3.3L32.8 8h-3.6l-1.2 6.3L27 8h-3.8z"
        />
      </svg>
      <svg width="40" height="26" viewBox="0 0 40 26" aria-hidden>
        <rect width="40" height="26" rx="4" fill="#EB001B" />
        <circle cx="16" cy="13" r="7" fill="#EB001B" />
        <circle cx="24" cy="13" r="7" fill="#F79E1B" />
      </svg>
      <svg width="40" height="26" viewBox="0 0 40 26" aria-hidden>
        <rect width="40" height="26" rx="4" fill="#016FD0" />
        <text x="8" y="17" fill="white" fontSize="8" fontWeight="700">
          AMEX
        </text>
      </svg>
    </div>
  );
}

type CheckoutPaymentBlockProps = {
  showSaveCard: boolean;
  saveCard: boolean;
  onSaveCardChange: (v: boolean) => void;
};

export function CheckoutPaymentBlock({ showSaveCard, saveCard, onSaveCardChange }: CheckoutPaymentBlockProps) {
  const stripe = useStripe();
  const elements = useElements();

  if (!stripe || !elements) {
    return <p className="text-sm text-[#6B7280]">Loading secure payment form…</p>;
  }

  return (
    <div>
      <CardBrandIcons />
      <PaymentElement
        options={{
          layout: "tabs"
        }}
      />
      {showSaveCard ? (
        <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-[#374151]">
          <input type="checkbox" checked={saveCard} onChange={(e) => onSaveCardChange(e.target.checked)} className="rounded border-[#E5E7EB]" />
          Save card for future purchases
        </label>
      ) : null}
    </div>
  );
}

export function useStripePaymentReady() {
  const stripe = useStripe();
  const elements = useElements();
  return Boolean(stripe && elements);
}
