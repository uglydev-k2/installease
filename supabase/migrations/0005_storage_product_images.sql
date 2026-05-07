-- Storage bucket + RLS for product-images (optional for server-side service-role uploads;
-- required for authenticated admin uploads from the browser).

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = excluded.public;

-- Policies (skip if they already exist from dashboard)
drop policy if exists "Admin can upload product images" on storage.objects;
create policy "Admin can upload product images"
on storage.objects for insert
with check (
  bucket_id = 'product-images'
  and auth.role() = 'authenticated'
  and (select role from public.profiles where id = auth.uid()) = 'admin'
);

drop policy if exists "Public can view product images" on storage.objects;
create policy "Public can view product images"
on storage.objects for select
using (bucket_id = 'product-images');

drop policy if exists "Admin can delete product images" on storage.objects;
create policy "Admin can delete product images"
on storage.objects for delete
using (
  bucket_id = 'product-images'
  and (select role from public.profiles where id = auth.uid()) = 'admin'
);

drop policy if exists "Admin can update product images" on storage.objects;
create policy "Admin can update product images"
on storage.objects for update
using (
  bucket_id = 'product-images'
  and (select role from public.profiles where id = auth.uid()) = 'admin'
);
