import Fuse from "fuse.js";
import { NextRequest, NextResponse } from "next/server";
import { products } from "@/lib/data/products";

const fuse = new Fuse(products, { keys: ["name", "description", "category", "brand"], threshold: 0.35 });

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  if (!q) return NextResponse.json({ data: products });
  return NextResponse.json({ data: fuse.search(q).map((r) => r.item) });
}
