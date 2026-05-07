"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import * as Tooltip from "@radix-ui/react-tooltip";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  HelpCircle,
  Loader2,
  Plus,
  Sparkles,
  X
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ecosystemValues,
  productFormSchema,
  slugifyName,
  step1Schema,
  step2Schema,
  step3Schema,
  type ProductFormValues
} from "@/lib/admin/product-form-schema";
import { ProductImageUploader, type GalleryValue } from "@/components/admin/ProductImageUploader";

const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL ?? "GHS";

type CategoryRow = { id: number; name: string; slug: string };
type BrandRow = { id: number; name: string };

const defaultValues: ProductFormValues = {
  name: "",
  slug: "",
  categoryId: 0,
  brandId: 0,
  shortDescription: "",
  description: "",
  setupDifficulty: "beginner",
  ecosystems: [],
  status: "draft",
  tags: [],
  price: 0,
  salePrice: undefined,
  sku: "",
  stock: 0,
  lowStockThreshold: 5,
  weightGrams: undefined,
  dimensions: { length: undefined, width: undefined, height: undefined },
  gallery: []
};

const step1Fields: (keyof ProductFormValues)[] = [
  "name",
  "slug",
  "categoryId",
  "brandId",
  "shortDescription",
  "description",
  "setupDifficulty",
  "ecosystems",
  "status",
  "tags"
];

const step2Fields: (keyof ProductFormValues)[] = [
  "price",
  "salePrice",
  "sku",
  "stock",
  "lowStockThreshold",
  "weightGrams",
  "dimensions"
];

const ecosystemUi: { value: (typeof ecosystemValues)[number]; label: string; hint: string }[] = [
  { value: "alexa", label: "Alexa", hint: "Amazon Echo / Alexa routines" },
  { value: "google", label: "Google Home", hint: "Google Nest / Assistant" },
  { value: "homekit", label: "Apple HomeKit", hint: "Home app & Siri" },
  { value: "matter", label: "Matter", hint: "Cross-platform Matter devices" }
];

const difficultyUi: {
  value: ProductFormValues["setupDifficulty"];
  label: string;
  hint: string;
}[] = [
  { value: "beginner", label: "Beginner", hint: "Plug-and-play; no hub wiring or networking required." },
  { value: "intermediate", label: "Intermediate", hint: "Needs app setup or pairing with an existing hub." },
  { value: "advanced", label: "Advanced", hint: "May require wiring, VLANs, or advanced hub configuration." }
];

function inputClass(err?: boolean) {
  return cn(
    "w-full rounded-xl border border-gray-200 bg-white text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-brand-accent",
    err ? "border-red-500" : ""
  );
}

type WizardMode = "create" | "edit";

type AddProductWizardProps = {
  mode: WizardMode;
  productId?: string;
};

export function AddProductWizard({ mode, productId }: AddProductWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [slugManual, setSlugManual] = useState(false);
  const [catalog, setCatalog] = useState<{ categories: CategoryRow[]; brands: BrandRow[] } | null>(null);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [loadingProduct, setLoadingProduct] = useState(mode === "edit");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<null | { name: string; slug: string; cover?: string }>(null);
  const [tagDraft, setTagDraft] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
    mode: "onChange"
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    trigger,
    reset,
    formState: { errors }
  } = form;

  const name = watch("name");
  const slug = watch("slug");
  const price = watch("price");
  const salePrice = watch("salePrice");
  const stock = watch("stock");
  const brandId = watch("brandId");
  const categoryId = watch("categoryId");
  const tags = watch("tags");
  const ecosystems = watch("ecosystems");
  const gallery = watch("gallery");

  const slugRegister = register("slug");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/catalog");
        const body = (await res.json()) as { categories?: CategoryRow[]; brands?: BrandRow[]; error?: string };
        if (!res.ok) throw new Error(body.error ?? "Failed to load catalog.");
        if (!cancelled) {
          setCatalog({ categories: body.categories ?? [], brands: body.brands ?? [] });
        }
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to load catalog.");
      } finally {
        if (!cancelled) setLoadingCatalog(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (mode !== "edit" || !productId) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/admin/products/${productId}`);
        const body = (await res.json()) as { product?: { form: ProductFormValues }; error?: string };
        if (!res.ok) throw new Error(body.error ?? "Failed to load product.");
        if (!cancelled && body.product?.form) {
          reset({ ...defaultValues, ...body.product.form });
          setSlugManual(true);
        }
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to load product.");
      } finally {
        if (!cancelled) setLoadingProduct(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mode, productId, reset]);

  useEffect(() => {
    if (slugManual) return;
    const next = slugifyName(name);
    if (next !== slug) setValue("slug", next, { shouldValidate: true });
  }, [name, slug, slugManual, setValue]);

  const suggestSku = useCallback(() => {
    const brand = catalog?.brands.find((b) => b.id === brandId);
    const cat = catalog?.categories.find((c) => c.id === categoryId);
    const b = (brand?.name ?? "BRAND").replace(/[^a-z0-9]/gi, "").slice(0, 4).toUpperCase() || "BRND";
    const c = (cat?.slug ?? "CAT").replace(/[^a-z0-9]/gi, "").slice(0, 4).toUpperCase() || "CAT";
    const rnd = String(Math.floor(1000 + Math.random() * 9000));
    setValue("sku", `${b}-${c}-${rnd}`, { shouldValidate: true });
  }, [brandId, categoryId, catalog, setValue]);

  const salePct = useMemo(() => {
    if (!salePrice || salePrice <= 0 || !price || price <= 0) return null;
    if (salePrice >= price) return null;
    return Math.round(((price - salePrice) / price) * 100);
  }, [price, salePrice]);

  const stockBadge = useMemo(() => {
    if (stock > 10) return { label: "In Stock", className: "bg-emerald-100 text-emerald-800" };
    if (stock > 0) return { label: "Low Stock", className: "bg-amber-100 text-amber-900" };
    return { label: "Out of Stock", className: "bg-red-100 text-red-800" };
  }, [stock]);

  const stepValid = useCallback(async () => {
    if (step === 0) {
      const ok = await trigger(step1Fields);
      return ok;
    }
    if (step === 1) {
      const ok = await trigger(step2Fields);
      return ok;
    }
    const ok = await trigger(["gallery"]);
    return ok;
  }, [step, trigger]);

  const nextStep = async () => {
    clearErrors();
    const ok = await stepValid();
    if (!ok) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    if (step === 0) {
      const parsed = step1Schema.safeParse(form.getValues());
      if (!parsed.success) {
        toast.error("Please complete all required fields.");
        return;
      }
    }
    if (step === 1) {
      const parsed = step2Schema.safeParse(form.getValues());
      if (!parsed.success) {
        toast.error("Please complete pricing & inventory.");
        return;
      }
    }
    if (step < 2) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => Math.max(0, s - 1));

  const onSubmit = async (values: ProductFormValues) => {
    setSubmitting(true);
    try {
      const parsed = productFormSchema.safeParse(values);
      if (!parsed.success) {
        toast.error("Validation failed. Check all steps.");
        setSubmitting(false);
        return;
      }
      const url = mode === "edit" ? `/api/admin/products/${productId}` : "/api/admin/products";
      const res = await fetch(url, {
        method: mode === "edit" ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data)
      });
      const body = (await res.json()) as {
        error?: string;
        field?: string;
        product?: { name?: string; slug?: string; cover_image?: string };
      };
      if (!res.ok) {
        if (body.field === "slug") {
          setError("slug", { message: "This slug is already in use." });
        }
        throw new Error(body.error ?? "Could not save product.");
      }
      if (mode === "edit") {
        toast.success("Product updated.");
        router.push("/admin/products");
        router.refresh();
        return;
      }
      setSuccess({
        name: body.product?.name ?? values.name,
        slug: body.product?.slug ?? values.slug,
        cover: body.product?.cover_image ?? values.gallery[0]?.url
      });
      toast.success("Product added successfully.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!success) return;
    const t = window.setTimeout(() => {
      router.push("/admin/products");
      router.refresh();
    }, 2000);
    return () => window.clearTimeout(t);
  }, [success, router]);

  const addTag = (raw: string) => {
    const t = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!t.length) return;
    const merged = [...new Set([...tags, ...t])];
    setValue("tags", merged, { shouldValidate: true });
    setTagDraft("");
  };

  const toggleEco = (v: (typeof ecosystemValues)[number]) => {
    const has = ecosystems.includes(v);
    setValue("ecosystems", has ? ecosystems.filter((x) => x !== v) : [...ecosystems, v], {
      shouldValidate: true
    });
  };

  const handleDeleteProduct = async () => {
    if (!productId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
      const body = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(body.error ?? "Delete failed.");
      toast.success("Product removed from catalog.");
      router.push("/admin/products");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed.");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  if (loadingCatalog || loadingProduct) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center rounded-2xl border bg-white p-8 dark:bg-slate-900">
        <Loader2 className="h-8 w-8 animate-spin text-brand-accent" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 p-6 text-center dark:bg-slate-950/95">
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Product added successfully!</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">{success.name}</p>
          {success.cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={success.cover} alt="" className="mx-auto mt-4 h-28 w-28 rounded-2xl object-cover shadow-md" />
          ) : null}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button type="button" variant="outline" onClick={() => router.push(`/products/${success.slug}`)}>
              View Product
            </Button>
            <Button type="button" onClick={() => router.push("/admin/products/new")}>
              Add Another Product
            </Button>
          </div>
          <p className="mt-6 text-xs text-slate-500">Redirecting to product list…</p>
        </motion.div>
      </div>
    );
  }

  const nextDisabled =
    (step === 0 && !step1Schema.safeParse(form.getValues()).success) ||
    (step === 1 && !step2Schema.safeParse(form.getValues()).success) ||
    (step === 2 && !step3Schema.safeParse({ gallery: gallery as GalleryValue[] }).success);

  return (
    <Tooltip.Provider delayDuration={200}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto max-w-3xl pb-28 md:pb-8"
      >
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {mode === "edit" ? "Edit product" : "New product"}
            </p>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {mode === "edit" ? "Update listing" : "Add a product"}
            </h1>
          </div>
        </div>

        <div className="mb-10 flex items-center justify-between gap-2">
          {[0, 1, 2].map((i, idx, arr) => (
            <div key={i} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition",
                    step > i && "border-emerald-700 bg-emerald-700 text-white",
                    step === i && "border-brand-primary bg-brand-primary text-white",
                    step < i && "border-slate-300 bg-white text-slate-400 dark:border-slate-600 dark:bg-slate-900"
                  )}
                >
                  {step > i ? <Check className="h-5 w-5" /> : i + 1}
                </div>
                <span className="hidden text-[10px] font-semibold uppercase text-slate-500 sm:block">
                  {i === 0 ? "Basics" : i === 1 ? "Pricing" : "Images"}
                </span>
              </div>
              {idx < arr.length - 1 ? (
                <div
                  className={cn(
                    "mx-1 h-0.5 flex-1 rounded-full bg-slate-200 dark:bg-slate-700",
                    step > i && "bg-emerald-700"
                  )}
                />
              ) : null}
            </div>
          ))}
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900 md:p-8">
          <AnimatePresence mode="wait">
            {step === 0 ? (
              <motion.div
                key="s0"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Basic information</p>
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Product name</label>
                  <input {...register("name")} className={cn("mt-1", inputClass(!!errors.name))} maxLength={100} />
                  {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name.message}</p> : null}
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Slug</label>
                  <input
                    {...slugRegister}
                    onChange={(e) => {
                      setSlugManual(true);
                      void slugRegister.onChange(e);
                    }}
                    className={cn("mt-1", inputClass(!!errors.slug))}
                  />
                  {errors.slug ? <p className="mt-1 text-xs text-red-600">{errors.slug.message}</p> : null}
                  <p className="mt-1 text-xs text-slate-500">
                    Page URL: <span className="font-mono text-slate-700 dark:text-slate-300">/products/{slug || "…"}</span>
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold uppercase text-slate-500">Category</label>
                    <select {...register("categoryId", { valueAsNumber: true })} className={cn("mt-1", inputClass(!!errors.categoryId))}>
                      <option value={0}>Select category</option>
                      {(catalog?.categories ?? []).map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    {errors.categoryId ? <p className="mt-1 text-xs text-red-600">{errors.categoryId.message}</p> : null}
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase text-slate-500">Brand</label>
                    <select {...register("brandId", { valueAsNumber: true })} className={cn("mt-1", inputClass(!!errors.brandId))}>
                      <option value={0}>Select brand</option>
                      {(catalog?.brands ?? []).map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                    {errors.brandId ? <p className="mt-1 text-xs text-red-600">{errors.brandId.message}</p> : null}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Short description</label>
                  <textarea
                    {...register("shortDescription")}
                    rows={3}
                    maxLength={160}
                    className={cn("mt-1 resize-none", inputClass(!!errors.shortDescription))}
                  />
                  <div className="mt-1 flex justify-between text-xs text-slate-500">
                    <span>{errors.shortDescription?.message}</span>
                    <span>{watch("shortDescription")?.length ?? 0}/160</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Full description</label>
                  <textarea
                    {...register("description")}
                    rows={6}
                    maxLength={2000}
                    className={cn("mt-1", inputClass(!!errors.description))}
                  />
                  <div className="mt-1 flex justify-between text-xs text-slate-500">
                    <span>{errors.description?.message}</span>
                    <span>{watch("description")?.length ?? 0}/2000</span>
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <p className="text-xs font-semibold uppercase text-slate-500">Setup difficulty</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {difficultyUi.map((d) => (
                      <Tooltip.Root key={d.value}>
                        <Tooltip.Trigger asChild>
                          <button
                            type="button"
                            onClick={() => setValue("setupDifficulty", d.value, { shouldValidate: true })}
                            className={cn(
                              "rounded-xl border px-4 py-2 text-sm font-semibold transition",
                              watch("setupDifficulty") === d.value
                                ? "border-brand-primary bg-brand-primary text-white"
                                : "border-slate-200 bg-slate-50 text-slate-700 hover:border-brand-accent dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                            )}
                          >
                            {d.label}
                            <HelpCircle className="ml-1 inline h-3.5 w-3.5 opacity-60" />
                          </button>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content
                            side="top"
                            className="max-w-xs rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-lg"
                          >
                            {d.hint}
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    ))}
                  </div>
                  {errors.setupDifficulty ? (
                    <p className="mt-1 text-xs text-red-600">{errors.setupDifficulty.message}</p>
                  ) : null}
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase text-slate-500">Ecosystem compatibility</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {ecosystemUi.map((eco) => {
                      const checked = ecosystems.includes(eco.value);
                      return (
                        <Tooltip.Root key={eco.value}>
                          <Tooltip.Trigger asChild>
                            <label
                              className={cn(
                                "flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 text-sm font-medium transition",
                                checked
                                  ? "border-brand-accent bg-indigo-50 dark:bg-indigo-950/40"
                                  : "border-slate-200 hover:border-slate-300 dark:border-slate-700"
                              )}
                            >
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-slate-300"
                                checked={checked}
                                onChange={() => toggleEco(eco.value)}
                              />
                              <Sparkles className="h-4 w-4 text-brand-accent" />
                              {eco.label}
                            </label>
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                            <Tooltip.Content className="max-w-xs rounded-lg bg-slate-900 px-3 py-2 text-xs text-white">
                              {eco.hint}
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                      );
                    })}
                  </div>
                  {errors.ecosystems ? <p className="mt-1 text-xs text-red-600">{errors.ecosystems.message}</p> : null}
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-xs font-semibold uppercase text-slate-500">Status</span>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" value="draft" {...register("status")} />
                    Draft
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" value="active" {...register("status")} />
                    Active
                  </label>
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase text-slate-500">Tags</p>
                  <div className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800/60">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium shadow-sm dark:bg-slate-900"
                      >
                        {t}
                        <button
                          type="button"
                          className="text-slate-400 hover:text-red-500"
                          onClick={() => setValue(
                            "tags",
                            tags.filter((x) => x !== t),
                            { shouldValidate: true }
                          )}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      value={tagDraft}
                      onChange={(e) => setTagDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === ",") {
                          e.preventDefault();
                          addTag(tagDraft);
                        }
                      }}
                      placeholder="Type and press Enter"
                      className="min-w-[8rem] flex-1 text-sm outline-none"
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Comma-separated values become chips.</p>
                </div>
              </motion.div>
            ) : null}

            {step === 1 ? (
              <motion.div
                key="s1"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pricing & inventory</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold uppercase text-slate-500">Price ({currency})</label>
                    <input
                      type="number"
                      step="0.01"
                      {...register("price", { valueAsNumber: true })}
                      className={cn("mt-1", inputClass(!!errors.price))}
                    />
                    {errors.price ? <p className="mt-1 text-xs text-red-600">{errors.price.message}</p> : null}
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase text-slate-500">Sale price (optional)</label>
                    <input
                      type="number"
                      step="0.01"
                      {...register("salePrice", {
                        setValueAs: (v) => (v === "" || v == null || Number.isNaN(Number(v)) ? undefined : Number(v))
                      })}
                      className={cn("mt-1", inputClass(!!errors.salePrice))}
                    />
                    {salePct != null ? (
                      <p className="mt-1 inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                        You save {salePct}%
                      </p>
                    ) : null}
                    {errors.salePrice ? <p className="mt-1 text-xs text-red-600">{errors.salePrice.message}</p> : null}
                  </div>
                </div>
                <div className="flex flex-wrap items-end gap-3">
                  <div className="min-w-[200px] flex-1">
                    <label className="text-xs font-semibold uppercase text-slate-500">SKU</label>
                    <input {...register("sku")} className={cn("mt-1", inputClass(!!errors.sku))} />
                    {errors.sku ? <p className="mt-1 text-xs text-red-600">{errors.sku.message}</p> : null}
                  </div>
                  <Button type="button" variant="outline" size="sm" className="gap-1" onClick={suggestSku}>
                    <Plus className="h-4 w-4" />
                    Suggest SKU
                  </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold uppercase text-slate-500">Stock quantity</label>
                    <input
                      type="number"
                      {...register("stock", { valueAsNumber: true })}
                      className={cn("mt-1", inputClass(!!errors.stock))}
                    />
                    <span className={cn("mt-2 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold", stockBadge.className)}>
                      {stockBadge.label}
                    </span>
                    {errors.stock ? <p className="mt-1 text-xs text-red-600">{errors.stock.message}</p> : null}
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase text-slate-500">Low stock threshold</label>
                    <input
                      type="number"
                      {...register("lowStockThreshold", { valueAsNumber: true })}
                      className={cn("mt-1", inputClass(!!errors.lowStockThreshold))}
                    />
                    <p className="mt-1 text-xs text-slate-500">Alert when stock falls below this number.</p>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-slate-500">Weight (grams, optional)</label>
                  <input
                    type="number"
                    {...register("weightGrams", {
                      setValueAs: (v) => (v === "" || v == null || Number.isNaN(Number(v)) ? undefined : Number(v))
                    })}
                    className={cn("mt-1", inputClass(!!errors.weightGrams))}
                  />
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase text-slate-500">Dimensions (cm)</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="number"
                      placeholder="L"
                      {...register("dimensions.length", {
                        setValueAs: (v) => (v === "" || v == null || Number.isNaN(Number(v)) ? undefined : Number(v))
                      })}
                      className={cn("w-24", inputClass())}
                    />
                    <span className="text-slate-400">×</span>
                    <input
                      type="number"
                      placeholder="W"
                      {...register("dimensions.width", {
                        setValueAs: (v) => (v === "" || v == null || Number.isNaN(Number(v)) ? undefined : Number(v))
                      })}
                      className={cn("w-24", inputClass())}
                    />
                    <span className="text-slate-400">×</span>
                    <input
                      type="number"
                      placeholder="H"
                      {...register("dimensions.height", {
                        setValueAs: (v) => (v === "" || v == null || Number.isNaN(Number(v)) ? undefined : Number(v))
                      })}
                      className={cn("w-24", inputClass())}
                    />
                  </div>
                </div>
              </motion.div>
            ) : null}

            {step === 2 ? (
              <motion.div
                key="s2"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Images & media</p>
                <Controller
                  name="gallery"
                  control={control}
                  render={({ field }) => (
                    <ProductImageUploader
                      slug={slug || "draft"}
                      value={field.value}
                      onChange={field.onChange}
                      disabled={!slug || !/^[a-z0-9-]+$/.test(slug)}
                    />
                  )}
                />
                {errors.gallery?.root?.message ? (
                  <p className="text-sm text-red-600">{errors.gallery.root.message}</p>
                ) : errors.gallery && typeof errors.gallery === "object" && "message" in errors.gallery ? (
                  <p className="text-sm text-red-600">{(errors.gallery as { message: string }).message}</p>
                ) : null}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white/95 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 md:static md:mt-8 md:flex md:justify-end md:border-0 md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-none">
          <div className="mx-auto flex max-w-3xl justify-end gap-3 md:mx-0 md:max-w-none">
            {step > 0 ? (
              <Button type="button" variant="outline" onClick={prevStep} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            ) : (
              <span className="hidden md:block" />
            )}
            {step < 2 ? (
              <Button type="button" onClick={() => void nextStep()} disabled={!!nextDisabled} className="gap-2">
                Next step
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={submitting || !!nextDisabled} className="gap-2">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {mode === "edit" ? "Save changes" : "Publish product"}
              </Button>
            )}
          </div>
        </div>

        {mode === "edit" ? (
          <div className="mt-10 border-t pt-6 dark:border-slate-800">
            <Dialog.Root open={deleteOpen} onOpenChange={setDeleteOpen}>
              <Dialog.Trigger asChild>
                <Button type="button" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                  Delete product
                </Button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
                <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(90vw,400px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                  <Dialog.Title className="text-lg font-bold">Delete this product?</Dialog.Title>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    This will mark the product as deleted, deactivate it, and remove all images from storage. This cannot be undone from the storefront.
                  </p>
                  <div className="mt-6 flex justify-end gap-2">
                    <Dialog.Close asChild>
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </Dialog.Close>
                    <Button type="button" className="bg-red-600 hover:bg-red-700" onClick={() => void handleDeleteProduct()} disabled={deleting}>
                      {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm delete"}
                    </Button>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        ) : null}
      </form>
    </Tooltip.Provider>
  );
}
