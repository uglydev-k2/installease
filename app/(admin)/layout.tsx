import type { ReactNode } from "react";
import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, Boxes, Users, LifeBuoy } from "lucide-react";
import { requireAdminPageAccess } from "@/lib/server/admin-auth";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/inventory", label: "Inventory", icon: Boxes }
];

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdminPageAccess();

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-[220px_1fr]">
        <aside className="space-y-4 rounded-xl border bg-white p-4 shadow-sm dark:bg-slate-900">
          <div className="rounded-lg bg-slate-900 p-3 text-white">
            <p className="text-xs uppercase text-slate-300">installease</p>
            <p className="text-sm font-semibold">Admin HQ</p>
          </div>

          <div className="space-y-1">
            {nav.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="rounded-lg border p-3 text-sm">
            <p className="mb-2 flex items-center gap-2 font-medium">
              <Users className="h-4 w-4" />
              Team Access
            </p>
            <p className="text-xs text-slate-500">Admin: Full Control</p>
            <p className="text-xs text-slate-500">Support: Orders, Returns</p>
            <p className="text-xs text-slate-500">Warehouse: Inventory Only</p>
          </div>

          <button className="flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800">
            <LifeBuoy className="h-4 w-4" />
            Support Tools
          </button>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
