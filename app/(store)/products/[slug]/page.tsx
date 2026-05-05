import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { products } from "@/lib/data/products";
import { EcosystemBadge } from "@/components/shared/ecosystem-badge";
import { Button } from "@/components/ui/button";
import { CompatibilityChecker } from "@/components/store/compatibility-checker";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = products.find((item) => item.slug === params.slug);
  if (!product) return { title: "Product not found | installease" };
  return {
    title: `${product.name} | installease`,
    description: product.description,
    openGraph: {
      title: `${product.name} | installease`,
      description: product.description,
      images: [product.images[0]]
    }
  };
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = products.find((item) => item.slug === params.slug);
  if (!product) return notFound();

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="rounded-2xl border p-4">
        <Image
          src={product.images[0]}
          alt={product.name}
          width={1200}
          height={900}
          className="h-[420px] w-full rounded-xl object-cover"
        />
      </div>
      <section className="space-y-4">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-slate-500">{product.brand}</p>
        <div className="flex flex-wrap gap-2">
          {product.ecosystems.map((ecosystem) => (
            <EcosystemBadge key={ecosystem} ecosystem={ecosystem} />
          ))}
        </div>
        <p>{product.description}</p>
        <p className="text-2xl font-bold">${product.salePrice ?? product.price}</p>
        <div className="flex gap-3">
          <Button>Add to Cart</Button>
          <CompatibilityChecker supported={product.ecosystems} />
        </div>
      </section>
    </div>
  );
}
