"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL ?? "GHS";

type Row = {
  id: number;
  name: string;
  slug: string;
  sku: string;
  price: number;
  sale_price: number | null;
  stock: number;
  status: string;
  is_active: boolean;
  cover_image: string | null;
  images: unknown;
  created_at: string | null;
  category_name: string | null;
  brand_name: string | null;
};

function stockBadge(stock: number) {
  if (stock > 10) return { label: "In Stock", className: "bg-emerald-100 text-emerald-800" };
  if (stock > 0) return { label: "Low Stock", className: "bg-amber-100 text-amber-900" };
  return { label: "Out of Stock", className: "bg-red-100 text-red-800" };
}

function statusBadge(status: string, isActive: boolean) {
  if (status === "deleted") return { label: "Deleted", className: "bg-slate-200 text-slate-700" };
  if (status === "draft" || !isActive) return { label: "Draft", className: "bg-slate-100 text-slate-700" };
  return { label: "Active", className: "bg-emerald-100 text-emerald-800" };
}

export default function AdminProductsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "draft">("all");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/products", { cache: "no-store" });
        const body = (await res.json()) as { products?: Row[]; error?: string };
        if (!res.ok) throw new Error(body.error ?? "Failed to load products.");
        if (!cancelled) setRows(body.products ?? []);
      } catch {
        if (!cancelled) setRows([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (r.status === "deleted") {
        if (statusFilter === "active" || statusFilter === "draft") return false;
      }
      if (statusFilter === "active") {
        return r.status === "active" && r.is_active;
      }
      if (statusFilter === "draft") {
        return r.status === "draft" || (!r.is_active && r.status !== "deleted");
      }
      const needle = q.trim().toLowerCase();
      if (!needle) return true;
      return r.name.toLowerCase().includes(needle) || r.sku.toLowerCase().includes(needle);
    });
  }, [rows, q, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Products</h1>
          <p className="text-sm text-slate-500">Manage catalog, pricing, and media.</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add New Product
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or SKU…"
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-brand-accent"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "active", "draft"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setStatusFilter(f)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold capitalize transition ${
                statusFilter === f
                  ? "bg-brand-primary text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-brand-accent" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b bg-slate-50 text-xs font-semibold uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3">Cover</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-800">
                {filtered.map((r) => {
                  const sb = stockBadge(r.stock);
                  const st = statusBadge(r.status, r.is_active);
                  const thumb = r.cover_image ?? (Array.isArray(r.images) && r.images[0] ? String(r.images[0]) : null);
                  const created = r.created_at ? new Date(r.created_at).toLocaleDateString() : "—";
                  return (
                    <tr key={r.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3">
                        <div className="h-12 w-12 overflow-hidden rounded-lg border bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                          {thumb ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={thumb} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full items-center justify-center text-[10px] text-slate-400">No img</div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{r.name}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{r.category_name ?? "—"}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                        {currency} {Number(r.price).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${sb.className}`}>
                          {sb.label}
                        </span>
                        <span className="ml-2 text-xs text-slate-500">{r.stock}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${st.className}`}>
                          {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{created}</td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/products/${r.id}/edit`}
                          className="inline-flex rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-sm text-slate-500">
                      No products match your filters.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
