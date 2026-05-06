import { ProductCard } from "@/components/store/product-card";
import { products } from "@/lib/data/products";

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">All Products</h1>
        <p className="text-slate-500">Showing {products.length} products</p>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
