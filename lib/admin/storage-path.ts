export const productImagesBucket =
  process.env.SUPABASE_STORAGE_BUCKET ??
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ??
  "product-images";

export function storageObjectPathFromPublicUrl(publicUrl: string): string | null {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!baseUrl) return null;
  const marker = `/storage/v1/object/public/${productImagesBucket}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(publicUrl.slice(idx + marker.length));
}

export function isProductImagePath(path: string): boolean {
  return path.startsWith("products/") && !path.includes("..");
}

