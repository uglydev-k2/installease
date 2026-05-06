-- Backend hardening: indexes, updated_at triggers, and RLS defaults.

create extension if not exists pgcrypto;

alter table products add column if not exists created_at timestamptz default now();
alter table products add column if not exists updated_at timestamptz default now();
alter table profiles add column if not exists created_at timestamptz default now();
alter table profiles add column if not exists updated_at timestamptz default now();
alter table carts add column if not exists updated_at timestamptz default now();
alter table orders add column if not exists updated_at timestamptz default now();

create index if not exists idx_products_slug on products(slug);
create index if not exists idx_products_active on products(is_active);
create index if not exists idx_orders_user_id on orders(user_id);
create index if not exists idx_orders_created_at on orders(created_at desc);
create index if not exists idx_cart_items_cart_id on cart_items(cart_id);
create index if not exists idx_wishlists_user on wishlists(user_id);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_products_updated_at on products;
create trigger trg_products_updated_at before update on products
for each row execute function set_updated_at();

drop trigger if exists trg_profiles_updated_at on profiles;
create trigger trg_profiles_updated_at before update on profiles
for each row execute function set_updated_at();

drop trigger if exists trg_carts_updated_at on carts;
create trigger trg_carts_updated_at before update on carts
for each row execute function set_updated_at();

drop trigger if exists trg_orders_updated_at on orders;
create trigger trg_orders_updated_at before update on orders
for each row execute function set_updated_at();

alter table profiles enable row level security;
alter table addresses enable row level security;
alter table carts enable row level security;
alter table cart_items enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table wishlists enable row level security;
alter table reviews enable row level security;
alter table questions enable row level security;

drop policy if exists "profiles_select_own" on profiles;
create policy "profiles_select_own" on profiles
for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on profiles;
create policy "profiles_update_own" on profiles
for update using (auth.uid() = id);

drop policy if exists "products_public_read" on products;
create policy "products_public_read" on products
for select using (is_active = true);
