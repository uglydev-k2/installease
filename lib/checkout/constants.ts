export const CHECKOUT_BG = "#FAFAFA";
export const CHECKOUT_CARD = "#FFFFFF";
export const CHECKOUT_BORDER = "#E5E7EB";
export const CHECKOUT_PRIMARY = "#0F172A";
export const CHECKOUT_SUCCESS = "#16A34A";
export const CHECKOUT_ERROR = "#DC2626";
export const CHECKOUT_MUTED = "#6B7280";

export const CURRENCY_SYMBOL = "GH₵";

export const VAT_RATE = 0.15;

export const GHANA_REGIONS = [
  "Greater Accra",
  "Ashanti",
  "Western",
  "Eastern",
  "Central",
  "Northern",
  "Volta",
  "Brong-Ahafo",
  "Upper East",
  "Upper West"
] as const;

export type DeliveryMethodId = "standard" | "express" | "next_day";

export const DELIVERY_OPTIONS: {
  id: DeliveryMethodId;
  title: string;
  description: string;
  /** Flat fee when not free (GH₵) */
  flatFee: number;
  /** Free when subtotal >= this (GH₵); only for standard */
  freeOver?: number;
}[] = [
  {
    id: "standard",
    title: "Standard Delivery",
    description: "3–5 business days",
    flatFee: 25,
    freeOver: 500
  },
  {
    id: "express",
    title: "Express Delivery",
    description: "1–2 business days",
    flatFee: 60
  },
  {
    id: "next_day",
    title: "Next Day Delivery",
    description: "Order before 2pm",
    flatFee: 120
  }
];

export function shippingForMethod(
  methodId: DeliveryMethodId | null,
  subtotal: number
): { amount: number; label: string } {
  if (!methodId) {
    return { amount: 0, label: "Calculated at next step" };
  }
  const opt = DELIVERY_OPTIONS.find((o) => o.id === methodId);
  if (!opt) return { amount: 0, label: "—" };
  if (opt.id === "standard" && opt.freeOver != null && subtotal >= opt.freeOver) {
    return { amount: 0, label: "Free" };
  }
  return { amount: opt.flatFee, label: `${CURRENCY_SYMBOL}${opt.flatFee.toFixed(2)}` };
}

export function estimateDeliveryRange(methodId: DeliveryMethodId | null): string {
  if (!methodId) return "—";
  const now = new Date();
  const addDays = (d: number) => {
    const x = new Date(now);
    x.setDate(x.getDate() + d);
    return x.toLocaleDateString("en-GH", { weekday: "short", month: "short", day: "numeric" });
  };
  if (methodId === "standard") return `${addDays(3)} – ${addDays(5)}`;
  if (methodId === "express") return `${addDays(1)} – ${addDays(2)}`;
  return addDays(1);
}
