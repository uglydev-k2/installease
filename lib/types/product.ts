export type Ecosystem = "alexa" | "google" | "homekit" | "matter";
export type SetupDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface Product {
  id: string;
  /** When set, used for `order_items` FK and server-side order persistence */
  databaseId?: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  images: string[];
  /** Optional storefront cover when different from images[0] */
  coverImage?: string;
  /** Single-line variant summary for cart/checkout */
  variantLabel?: string;
  rating: number;
  reviewCount: number;
  badge?: "New" | "Sale" | "Best Seller" | "Low Stock";
  ecosystems: Ecosystem[];
  stock: number;
  brand: string;
  sku: string;
  setupDifficulty: SetupDifficulty;
  category: string;
}
