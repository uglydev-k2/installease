import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAdminApiAccess } from "@/lib/server/admin-auth";
import { mapSetupDifficultyToDb, productFormSchema } from "@/lib/admin/product-form-schema";
import { removeProductImagesFromStorage } from "@/lib/admin/remove-product-images";

function dimensionsPayload(
  d: { length?: number; width?: number; height?: number } | undefined
): Record<string, number> | null {
  if (!d) return null;
  const length = d.length ?? 0;
  const width = d.width ?? 0;
  const height = d.height ?? 0;
  if (!length && !width && !height) return null;
  return {
    ...(length ? { length_cm: length } : {}),
    ...(width ? { width_cm: width } : {}),
    ...(height ? { height_cm: height } : {})
  };
}

export async function GET() {
  try {
    const auth = await requireAdminApiAccess();
    if (!auth.ok) return auth.response;

    const supabase = createServerSupabaseClient();
    const [{ data: products, error: pErr }, { data: categories }, { data: brands }] = await Promise.all([
      supabase
        .from("products")
        .select(
          "id, name, slug, sku, price, sale_price, stock, status, is_active, cover_image, images, created_at, category_id, brand_id"
        )
        .order("created_at", { ascending: false }),
      supabase.from("categories").select("id, name"),
      supabase.from("brands").select("id, name")
    ]);

    if (pErr) {
      return NextResponse.json({ error: pErr.message }, { status: 500 });
    }

    const catMap = new Map((categories ?? []).map((c) => [c.id, c.name]));
    const brandMap = new Map((brands ?? []).map((b) => [b.id, b.name]));

    const rows = (products ?? []).map((row: Record<string, unknown>) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      sku: row.sku,
      price: row.price,
      sale_price: row.sale_price,
      stock: row.stock,
      status: row.status,
      is_active: row.is_active,
      cover_image: row.cover_image,
      images: row.images,
      created_at: row.created_at,
      category_name: (row.category_id != null ? catMap.get(row.category_id as number) : null) ?? null,
      brand_name: (row.brand_id != null ? brandMap.get(row.brand_id as number) : null) ?? null
    }));

    return NextResponse.json({ products: rows });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load products.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAdminApiAccess();
    if (!auth.ok) return auth.response;

    const json = await request.json();
    const parsed = productFormSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed.", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const body = parsed.data;
    const imageUrls = body.gallery.map((g) => g.url);

    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("products")
      .insert({
        name: body.name,
        slug: body.slug,
        category_id: body.categoryId,
        brand_id: body.brandId,
        description: body.description,
        short_description: body.shortDescription,
        price: body.price,
        sale_price: body.salePrice && body.salePrice > 0 ? body.salePrice : null,
        sku: body.sku,
        stock: body.stock,
        low_stock_threshold: body.lowStockThreshold,
        setup_difficulty: mapSetupDifficultyToDb(body.setupDifficulty),
        ecosystems: body.ecosystems,
        images: imageUrls,
        cover_image: imageUrls[0] ?? null,
        tags: body.tags,
        status: body.status,
        weight_grams: body.weightGrams ?? null,
        dimensions: dimensionsPayload(body.dimensions),
        is_active: body.status === "active",
        specifications: {}
      })
      .select("id, slug, name, cover_image")
      .single();

    if (error) {
      const dup = error.code === "23505";
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
          field: dup ? "slug" : undefined
        },
        { status: dup ? 409 : 500 }
      );
    }

    return NextResponse.json({ product: data }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create product.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
