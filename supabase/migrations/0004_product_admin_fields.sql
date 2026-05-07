-- Extended product fields for admin catalog (drafts, media, merchandising).

alter table products add column if not exists short_description text;
alter table products add column if not exists low_stock_threshold integer not null default 5;
alter table products add column if not exists cover_image text;
alter table products add column if not exists tags jsonb not null default '[]'::jsonb;
alter table products add column if not exists status text;
alter table products add column if not exists weight_grams integer;
alter table products add column if not exists dimensions jsonb;

update products
set status = case when is_active then 'active' else 'draft' end
where status is null;

alter table products alter column status set not null;
alter table products alter column status set default 'draft';

alter table products drop constraint if exists products_status_check;
alter table products add constraint products_status_check
  check (status in ('draft', 'active', 'deleted'));

-- Backfill short_description for existing rows
update products
set short_description = left(coalesce(description, ''), 160)
where short_description is null;

alter table products alter column short_description set not null;

-- First gallery image as cover when missing
update products
set cover_image = images->>0
where cover_image is null
  and images is not null
  and jsonb_typeof(images) = 'array'
  and jsonb_array_length(images) > 0;

