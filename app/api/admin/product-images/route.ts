import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireAdminApiAccess } from "@/lib/server/admin-auth";
import { isProductImagePath, productImagesBucket } from "@/lib/admin/storage-path";

const allowedMime = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxBytes = 5 * 1024 * 1024;

function cleanSlug(slug: unknown): string | null {
  if (typeof slug !== "string" || !slug) return null;
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  return slug;
}

export async function POST(request: Request) {
  try {
    const auth = await requireAdminApiAccess();
    if (!auth.ok) return auth.response;

    const form = await request.formData();
    const file = form.get("file");
    const slug = cleanSlug(form.get("slug"));

    if (!slug) {
      return NextResponse.json({ error: "Invalid or missing slug." }, { status: 400 });
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    if (!allowedMime.has(file.type)) {
      return NextResponse.json(
        { error: "Unsupported type. Use PNG, JPG, or WEBP." },
        { status: 400 }
      );
    }

    if (file.size > maxBytes) {
      return NextResponse.json({ error: "Image is too large (max 5MB)." }, { status: 400 });
    }

    const timestamp = Date.now();
    const cleanName = file.name.replace(/[^a-z0-9.]/gi, "-").toLowerCase();
    const path = `products/${slug}/${timestamp}-${cleanName}`;

    const supabase = createServerSupabaseClient();
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { error: uploadError } = await supabase.storage.from(productImagesBucket).upload(path, buffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false
    });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data } = supabase.storage.from(productImagesBucket).getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl, path }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to upload image." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = await requireAdminApiAccess();
    if (!auth.ok) return auth.response;

    const body = (await request.json()) as { path?: string };
    const path = typeof body.path === "string" ? body.path : "";

    if (!isProductImagePath(path)) {
      return NextResponse.json({ error: "Invalid storage path." }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    const { error } = await supabase.storage.from(productImagesBucket).remove([path]);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete image." }, { status: 500 });
  }
}
