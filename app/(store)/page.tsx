import { FlashSaleBanner } from "@/components/store/flash-sale-banner";
import { ProductCard } from "@/components/store/product-card";
import { products } from "@/lib/data/products";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-600 p-10 text-white">
        <p className="mb-2 text-sm uppercase tracking-wide">Smart living, simplified</p>
        <h1 className="max-w-2xl text-4xl font-bold">Build your intelligent home with installease</h1>
        <p className="mt-3 max-w-xl text-slate-200">
          Premium smart sockets, cameras, bulbs, locks and doorbells designed to work together.
        </p>
        <div className="mt-6 flex gap-3">
          <Button>Shop Now</Button>
          <Button variant="secondary">Build My Setup</Button>
        </div>
      </section>

      <FlashSaleBanner />

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Featured Products</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
