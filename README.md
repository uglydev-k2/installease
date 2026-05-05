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
