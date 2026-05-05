"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Product } from "@/lib/types/product";
import { EcosystemBadge } from "@/components/shared/ecosystem-badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <article className="group rounded-xl border bg-white p-3 shadow-sm transition hover:shadow-md dark:bg-slate-900">
      <Link href={`/products/${product.slug}`} className="relative block overflow-hidden rounded-xl">
        <Image
          src={product.images[0]}
          alt={product.name}
          width={800}
          height={800}
          className="h-60 w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </Link>
      <div className="mt-3 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 font-semibold">{product.name}</h3>
          <button aria-label="Toggle wishlist" className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
            <Heart className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span>{product.rating}</span>
          <span className="text-slate-500">({product.reviewCount})</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {product.ecosystems.map((ecosystem) => (
            <EcosystemBadge key={ecosystem} ecosystem={ecosystem} />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">${product.salePrice ?? product.price}</span>
          {product.salePrice ? (
            <span className="text-sm text-slate-500 line-through">${product.price}</span>
          ) : null}
        </div>
        <Button className="w-full" onClick={() => addItem(product)}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </article>
  );
}
