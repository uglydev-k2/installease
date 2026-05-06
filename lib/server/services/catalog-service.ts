import { listProducts, getProductBySlug } from "@/lib/server/repositories/products-repo";
import { productFilterSchema } from "@/lib/server/validators";

export async function fetchCatalog(searchParams: URLSearchParams) {
  const parsed = productFilterSchema.parse(Object.fromEntries(searchParams.entries()));
  return listProducts(parsed);
}

export async function fetchProduct(slug: string) {
  return getProductBySlug(slug);
}
