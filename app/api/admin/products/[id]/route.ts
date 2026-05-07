import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAdminApiAccess } from "@/lib/server/admin-auth";
import { mapSetupDifficultyToDb, productFormSchema } from "@/lib/admin/product-form-schema";
import { removeProductImagesFromStorage } from "@/lib/admin/remove-product-images";
import { storageObjectPathFromPublicUrl } from "@/lib/admin/storage-path";

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

function parseImagesArray(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((x): x is string => typeof x === "string");
}

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAdminApiAccess();
    if (!auth.ok) return auth.response;

    const { id } = params;
    const numericId = Number(id);
    if (!Number.isFinite(numericId)) {
      return NextResponse.json({ error: "Invalid product id." }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.from("products").select("*").eq("id", numericId).maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const row = data as Record<string, unknown>;

    const setup = String(row.setup_difficulty ?? "");
    const setupMap: Record<string, "beginner" | "intermediate" | "advanced"> = {
      Beginner: "beginner",
      Intermediate: "intermediate",
      Advanced: "advanced"
    };

    const ecosystemsRaw = Array.isArray(row.ecosystems) ? row.ecosystems : [];
    const ecosystems = ecosystemsRaw
      .map((e) => String(e).toLowerCase().trim())
      .map((e) => (e === "google_home" || e === "google home" ? "google" : e))
      .filter((e): e is "alexa" | "google" | "homekit" | "matter" =>
        ["alexa", "google", "homekit", "matter"].includes(e)
      );
    const tags = Array.isArray(row.tags) ? row.tags.filter((t): t is string => typeof t === "string") : [];

    const dims = row.dimensions as Record<string, unknown> | null;
    const dimensions =
      dims && typeof dims === "object"
        ? {
            length: typeof dims.length_cm === "number" ? dims.length_cm : Number(dims.length_cm) || undefined,
            width: typeof dims.width_cm === "number" ? dims.width_cm : Number(dims.width_cm) || undefined,
            height: typeof dims.height_cm === "number" ? dims.height_cm : Number(dims.height_cm) || undefined
          }
        : undefined;

    const images = parseImagesArray(row.images);
    const gallery = images.map((url) => ({
      url,
      path: storageObjectPathFromPublicUrl(url) ?? undefined
    }));

    const form = {
      name: row.name,
      slug: row.slug,
      categoryId: row.category_id,
      brandId: row.brand_id,
      shortDescription: row.short_description,
      description: row.description,
      setupDifficulty: setupMap[setup] ?? "beginner",
      ecosystems: ecosystems.length > 0 ? ecosystems : (["alexa"] as const),
      status: row.status === "active" ? "active" : "draft",
      tags,
      price: Number(row.price),
      salePrice: row.sale_price != null ? Number(row.sale_price) : undefined,
      sku: row.sku,
      stock: row.stock,
      lowStockThreshold: row.low_stock_threshold ?? 5,
      weightGrams: row.weight_grams != null ? Number(row.weight_grams) : undefined,
      dimensions,
      gallery: gallery.length ? gallery : []
    };

    return NextResponse.json({
      product: {
        id: row.id,
        form
      }
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load product.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAdminApiAccess();
    if (!auth.ok) return auth.response;

    const { id } = params;
    const numericId = Number(id);
    if (!Number.isFinite(numericId)) {
      return NextResponse.json({ error: "Invalid product id." }, { status: 400 });
    }

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

    const { data: existing, error: loadErr } = await supabase
      .from("products")
      .select("images")
      .eq("id", numericId)
      .maybeSingle();

    if (loadErr) {
      return NextResponse.json({ error: loadErr.message }, { status: 500 });
    }
    if (!existing) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const oldUrls = parseImagesArray((existing as { images?: unknown }).images);
    const removed = oldUrls.filter((u) => !imageUrls.includes(u));
    if (removed.length) {
      await removeProductImagesFromStorage(supabase, removed);
    }

    const { data, error } = await supabase
      .from("products")
      .update({
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
        is_active: body.status === "active"
      })
      .eq("id", numericId)
      .select("id, slug, name, cover_image")
      .single();

    if (error) {
      const dup = error.code === "23505";
      return NextResponse.json(
        { error: error.message, code: error.code, field: dup ? "slug" : undefined },
        { status: dup ? 409 : 500 }
      );
    }

    return NextResponse.json({ product: data });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to update product.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAdminApiAccess();
    if (!auth.ok) return auth.response;

    const { id } = params;
    const numericId = Number(id);
    if (!Number.isFinite(numericId)) {
      return NextResponse.json({ error: "Invalid product id." }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    const { data: existing, error: loadErr } = await supabase
      .from("products")
      .select("images")
      .eq("id", numericId)
      .maybeSingle();

    if (loadErr) {
      return NextResponse.json({ error: loadErr.message }, { status: 500 });
    }
    if (!existing) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const urls = parseImagesArray((existing as { images?: unknown }).images);
    await removeProductImagesFromStorage(supabase, urls);

    const { error } = await supabase
      .from("products")
      .update({ is_active: false, status: "deleted" })
      .eq("id", numericId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to delete product.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
