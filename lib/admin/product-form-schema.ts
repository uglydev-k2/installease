import { z } from "zod";

export const slugifyName = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const ecosystemValues = ["alexa", "google", "homekit", "matter"] as const;
export type EcosystemValue = (typeof ecosystemValues)[number];

export const galleryItemSchema = z.object({
  url: z.string().url(),
  path: z.string().optional()
});

const baseProductFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers and hyphens"),
  categoryId: z.coerce.number().int().positive("Please select a category"),
  brandId: z.coerce.number().int().positive("Please select a brand"),
  shortDescription: z.string().min(1, "Short description is required").max(160),
  description: z.string().min(1, "Description is required").max(2000),
  setupDifficulty: z.enum(["beginner", "intermediate", "advanced"]),
  ecosystems: z.array(z.enum(ecosystemValues)).min(1, "Select at least one ecosystem"),
  status: z.enum(["draft", "active"]),
  tags: z.array(z.string().min(1)).default([]),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  salePrice: z
    .union([z.string(), z.number(), z.nan()])
    .optional()
    .transform((v) => {
      if (v === "" || v === null || v === undefined) return undefined;
      if (typeof v === "number" && Number.isNaN(v)) return undefined;
      const n = typeof v === "number" ? v : Number(v);
      if (Number.isNaN(n)) return undefined;
      return n;
    }),
  sku: z.string().min(1, "SKU is required"),
  stock: z.coerce.number().int().min(0),
  lowStockThreshold: z.coerce.number().int().min(0).default(5),
  weightGrams: z
    .union([z.string(), z.number(), z.nan()])
    .optional()
    .transform((v) => {
      if (v === "" || v === null || v === undefined) return undefined;
      if (typeof v === "number" && Number.isNaN(v)) return undefined;
      const n = typeof v === "number" ? v : Number(v);
      if (Number.isNaN(n)) return undefined;
      return Math.round(n);
    }),
  dimensions: z
    .object({
      length: z.preprocess(
        (v) => (v === "" || v === undefined || (typeof v === "number" && Number.isNaN(v)) ? undefined : v),
        z.coerce.number().min(0).optional()
      ),
      width: z.preprocess(
        (v) => (v === "" || v === undefined || (typeof v === "number" && Number.isNaN(v)) ? undefined : v),
        z.coerce.number().min(0).optional()
      ),
      height: z.preprocess(
        (v) => (v === "" || v === undefined || (typeof v === "number" && Number.isNaN(v)) ? undefined : v),
        z.coerce.number().min(0).optional()
      )
    })
    .optional(),
  gallery: z.array(galleryItemSchema).min(1, "Please upload at least one image")
});

export const productFormSchema = baseProductFormSchema.superRefine((data, ctx) => {
  if (data.salePrice !== undefined && data.salePrice > 0 && data.salePrice >= data.price) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Sale price must be less than the regular price",
      path: ["salePrice"]
    });
  }
});

export type ProductFormValues = z.infer<typeof baseProductFormSchema>;

export const step1Schema = baseProductFormSchema.pick({
  name: true,
  slug: true,
  categoryId: true,
  brandId: true,
  shortDescription: true,
  description: true,
  setupDifficulty: true,
  ecosystems: true,
  status: true,
  tags: true
});

export const step2Schema = baseProductFormSchema
  .pick({
    price: true,
    salePrice: true,
    sku: true,
    stock: true,
    lowStockThreshold: true,
    weightGrams: true,
    dimensions: true
  })
  .superRefine((data, ctx) => {
    if (data.salePrice !== undefined && data.salePrice > 0 && data.salePrice >= data.price) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Sale price must be less than the regular price",
        path: ["salePrice"]
      });
    }
  });

export const step3Schema = baseProductFormSchema.pick({ gallery: true });

export function mapSetupDifficultyToDb(v: ProductFormValues["setupDifficulty"]) {
  const m = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" } as const;
  return m[v];
}
