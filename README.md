# installease

Smart home ecommerce platform built with Next.js 14 App Router, TypeScript, Tailwind, and shadcn-style components.

## Setup

1. Copy `.env.example` to `.env.local` and fill credentials.
2. Install dependencies: `npm install`
3. Run locally: `npm run dev`

## Included in this scaffold

- App Router structure for store and admin sections
- Product catalogue and product detail pages with dynamic metadata
- Zustand cart store with cart drawer and cart page
- Supabase SQL migration scaffold in `supabase/migrations/0001_init.sql`
- API route stubs for products, orders, search, and Stripe webhook
- Tailwind + TypeScript + ESLint/Prettier baseline config

## Next implementation steps

- Wire real Supabase data and auth (email, Google, Apple)
- Build checkout with Stripe Elements and order persistence
- Complete account dashboard, wishlist, devices, and compatibility profile
- Expand admin analytics, product CRUD, inventory bulk operations

## Uploading product images

1. Create a public Supabase Storage bucket named `product-images` (or set `SUPABASE_STORAGE_BUCKET`).
2. Add `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `SUPABASE_STORAGE_BUCKET` to `.env.local`.
3. Open `/admin/products` and use the **Upload Product Image** card.
4. Copy the returned URL and save it to your product image array.

## Authentication setup

1. In Supabase Authentication, enable Email + Google + Apple providers.
2. Add your local site URL and production URL to allowed redirect URLs.
3. Ensure `.env.local` includes:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Use `/signin` and `/signup` for account access.
