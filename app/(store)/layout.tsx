import type { ReactNode } from "react";
import Link from "next/link";
import { Home, LayoutDashboard, Menu, Search, ShoppingCart, User } from "lucide-react";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { CartDrawer } from "@/components/store/cart-drawer";
import { Button } from "@/components/ui/button";
import { AuthControls } from "@/components/store/auth-controls";
import { SignOutButton } from "@/components/store/signout-button";

export const dynamic = "force-dynamic";

async function getAuthState() {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set() {},
          remove() {}
        }
      }
    );
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) {
      return { isAuthenticated: false, isAdmin: false, email: null as string | null };
    }

    const { data } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
    return {
      isAuthenticated: true,
      isAdmin: data?.role === "admin",
      email: user.email ?? null
    };
  } catch {
    return { isAuthenticated: false, isAdmin: false, email: null as string | null };
  }
}

export default async function StoreLayout({ children }: { children: ReactNode }) {
  const auth = await getAuthState();
  const nav = ["Home", "Services", "Install Plans", "Smart Security", "Support", "Resources"];
  const quickCategories = [
    "Home Security Setup",
    "Smart Lighting Install",
    "Doorbell Configuration",
    "Smart Lock Setup",
    "Automation Routines",
    "Network Optimization",
    "Maintenance Plans"
  ];

  return (
    <div className="min-h-screen">
      <div className="bg-slate-900 px-4 py-2 text-center text-xs font-medium text-white">
        New installease bundles available now - free smart-home audit with selected kits.
      </div>
      <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur dark:bg-slate-950/95">
        <div className="mx-auto hidden max-w-7xl items-center justify-between px-4 py-2 text-xs text-slate-500 md:flex">
          <p>Follow us: X / Facebook / Instagram / TikTok / YouTube</p>
          <AuthControls />
        </div>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <button className="rounded-lg border p-2 text-slate-600 md:hidden" aria-label="Open menu">
              <Menu className="h-4 w-4" />
            </button>
            <Link href="/" className="text-xl font-extrabold tracking-tight md:text-2xl">
              installease
            </Link>
          </div>
          <div className="relative hidden flex-1 md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input placeholder="Search services, installation plans..." className="w-full text-sm pl-10" />
          </div>
          <div className="flex items-center gap-2">
            {auth.isAuthenticated ? (
              <>
                <Link href="/account" className="hidden text-sm font-medium sm:block">
                  Account
                </Link>
                <div className="hidden sm:block">
                  <SignOutButton />
                </div>
              </>
            ) : (
              <>
                <Link href="/signin" className="hidden sm:block">
                  <Button size="sm" variant="outline">
                    Log in
                  </Button>
                </Link>
                <Link href="/signup" className="hidden sm:block">
                  <Button size="sm">Create Account</Button>
                </Link>
              </>
            )}
            {auth.isAdmin ? (
              <Link href="/admin" className="hidden text-sm font-medium sm:block">
                Admin
              </Link>
            ) : null}
            <Link href="/cart" className="hidden items-center gap-1 text-sm font-medium sm:flex">
              <ShoppingCart className="h-4 w-4" />
              Cart
            </Link>
            <CartDrawer />
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 pb-3 md:hidden">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input placeholder="Search services, installation plans..." className="w-full text-sm pl-10" />
          </div>
        </div>
        <div className="border-t">
          <div className="mx-auto hidden max-w-7xl flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 text-sm font-medium md:flex">
            {nav.map((item) => (
              <Link
                key={item}
                href={item === "Home" ? "/" : item === "Services" ? "/products" : "/search"}
                className="text-slate-700 hover:text-indigo-600 dark:text-slate-300"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
        <div className="border-t bg-slate-50 dark:bg-slate-900/50">
          <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2 [&::-webkit-scrollbar]:hidden">
            {quickCategories.map((item) => (
              <span key={item} className="whitespace-nowrap rounded-full bg-white px-3 py-1 text-xs dark:bg-slate-800">
                {item}
              </span>
            ))}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 pb-24 md:py-8 md:pb-8">{children}</main>
      <footer className="mt-8 border-t bg-white dark:bg-slate-950">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:grid-cols-4">
          <div>
            <p className="text-lg font-extrabold">installease</p>
            <p className="mt-2 text-sm text-slate-500">
              Smart home service platform for installation, automation, and ongoing support.
            </p>
          </div>
          <div className="text-sm">
            <p className="mb-2 font-semibold">Quick links</p>
            <div className="space-y-1 text-slate-500">
              <p>Search</p>
              <p>Service Catalog</p>
              <p>Contact</p>
            </div>
          </div>
          <div className="text-sm">
            <p className="mb-2 font-semibold">Support</p>
            <div className="space-y-1 text-slate-500">
              <p>Warranty policy</p>
              <p>Service policy</p>
              <p>Terms of service</p>
            </div>
          </div>
          <div className="text-sm">
            <p className="mb-2 font-semibold">Newsletter</p>
            <input className="w-full text-sm" placeholder="Your email" />
            <Button className="mt-2 w-full">Subscribe</Button>
          </div>
        </div>
        <div className="border-t px-4 py-4 text-center text-xs text-slate-500">© 2026 installease. All rights reserved.</div>
      </footer>
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white/95 px-4 py-2 backdrop-blur md:hidden dark:bg-slate-950/95">
        <div className="mx-auto grid max-w-7xl grid-cols-4 text-center text-[11px]">
          <Link href="/" className="flex flex-col items-center gap-1 py-1">
            <Home className="h-4 w-4" />
            Home
          </Link>
          <Link href="/products" className="flex flex-col items-center gap-1 py-1">
            <Search className="h-4 w-4" />
            Services
          </Link>
          <Link href="/cart" className="flex flex-col items-center gap-1 py-1">
            <ShoppingCart className="h-4 w-4" />
            Cart
          </Link>
          <Link href="/account" className="flex flex-col items-center gap-1 py-1">
            <User className="h-4 w-4" />
            Account
          </Link>
        </div>
        {auth.isAdmin ? (
          <Link
            href="/admin"
            className="mt-1 flex items-center justify-center gap-1 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
          >
            <LayoutDashboard className="h-4 w-4" />
            Admin Dashboard
          </Link>
        ) : null}
        {auth.isAuthenticated ? <SignOutButton className="mt-1 w-full" /> : null}
      </nav>
    </div>
  );
}
