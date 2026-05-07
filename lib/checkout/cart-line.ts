import type { Product } from "@/lib/types/product";

export function lineUnitPrice(product: Product): number {
  return product.salePrice ?? product.price;
}

export function lineImageUrl(product: Product): string | undefined {
  const fromCover = product.coverImage;
  const fromImages = product.images?.[0];
  return fromCover || fromImages;
}

export function formatVariantLabel(product: Product): string | undefined {
  return product.variantLabel?.trim() || undefined;
}
