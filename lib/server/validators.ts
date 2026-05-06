import { z } from "zod";

export const productFilterSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  inStock: z.enum(["true", "false"]).optional(),
  sort: z.enum(["newest", "price_asc", "price_desc", "rating_desc"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(12)
});

export const createOrderSchema = z.object({
  userId: z.string().uuid().optional(),
  shippingAddress: z.record(z.string(), z.any()),
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        variantId: z.number().int().positive().optional(),
        quantity: z.number().int().positive(),
        price: z.number().nonnegative()
      })
    )
    .min(1),
  shippingCost: z.number().nonnegative().default(0),
  discount: z.number().nonnegative().default(0),
  tax: z.number().nonnegative().default(0),
  stripePaymentIntent: z.string().optional()
});

export const cartMutationSchema = z.object({
  userId: z.string().uuid().optional(),
  sessionId: z.string().optional(),
  productId: z.number().int().positive(),
  variantId: z.number().int().positive().optional(),
  quantity: z.number().int().positive().default(1)
});

export const updateProfileSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string().min(2).optional(),
  avatar_url: z.string().url().optional(),
  ecosystem_preferences: z.array(z.string()).optional(),
  loyalty_points: z.number().int().nonnegative().optional()
});
