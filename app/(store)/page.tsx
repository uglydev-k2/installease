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
        Smart Home Service Week - Book setup, automation, and maintenance at discounted rates.
      </section>
      <section className="grid gap-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-700 p-8 text-white lg:grid-cols-[1.5fr_1fr]">
        <div>
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-indigo-200">Smart living, simplified</p>
          <h1 className="max-w-2xl text-4xl font-extrabold leading-tight lg:text-5xl">
            Build your intelligent home with installease
          </h1>
          <p className="mt-3 max-w-xl text-slate-200">
            Smart home services for installation, configuration, and optimization across security, lighting, locks, and automation routines.
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
            Share your ecosystem profile once, and we recommend compatible setup services.
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
          <p className="text-xs text-slate-500">Certified smart home service team</p>
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
            <h2 className="text-2xl font-semibold">Featured Solutions</h2>
            <p className="text-sm text-slate-500">Popular smart home packages tailored to your setup goals.</p>
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
          <h3 className="mt-2 text-xl font-bold">Home Security Setup Package</h3>
          <p className="mt-1 text-sm text-indigo-100">Professional installation for camera, doorbell, and smart lock systems.</p>
          <Button className="mt-4 bg-white text-indigo-700 hover:bg-indigo-50">Book Package</Button>
        </article>
        <article className="rounded-2xl bg-slate-900 p-6 text-white">
          <p className="text-xs uppercase tracking-wider text-slate-300">Install Service</p>
          <h3 className="mt-2 text-xl font-bold">Same-Day Setup</h3>
          <p className="mt-1 text-sm text-slate-300">Book certified installers to configure your entire home.</p>
          <Button className="mt-4">Book Now</Button>
        </article>
        <article className="rounded-2xl border bg-white p-6 dark:bg-slate-900">
          <p className="text-xs uppercase tracking-wider text-slate-500">Newsletter</p>
          <h3 className="mt-2 text-xl font-bold">Get weekly smart home service updates</h3>
          <p className="mt-1 text-sm text-slate-500">Receive maintenance tips, automation ideas, and service offers.</p>
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
        <h3 className="mt-2 text-3xl font-extrabold">Where reliable service meets automation</h3>
        <p className="mt-2 max-w-2xl text-slate-300">
          Save on installation, diagnostics, and optimization services for your full smart home ecosystem.
        </p>
        <div className="mt-5 flex gap-3">
          <Button>View Services</Button>
          <Button variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900">
            Learn More
          </Button>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <h3 className="text-xl font-semibold">Explore our Service Guides</h3>
          <Link href="/search" className="text-sm font-medium text-indigo-600">
            Read all
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border bg-white p-4 dark:bg-slate-900">
            <h4 className="font-semibold">How to build a secure smart home in 2026</h4>
            <p className="mt-2 text-sm text-slate-500">A practical checklist for professional setup, alerts, and automation.</p>
          </article>
          <article className="rounded-2xl border bg-white p-4 dark:bg-slate-900">
            <h4 className="font-semibold">Matter vs HomeKit vs Alexa: Which service path is best</h4>
            <p className="mt-2 text-sm text-slate-500">Compatibility guidance before booking installation and configuration.</p>
          </article>
          <article className="rounded-2xl border bg-white p-4 dark:bg-slate-900">
            <h4 className="font-semibold">Best service plans for renters and new homes</h4>
            <p className="mt-2 text-sm text-slate-500">Starter, advanced, and premium service plan recommendations.</p>
          </article>
        </div>
      </section>
    </div>
  );
}
