import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isProductImagePath, productImagesBucket } from "@/lib/admin/storage-path";

type AdminClient = ReturnType<typeof createServerSupabaseClient>;

export async function removeProductImagesFromStorage(supabase: AdminClient, urls: string[]) {
  const paths: string[] = [];
  for (const url of urls) {
    try {
      const u = new URL(url);
      const marker = `/storage/v1/object/public/${productImagesBucket}/`;
      const idx = u.pathname.indexOf(marker);
      if (idx === -1) continue;
      const path = decodeURIComponent(u.pathname.slice(idx + marker.length));
      if (isProductImagePath(path)) paths.push(path);
    } catch {
      /* ignore */
    }
  }
  if (paths.length === 0) return;
  await supabase.storage.from(productImagesBucket).remove(paths);
}
