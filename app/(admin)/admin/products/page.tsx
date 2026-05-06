import { ProductImageUploader } from "@/components/admin/product-image-uploader";

export default function AdminProductsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Product Management</h1>
      <div className="rounded-xl border bg-white p-4 dark:bg-slate-900">Add, edit, delete products and variants.</div>
      <ProductImageUploader />
    </div>
  );
}
