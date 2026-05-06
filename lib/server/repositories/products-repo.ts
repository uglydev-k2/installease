import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types/product";

interface ProductFilters {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: "true" | "false";
  sort?: "newest" | "price_asc" | "price_desc" | "rating_desc";
  page: number;
  pageSize: number;
}

export async function listProducts(filters: ProductFilters) {
  const supabase = createServerSupabaseClient();
  const from = (filters.page - 1) * filters.pageSize;
  const to = from + filters.pageSize - 1;

  let query = supabase.from("products").select("*", { count: "exact" }).eq("is_active", true);

  if (filters.q) query = query.ilike("name", `%${filters.q}%`);
  if (filters.category) query = query.ilike("description", `%${filters.category}%`);
  if (typeof filters.minPrice === "number") query = query.gte("price", filters.minPrice);
  if (typeof filters.maxPrice === "number") query = query.lte("price", filters.maxPrice);
  if (filters.inStock === "true") query = query.gt("stock", 0);

  if (filters.sort === "price_asc") query = query.order("price", { ascending: true });
  else if (filters.sort === "price_desc") query = query.order("price", { ascending: false });
  else query = query.order("id", { ascending: false });

  const { data, error, count } = await query.range(from, to);
  if (error) throw error;

  return {
    items: (data ?? []) as Product[],
    total: count ?? 0,
    page: filters.page,
    pageSize: filters.pageSize
  };
}

export async function getProductBySlug(slug: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from("products").select("*").eq("slug", slug).single();
  if (error) throw error;
  return data as Product;
}
