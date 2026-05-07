import { z } from "zod";
import { GHANA_REGIONS } from "@/lib/checkout/constants";

const regionList = GHANA_REGIONS as readonly string[];

const phoneLocal = z
  .string()
  .min(9, "Enter a valid mobile number")
  .max(15)
  .regex(/^[0-9\s]+$/, "Digits only");

export const deliveryStepSchema = z.object({
  email: z.string().email("Valid email required"),
  phoneLocal: phoneLocal,
  fullName: z.string().min(2, "Full name required"),
  line1: z.string().min(3, "Address is required"),
  line2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  region: z.string().refine((v) => regionList.includes(v), { message: "Select a region" }),
  country: z.string().min(2).default("Ghana"),
  deliveryMethod: z.enum(["standard", "express", "next_day"], {
    errorMap: () => ({ message: "Select a delivery method" })
  })
});

export type DeliveryFormValues = z.infer<typeof deliveryStepSchema>;

export function buildShippingAddress(values: DeliveryFormValues, phoneE164: string) {
  return {
    email: values.email,
    phone: phoneE164,
    full_name: values.fullName,
    line1: values.line1,
    line2: values.line2 ?? "",
    city: values.city,
    region: values.region,
    country: values.country
  };
}
