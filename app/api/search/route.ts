import Fuse from "fuse.js";
import { NextRequest, NextResponse } from "next/server";
import { products as fallbackProducts } from "@/lib/data/products";
import { fetchCatalog } from "@/lib/server/services/catalog-service";

const fallbackFuse = new Fuse(fallbackProducts, {
  keys: ["name", "description", "category", "brand"],
  threshold: 0.35
});

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get("q") ?? "";
    const catalog = await fetchCatalog(request.nextUrl.searchParams);
    const items = catalog.items ?? [];
    if (!q) return NextResponse.json({ data: items });

    const liveFuse = new Fuse(items, { keys: ["name", "description", "brand"], threshold: 0.35 });
    const result = liveFuse.search(q).map((r) => r.item);
    return NextResponse.json({ data: result });
  } catch {
    const q = request.nextUrl.searchParams.get("q") ?? "";
    if (!q) return NextResponse.json({ data: fallbackProducts });
    return NextResponse.json({ data: fallbackFuse.search(q).map((r) => r.item) });
  }
}
