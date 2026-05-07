create table if not exists promo_codes (
  id bigserial primary key,
  code text not null unique,
  discount_percent numeric(5,2),
  discount_amount numeric(10,2),
  min_order_subtotal numeric(10,2) default 0,
  expires_at timestamptz,
  active boolean not null default true,
  created_at timestamptz default now()
);

insert into promo_codes (code, discount_percent, min_order_subtotal, active)
values ('WELCOME10', 10, 0, true)
on conflict (code) do nothing;
