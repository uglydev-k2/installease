/**
 * Supabase Storage setup (see `supabase/migrations/0005_storage_product_images.sql`):
 *
 * - Bucket: `product-images` (public)
 * - RLS for authenticated admin insert/delete and public select
 *
 * This UI uploads via `/api/admin/product-images` (server uses the service role).
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ImageIcon, Loader2, Star, Trash2, UploadCloud, Check, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { z } from "zod";
import type { productFormSchema } from "@/lib/admin/product-form-schema";

export type GalleryValue = z.infer<typeof productFormSchema>["gallery"][number];

type RowState = {
  key: string;
  previewUrl: string;
  file?: File;
  url?: string;
  path?: string;
  name: string;
  size: number;
  progress: number;
  status: "queued" | "uploading" | "done" | "error";
  error?: string;
};

const ACCEPT = new Set(["image/png", "image/jpeg", "image/webp"]);
const MAX_BYTES = 5 * 1024 * 1024;
const MAX_FILES = 8;

function uploadWithProgress(
  file: File,
  slug: string,
  onProgress: (pct: number) => void
): Promise<{ url: string; path: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const fd = new FormData();
    fd.append("file", file);
    fd.append("slug", slug);

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const body = JSON.parse(xhr.responseText) as { url?: string; path?: string; error?: string };
          if (body.url && body.path) resolve({ url: body.url, path: body.path });
          else reject(new Error(body.error ?? "Upload failed."));
        } catch {
          reject(new Error("Invalid server response."));
        }
      } else {
        try {
          const body = JSON.parse(xhr.responseText) as { error?: string };
          reject(new Error(body.error ?? `Upload failed (${xhr.status}).`));
        } catch {
          reject(new Error(`Upload failed (${xhr.status}).`));
        }
      }
    });

    xhr.addEventListener("error", () => reject(new Error("Network error during upload.")));
    xhr.open("POST", "/api/admin/product-images");
    xhr.send(fd);
  });
}

function rowsFromGallery(gallery: GalleryValue[]): RowState[] {
  return gallery.map((g, i) => ({
    key: `remote-${i}-${g.url.slice(-24)}`,
    previewUrl: g.url,
    url: g.url,
    path: g.path,
    name: g.url.split("/").pop() ?? "image",
    size: 0,
    progress: 100,
    status: "done" as const
  }));
}

function mergeToGallery(rows: RowState[]): GalleryValue[] {
  return rows
    .filter((r) => r.status === "done" && r.url)
    .map((r) => ({ url: r.url!, path: r.path }));
}

type ProductImageUploaderProps = {
  slug: string;
  value: GalleryValue[];
  onChange: (next: GalleryValue[]) => void;
  disabled?: boolean;
};

export function ProductImageUploader({ slug, value, onChange, disabled }: ProductImageUploaderProps) {
  const [rows, setRows] = useState<RowState[]>(() => rowsFromGallery(value));
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragKey = useRef<string | null>(null);
  const uploadingRef = useRef(false);

  useEffect(() => {
    setRows((prev) => {
      if (prev.some((r) => r.status === "uploading" || r.status === "queued")) return prev;
      const want = value.map((v) => v.url).join("|");
      const have = mergeToGallery(prev)
        .map((v) => v.url)
        .join("|");
      if (want === have) return prev;
      return rowsFromGallery(value);
    });
  }, [value]);

  const updateRow = useCallback((key: string, patch: Partial<RowState>) => {
    setRows((prev) => {
      const next = prev.map((r) => (r.key === key ? { ...r, ...patch } : r));
      onChange(mergeToGallery(next));
      return next;
    });
  }, [onChange]);

  const runUploads = useCallback(
    async (staged: RowState[]) => {
      uploadingRef.current = true;
      for (const row of staged) {
        if (!row.file) continue;
        setRows((prev) => {
          const has = prev.some((r) => r.key === row.key);
          const base = has ? prev : [...prev, row];
          return base.map((r) =>
            r.key === row.key ? { ...r, status: "uploading" as const, progress: 0, error: undefined } : r
          );
        });
        try {
          const { url, path } = await uploadWithProgress(row.file, slug, (pct) => {
            setRows((prev) => {
              const next = prev.map((r) => (r.key === row.key ? { ...r, progress: pct } : r));
              return next;
            });
          });
          if (row.previewUrl.startsWith("blob:")) {
            URL.revokeObjectURL(row.previewUrl);
          }
          setRows((prev) => {
            const next = prev.map((r) =>
              r.key === row.key
                ? { ...r, status: "done" as const, progress: 100, url, path, previewUrl: url, file: undefined }
                : r
            );
            onChange(mergeToGallery(next));
            return next;
          });
        } catch (e) {
          const message = e instanceof Error ? e.message : "Upload failed.";
          toast.error(message);
          updateRow(row.key, { status: "error", error: message, progress: 0 });
        }
      }
      uploadingRef.current = false;
    },
    [slug, updateRow, onChange]
  );

  const addFiles = useCallback(
    (fileList: FileList | File[]) => {
      const list = Array.from(fileList);
      if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
        toast.error("Set a valid product slug before uploading images.");
        return;
      }

      setRows((prev) => {
        const busy = prev.filter((r) => r.status === "uploading" || r.status === "queued").length;
        const done = prev.filter((r) => r.status === "done").length;
        const slots = MAX_FILES - done - busy;
        if (slots <= 0) {
          toast.error(`You can upload at most ${MAX_FILES} images.`);
          return prev;
        }

        const staged: RowState[] = [];
        let used = 0;

        for (const file of list) {
          if (used >= slots) {
            toast.error(`You can upload at most ${MAX_FILES} images.`);
            break;
          }
          if (!ACCEPT.has(file.type)) {
            toast.error(`${file.name}: only PNG, JPG, or WEBP are allowed.`);
            continue;
          }
          if (file.size > MAX_BYTES) {
            toast.error(`${file.name}: file exceeds 5MB.`);
            continue;
          }
          const key = `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
          staged.push({
            key,
            previewUrl: URL.createObjectURL(file),
            file,
            name: file.name,
            size: file.size,
            progress: 0,
            status: "queued"
          });
          used += 1;
        }

        if (staged.length === 0) return prev;
        const next = [...prev, ...staged];
        window.setTimeout(() => {
          void runUploads(staged);
        }, 0);
        return next;
      });
    },
    [slug, runUploads]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files;
    if (f?.length) addFiles(f);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const removeRow = async (key: string) => {
    const row = rows.find((r) => r.key === key);
    if (!row) return;
    if (row.previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(row.previewUrl);
    }
    if (row.path && row.status === "done") {
      try {
        const res = await fetch("/api/admin/product-images", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: row.path })
        });
        if (!res.ok) {
          const body = (await res.json()) as { error?: string };
          throw new Error(body.error ?? "Delete failed.");
        }
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Could not delete file from storage.");
        return;
      }
    }
    setRows((prev) => {
      const next = prev.filter((r) => r.key !== key);
      onChange(mergeToGallery(next));
      return next;
    });
  };

  const setPrimary = (key: string) => {
    setRows((prev) => {
      const idx = prev.findIndex((r) => r.key === key);
      if (idx <= 0) return prev;
      const copy = [...prev];
      const [item] = copy.splice(idx, 1);
      copy.unshift(item);
      onChange(mergeToGallery(copy));
      return copy;
    });
  };

  const onDragStartRow = (key: string) => {
    dragKey.current = key;
  };

  const onDragOverRow = (e: React.DragEvent, overKey: string) => {
    e.preventDefault();
    const from = dragKey.current;
    if (!from || from === overKey) return;
    setRows((prev) => {
      const fi = prev.findIndex((r) => r.key === from);
      const ti = prev.findIndex((r) => r.key === overKey);
      if (fi < 0 || ti < 0) return prev;
      const copy = [...prev];
      const [moved] = copy.splice(fi, 1);
      copy.splice(ti, 0, moved);
      onChange(mergeToGallery(copy));
      return copy;
    });
  };

  const onDragEndRow = () => {
    dragKey.current = null;
  };

  const doneCount = rows.filter((r) => r.status === "done").length;

  return (
    <div className="space-y-4">
      <label
        onDragEnter={(e) => {
          e.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 transition",
          dragOver ? "border-brand-accent bg-indigo-50/80 dark:bg-indigo-950/40" : "border-slate-300 bg-slate-50/50 dark:border-slate-600 dark:bg-slate-900/40",
          disabled && "pointer-events-none opacity-50"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          className="sr-only"
          disabled={disabled}
          onChange={onInputChange}
        />
        <UploadCloud className="mb-3 h-10 w-10 text-slate-400" />
        <p className="text-center text-sm font-semibold text-slate-800 dark:text-slate-100">
          Drag images here or click to browse
        </p>
        <p className="mt-1 text-center text-xs text-slate-500">PNG, JPG, WEBP up to 5MB each. Max {MAX_FILES} images.</p>
        <button
          type="button"
          className="mt-4 rounded-xl bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          onClick={() => inputRef.current?.click()}
        >
          Browse files
        </button>
      </label>

      <p className="text-sm text-slate-600 dark:text-slate-400">
        {doneCount} of {MAX_FILES} images uploaded
      </p>
      <p className="text-xs text-slate-500">
        Drag tiles to reorder. The first image is the storefront cover. Double-click a tile or use the star to set cover.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {rows.map((row, index) => (
          <div
            key={row.key}
            draggable={row.status === "done"}
            onDragStart={() => onDragStartRow(row.key)}
            onDragOver={(e) => onDragOverRow(e, row.key)}
            onDragEnd={onDragEndRow}
            onDoubleClick={() => {
              if (row.status === "done" && index !== 0) setPrimary(row.key);
            }}
            className={cn(
              "group relative aspect-square cursor-pointer overflow-hidden rounded-xl border bg-white shadow-sm dark:bg-slate-900",
              index === 0 && row.status === "done" && "ring-2 ring-brand-success"
            )}
          >
            <button
              type="button"
              onClick={() => void removeRow(row.key)}
              className="absolute right-1 top-1 z-10 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100"
              aria-label="Remove image"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            {index === 0 && row.status === "done" ? (
              <span className="absolute left-1 top-1 z-10 flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                <Star className="h-3 w-3 fill-current" />
                Primary
              </span>
            ) : null}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={row.previewUrl} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 space-y-1 bg-gradient-to-t from-black/80 to-transparent p-2 pt-6 text-[10px] text-white">
              <p className="truncate font-medium">{row.name}</p>
              {row.size > 0 ? <p>{(row.size / 1024).toFixed(0)} KB</p> : null}
              {row.status === "uploading" || row.status === "queued" ? (
                <div className="h-1 w-full overflow-hidden rounded-full bg-white/30">
                  <div
                    className="h-full rounded-full bg-brand-accent transition-all"
                    style={{ width: `${row.progress}%` }}
                  />
                </div>
              ) : null}
              <div className="flex items-center justify-between">
                <span className="capitalize">{row.status}</span>
                <span>
                  {row.status === "uploading" || row.status === "queued" ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : null}
                  {row.status === "done" ? <Check className="h-3 w-3 text-emerald-300" /> : null}
                  {row.status === "error" ? <X className="h-3 w-3 text-red-300" /> : null}
                </span>
              </div>
              {row.status === "error" && row.error ? <p className="text-[9px] text-red-200">{row.error}</p> : null}
            </div>
            {row.status === "done" && index !== 0 ? (
              <button
                type="button"
                onClick={() => setPrimary(row.key)}
                className="absolute bottom-10 right-1 rounded-full bg-white/90 p-1 text-slate-800 shadow"
                title="Set as cover"
              >
                <Star className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-8 text-slate-400">
          <ImageIcon className="mb-2 h-8 w-8" />
          <p className="text-sm">No images yet</p>
        </div>
      ) : null}
    </div>
  );
}
