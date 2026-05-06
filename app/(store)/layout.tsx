import type { ReactNode } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { CartDrawer } from "@/components/store/cart-drawer";
import { Button } from "@/components/ui/button";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur dark:bg-slate-950/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button className="rounded-lg border p-2 text-slate-600 md:hidden" aria-label="Open menu">
              <Menu className="h-4 w-4" />
            </button>
            <Link href="/" className="text-xl font-extrabold tracking-tight">
              installease
            </Link>
          </div>
          <nav className="hidden items-center gap-5 text-sm font-medium md:flex">
            <Link href="/products" className="text-slate-700 hover:text-slate-900 dark:text-slate-300">
              Products
            </Link>
            <Link href="/search" className="text-slate-700 hover:text-slate-900 dark:text-slate-300">
              Search
            </Link>
            <Link href="/account" className="text-slate-700 hover:text-slate-900 dark:text-slate-300">
              Account
            </Link>
            <Link href="/admin" className="text-slate-700 hover:text-slate-900 dark:text-slate-300">
              Admin
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/signin">
              <Button size="sm" variant="outline">
                Sign in
              </Button>
            </Link>
            <Link href="/signup" className="hidden sm:block">
              <Button size="sm">Sign up</Button>
            </Link>
            <CartDrawer />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
      <footer className="mt-8 border-t bg-white dark:bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm text-slate-500">
          <p>2026 installease. Built for modern smart homes.</p>
          <div className="flex gap-3">
            <Link href="/products">Shop</Link>
            <Link href="/account">My Account</Link>
            <Link href="/signin">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
