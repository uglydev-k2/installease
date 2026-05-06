import { FlashSaleBanner } from "@/components/store/flash-sale-banner";
import { ProductCard } from "@/components/store/product-card";
import { products } from "@/lib/data/products";
import { Button } from "@/components/ui/button";
import { EcosystemBadge } from "@/components/shared/ecosystem-badge";
import Link from "next/link";

export default function HomePage() {
  const categories = [
    "Smart Lighting",
    "Smart Security",
    "Smart Sockets",
    "Doorbells",
    "Smart Locks",
    "Accessories"
  ];

  return (
    <div className="space-y-12">
      <section className="rounded-2xl bg-slate-100 p-3 text-center text-sm font-semibold dark:bg-slate-800">
        S26 SERIES IS HERE - Explore new-generation smart home automation hardware.
      </section>
      <section className="grid gap-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-700 p-8 text-white lg:grid-cols-[1.5fr_1fr]">
        <div>
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-indigo-200">Smart living, simplified</p>
          <h1 className="max-w-2xl text-4xl font-extrabold leading-tight lg:text-5xl">
            Build your intelligent home with installease
          </h1>
          <p className="mt-3 max-w-xl text-slate-200">
            Telefonika-inspired retail experience with premium devices, fast installation plans, and connected living bundles.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/products">
              <Button>Shop Now</Button>
            </Link>
            <Link href="/signup">
              <Button variant="secondary">Create Account</Button>
            </Link>
          </div>
        </div>
        <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
          <p className="text-sm font-medium text-indigo-100">Ecosystem Compatibility</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <EcosystemBadge ecosystem="alexa" />
            <EcosystemBadge ecosystem="google" />
            <EcosystemBadge ecosystem="homekit" />
            <EcosystemBadge ecosystem="matter" />
          </div>
          <p className="mt-4 text-sm text-slate-200">
            Add your ecosystem profile once, and we auto-suggest compatible devices.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border bg-white p-4 dark:bg-slate-900">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              className="rounded-full border bg-slate-50 px-4 py-2 text-sm font-medium hover:bg-indigo-50 dark:bg-slate-800"
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <FlashSaleBanner />

      <section className="grid gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5 text-center dark:bg-slate-900">
          <p className="text-2xl">🚚</p>
          <p className="mt-2 text-sm font-semibold">Free Delivery</p>
          <p className="text-xs text-slate-500">Within major cities</p>
        </div>
        <div className="rounded-2xl border bg-white p-5 text-center dark:bg-slate-900">
          <p className="text-2xl">✅</p>
          <p className="mt-2 text-sm font-semibold">100% Trusted</p>
          <p className="text-xs text-slate-500">Certified smart tech retailer</p>
        </div>
        <div className="rounded-2xl border bg-white p-5 text-center dark:bg-slate-900">
          <p className="text-2xl">🛡️</p>
          <p className="mt-2 text-sm font-semibold">Up to 3 Years Warranty</p>
          <p className="text-xs text-slate-500">On selected products</p>
        </div>
        <div className="rounded-2xl border bg-white p-5 text-center dark:bg-slate-900">
          <p className="text-2xl">💳</p>
          <p className="mt-2 text-sm font-semibold">Cards & Mobile Money</p>
          <p className="text-xs text-slate-500">Fast and secure payments</p>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Featured Products</h2>
            <p className="text-sm text-slate-500">Trending smart home gear picked for your setup.</p>
          </div>
          <Link href="/products" className="text-sm font-semibold text-indigo-600">
            View all
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-2xl bg-indigo-600 p-6 text-white">
          <p className="text-xs uppercase tracking-wider text-indigo-200">Bundle Offer</p>
          <h3 className="mt-2 text-xl font-bold">Security Starter Pack</h3>
          <p className="mt-1 text-sm text-indigo-100">Camera + Doorbell + Smart Lock. Save 22% this week.</p>
          <Button className="mt-4 bg-white text-indigo-700 hover:bg-indigo-50">Shop Bundle</Button>
        </article>
        <article className="rounded-2xl bg-slate-900 p-6 text-white">
          <p className="text-xs uppercase tracking-wider text-slate-300">Install Service</p>
          <h3 className="mt-2 text-xl font-bold">Same-Day Setup</h3>
          <p className="mt-1 text-sm text-slate-300">Book certified installers to configure your entire home.</p>
          <Button className="mt-4">Book Now</Button>
        </article>
        <article className="rounded-2xl border bg-white p-6 dark:bg-slate-900">
          <p className="text-xs uppercase tracking-wider text-slate-500">Newsletter</p>
          <h3 className="mt-2 text-xl font-bold">Get weekly smart home drops</h3>
          <p className="mt-1 text-sm text-slate-500">Early access to new devices, flash sales, and setup tips.</p>
          <div className="mt-4 flex gap-2">
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border px-3 py-2 text-sm"
            />
            <Button>Join</Button>
          </div>
        </article>
      </section>
      <section className="rounded-2xl border bg-white p-6 dark:bg-slate-900">
        <h3 className="text-xl font-semibold">Build Your Smart Home in 3 Steps</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
            <p className="text-sm font-semibold">1. Pick your ecosystem</p>
            <p className="text-sm text-slate-500">Alexa, Google, HomeKit, or Matter-ready.</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
            <p className="text-sm font-semibold">2. Choose compatible devices</p>
            <p className="text-sm text-slate-500">Auto-filtered products for zero setup frustration.</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
            <p className="text-sm font-semibold">3. Track and control</p>
            <p className="text-sm text-slate-500">Monitor orders and devices from your account dashboard.</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-slate-900 p-8 text-white">
        <p className="text-xs uppercase tracking-wider text-slate-300">Special Discounts</p>
        <h3 className="mt-2 text-3xl font-extrabold">Where luxury meets innovation</h3>
        <p className="mt-2 max-w-2xl text-slate-300">
          Explore premium smart locks, flagship doorbells, and AI cameras with exclusive limited-time pricing.
        </p>
        <div className="mt-5 flex gap-3">
          <Button>View Product</Button>
          <Button variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900">
            Learn More
          </Button>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <h3 className="text-xl font-semibold">Explore our Blogs</h3>
          <Link href="/search" className="text-sm font-medium text-indigo-600">
            Read all
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border bg-white p-4 dark:bg-slate-900">
            <h4 className="font-semibold">How to build a secure smart home in 2026</h4>
            <p className="mt-2 text-sm text-slate-500">A practical checklist for cameras, locks, and automations.</p>
          </article>
          <article className="rounded-2xl border bg-white p-4 dark:bg-slate-900">
            <h4 className="font-semibold">Matter vs HomeKit vs Alexa: What to choose</h4>
            <p className="mt-2 text-sm text-slate-500">Compatibility guidance before buying your first devices.</p>
          </article>
          <article className="rounded-2xl border bg-white p-4 dark:bg-slate-900">
            <h4 className="font-semibold">Best smart bundles for renters and new homes</h4>
            <p className="mt-2 text-sm text-slate-500">Starter, advanced, and premium bundle recommendations.</p>
          </article>
        </div>
      </section>
    </div>
  );
}
