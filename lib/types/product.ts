export type Ecosystem = "alexa" | "google" | "homekit" | "matter";
export type SetupDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  images: string[];
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
