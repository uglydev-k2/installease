import type { ReactNode } from "react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-[220px_1fr]">
        <aside className="space-y-2 rounded-xl border bg-white p-4 dark:bg-slate-900">
          <p className="font-semibold">Admin</p>
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/products">Products</Link>
          <Link href="/admin/orders">Orders</Link>
          <Link href="/admin/inventory">Inventory</Link>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
