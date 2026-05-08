-- Paystack payment fields (Stripe columns retained for historical rows only).

alter table public.orders
  add column if not exists payment_reference text,
  add column if not exists payment_method text,
  add column if not exists payment_channel text;

create unique index if not exists orders_payment_reference_uidx
  on public.orders (payment_reference)
  where payment_reference is not null;

create index if not exists orders_payment_reference_idx
  on public.orders (payment_reference);
