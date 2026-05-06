import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const maxBytes = 5 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    if (!allowedMimeTypes.has(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type. Use jpg, png, webp, or gif." },
        { status: 400 }
      );
    }

    if (file.size > maxBytes) {
      return NextResponse.json({ error: "Image is too large (max 5MB)." }, { status: 400 });
    }

    const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "product-images";
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const objectPath = `products/${Date.now()}-${randomUUID()}.${extension}`;

    const supabase = createServerSupabaseClient();
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { error: uploadError } = await supabase.storage.from(bucket).upload(objectPath, buffer, {
      contentType: file.type,
      upsert: false
    });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
    return NextResponse.json({ url: data.publicUrl, path: objectPath, bucket }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to upload image." }, { status: 500 });
  }
}
