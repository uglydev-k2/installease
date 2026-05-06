import type { ReactNode } from "react";
import Link from "next/link";
import { Menu, Search, ShoppingCart } from "lucide-react";
import { CartDrawer } from "@/components/store/cart-drawer";
import { Button } from "@/components/ui/button";

export default function StoreLayout({ children }: { children: ReactNode }) {
  const nav = ["Home", "Categories", "Brands", "Special Discounts", "Contact", "Blogs"];
  const quickCategories = [
    "Smartphones",
    "Tablets",
    "Cameras",
    "Smart Watches",
    "Laptops",
    "Routers",
    "Gaming"
  ];

  return (
    <div className="min-h-screen">
      <div className="bg-slate-900 px-4 py-2 text-center text-xs font-medium text-white">
        New installease bundles available now - free smart-home audit with selected kits.
      </div>
      <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur dark:bg-slate-950/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs text-slate-500">
          <p>Follow us: X / Facebook / Instagram / TikTok / YouTube</p>
          <div className="flex items-center gap-3">
            <Link href="/signin">Log in</Link>
            <span>|</span>
            <Link href="/signup">Create Account</Link>
          </div>
        </div>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <button className="rounded-lg border p-2 text-slate-600 md:hidden" aria-label="Open menu">
              <Menu className="h-4 w-4" />
            </button>
            <Link href="/" className="text-2xl font-extrabold tracking-tight">
              installease
            </Link>
          </div>
          <div className="hidden flex-1 items-center gap-2 rounded-xl border px-3 py-2 md:flex">
            <Search className="h-4 w-4 text-slate-400" />
            <input placeholder="Search smart devices, brands..." className="w-full bg-transparent text-sm outline-none" />
          </div>
          <div className="flex items-center gap-2">
            <Link href="/account" className="hidden text-sm font-medium sm:block">
              Account
            </Link>
            <Link href="/cart" className="hidden items-center gap-1 text-sm font-medium sm:flex">
              <ShoppingCart className="h-4 w-4" />
              Cart
            </Link>
            <CartDrawer />
          </div>
        </div>
        <div className="border-t">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 text-sm font-medium">
            {nav.map((item) => (
              <Link
                key={item}
                href={item === "Home" ? "/" : item === "Categories" ? "/products" : "/search"}
                className="text-slate-700 hover:text-indigo-600 dark:text-slate-300"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
        <div className="border-t bg-slate-50 dark:bg-slate-900/50">
          <div className="mx-auto flex max-w-7xl flex-wrap gap-2 px-4 py-2">
            {quickCategories.map((item) => (
              <span key={item} className="rounded-full bg-white px-3 py-1 text-xs dark:bg-slate-800">
                {item}
              </span>
            ))}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
      <footer className="mt-8 border-t bg-white dark:bg-slate-950">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:grid-cols-4">
          <div>
            <p className="text-lg font-extrabold">installease</p>
            <p className="mt-2 text-sm text-slate-500">
              Smart home marketplace built for premium devices, trusted support, and seamless setup.
            </p>
          </div>
          <div className="text-sm">
            <p className="mb-2 font-semibold">Quick links</p>
            <div className="space-y-1 text-slate-500">
              <p>Search</p>
              <p>Brands</p>
              <p>Contact</p>
            </div>
          </div>
          <div className="text-sm">
            <p className="mb-2 font-semibold">Support</p>
            <div className="space-y-1 text-slate-500">
              <p>Warranty policy</p>
              <p>Refund policy</p>
              <p>Terms of service</p>
            </div>
          </div>
          <div className="text-sm">
            <p className="mb-2 font-semibold">Newsletter</p>
            <input className="w-full rounded-lg border px-3 py-2" placeholder="Your email" />
            <Button className="mt-2 w-full">Subscribe</Button>
          </div>
        </div>
        <div className="border-t px-4 py-4 text-center text-xs text-slate-500">© 2026 installease. All rights reserved.</div>
      </footer>
    </div>
  );
}
