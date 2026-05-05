import type { ReactNode } from "react";
import Link from "next/link";
import { CartDrawer } from "@/components/store/cart-drawer";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-xl font-bold">
            installease
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/products">Products</Link>
            <Link href="/search">Search</Link>
            <Link href="/account">Account</Link>
            <CartDrawer />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
}
