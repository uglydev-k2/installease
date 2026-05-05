-- Installease initial schema

create table if not exists profiles (
  id uuid primary key,
  full_name text,
  avatar_url text,
  loyalty_points integer default 0,
  ecosystem_preferences jsonb default '[]'::jsonb
);

create table if not exists categories (
  id bigserial primary key,
  name text not null,
  slug text unique not null,
  icon text,
  parent_id bigint references categories(id)
);

create table if not exists brands (
  id bigserial primary key,
  name text not null unique,
  logo_url text
);

create table if not exists products (
  id bigserial primary key,
  name text not null,
  slug text not null unique,
  description text not null,
  price numeric(10,2) not null,
  sale_price numeric(10,2),
  images jsonb not null default '[]'::jsonb,
  category_id bigint references categories(id),
  brand_id bigint references brands(id),
  stock integer not null default 0,
  sku text not null unique,
  setup_difficulty text not null check (setup_difficulty in ('Beginner', 'Intermediate', 'Advanced')),
  ecosystems jsonb not null default '[]'::jsonb,
  specifications jsonb not null default '{}'::jsonb,
  is_active boolean not null default true
);

create table if not exists variants (
  id bigserial primary key,
  product_id bigint not null references products(id) on delete cascade,
  name text not null,
  value text not null,
  price_modifier numeric(10,2) default 0,
  stock integer not null default 0,
  sku text not null unique
);

create table if not exists addresses (
  id bigserial primary key,
  user_id uuid not null,
  label text,
  full_name text not null,
  phone text not null,
  line1 text not null,
  line2 text,
  city text not null,
  postcode text not null,
  country text not null,
  is_default boolean not null default false
);

create table if not exists orders (
  id bigserial primary key,
  user_id uuid,
  status text not null default 'placed',
  items jsonb not null default '[]'::jsonb,
  shipping_address jsonb not null default '{}'::jsonb,
  subtotal numeric(10,2) not null,
  shipping_cost numeric(10,2) not null default 0,
  discount numeric(10,2) not null default 0,
  tax numeric(10,2) not null default 0,
  total numeric(10,2) not null,
  stripe_payment_intent text,
  tracking_number text,
  created_at timestamptz default now()
);

create table if not exists order_items (
  id bigserial primary key,
  order_id bigint not null references orders(id) on delete cascade,
  product_id bigint not null references products(id),
  variant_id bigint references variants(id),
  quantity integer not null,
  price numeric(10,2) not null
);

create table if not exists carts (
  id bigserial primary key,
  user_id uuid,
  session_id text,
  created_at timestamptz default now()
);

create table if not exists cart_items (
  id bigserial primary key,
  cart_id bigint not null references carts(id) on delete cascade,
  product_id bigint not null references products(id),
  variant_id bigint references variants(id),
  quantity integer not null default 1
);

create table if not exists reviews (
  id bigserial primary key,
  product_id bigint not null references products(id) on delete cascade,
  user_id uuid not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  title text,
  body text,
  images jsonb not null default '[]'::jsonb,
  is_verified_purchase boolean not null default false,
  helpful_count integer not null default 0
);

create table if not exists questions (
  id bigserial primary key,
  product_id bigint not null references products(id) on delete cascade,
  user_id uuid not null,
  question text not null,
  answer text,
  answered_by uuid
);

create table if not exists wishlists (
  id bigserial primary key,
  user_id uuid not null,
  product_id bigint not null references products(id) on delete cascade,
  unique(user_id, product_id)
);

create table if not exists promo_codes (
  id bigserial primary key,
  code text unique not null,
  discount_type text not null check (discount_type in ('percentage', 'fixed')),
  discount_value numeric(10,2) not null,
  min_order numeric(10,2),
  uses_remaining integer,
  expires_at timestamptz
);
