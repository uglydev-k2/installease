import type { MetadataRoute } from "next";
import { products } from "@/lib/data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const staticRoutes = ["", "/products", "/cart", "/checkout", "/account", "/search", "/plumbing"];
  return [
    ...staticRoutes.map((route) => ({
      url: `${base}${route}`,
      lastModified: new Date()
    })),
    ...products.map((product) => ({
      url: `${base}/products/${product.slug}`,
      lastModified: new Date()
    }))
  ];
}
