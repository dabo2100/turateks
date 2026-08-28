"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { deleteProduct, saveProduct } from "@/app/admin/(panel)/urunler/actions";
import { Button } from "@/components/ui/button";
import { fieldClass } from "@/lib/admin-ui";
import { slugify } from "@/lib/slug";

type CategoryOption = { id: string; name: string; slug: string };

export type ProductFormValue = {
  id?: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  wholesale: boolean;
  isNew: boolean;
  categoryId: string;
  tags: string;
  images: { label: string; url: string }[];
  colors: { slug: string; label: string; hex: string }[];
  sizes: { label: string }[];
  tiers: { minQty: number; maxQty: number | null; unitPriceTry: number }[];
  specs: { label: string; value: string }[];
};

const EMPTY: ProductFormValue = {
  name: "",
  slug: "",
  sku: "",
  description: "",
  wholesale: false,
  isNew: false,
  categoryId: "",
  tags: "",
  images: [{ label: "Ön", url: "" }],
  colors: [{ slug: "", label: "", hex: "#333333" }],
  sizes: [{ label: "M" }],
  tiers: [{ minQty: 1, maxQty: null, unitPriceTry: 0 }],
  specs: [{ label: "", value: "" }],
};

export function ProductForm({
  categories,
  initial,
}: {
  categories: CategoryOption[];
  initial?: ProductFormValue;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState<ProductFormValue>(initial ?? EMPTY);
  const [newCategoryName, setNewCategoryName] = useState("");

  function patch<K extends keyof ProductFormValue>(key: K, value: ProductFormValue[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onSave() {
    startTransition(async () => {
      const result = await saveProduct({
        ...form,
        slug: form.slug || slugify(form.name),
        newCategoryName: newCategoryName || undefined,
        categoryId: form.categoryId || undefined,
        images: form.images.filter((i) => i.url.trim()),
        colors: form.colors.filter((c) => c.label.trim()),
        sizes: form.sizes.filter((s) => s.label.trim()),
        specs: form.specs.filter((s) => s.label.trim()),
      });
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Ürün kaydedildi");
    });
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-4 rounded-xl border border-border bg-background p-4 sm:grid-cols-2">
        <label className="text-sm sm:col-span-2">
          Ad
          <input
            className={fieldClass}
            value={form.name}
            onChange={(e) => {
              const name = e.target.value;
              setForm((prev) => ({
                ...prev,
                name,
                slug: initial?.id ? prev.slug : slugify(name),
              }));
            }}
          />
        </label>
        <label className="text-sm">
          Slug
          <input className={fieldClass} value={form.slug} onChange={(e) => patch("slug", slugify(e.target.value))} />
        </label>
        <label className="text-sm">
          SKU
          <input className={fieldClass} value={form.sku} onChange={(e) => patch("sku", e.target.value)} />
        </label>
        <label className="text-sm">
          Kategori
          <select className={fieldClass} value={form.categoryId} onChange={(e) => patch("categoryId", e.target.value)}>
            <option value="">Seçin</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          Yeni kategori
          <input className={fieldClass} value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.wholesale} onChange={(e) => patch("wholesale", e.target.checked)} />
          Toptan
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isNew} onChange={(e) => patch("isNew", e.target.checked)} />
          Yeni ürün
        </label>
        <label className="text-sm sm:col-span-2">
          Açıklama
          <textarea className={`${fieldClass} min-h-28`} value={form.description} onChange={(e) => patch("description", e.target.value)} />
        </label>
        <label className="text-sm sm:col-span-2">
          Etiketler (virgülle)
          <input className={fieldClass} value={form.tags} onChange={(e) => patch("tags", e.target.value)} />
        </label>
      </section>

      <ListBlock
        title="Görseller"
        onAdd={() => patch("images", [...form.images, { label: "", url: "" }])}
      >
        {form.images.map((row, index) => (
          <div key={index} className="grid gap-2 sm:grid-cols-[1fr_2fr_auto]">
            <input className={fieldClass} placeholder="Etiket" value={row.label} onChange={(e) => patch("images", form.images.map((r, i) => (i === index ? { ...r, label: e.target.value } : r)))} />
            <input className={fieldClass} placeholder="/uploads/..." value={row.url} onChange={(e) => patch("images", form.images.map((r, i) => (i === index ? { ...r, url: e.target.value } : r)))} />
            <Button type="button" variant="ghost" onClick={() => patch("images", form.images.filter((_, i) => i !== index))}>
              Sil
            </Button>
          </div>
        ))}
      </ListBlock>

      <ListBlock title="Renkler" onAdd={() => patch("colors", [...form.colors, { slug: "", label: "", hex: "#888888" }])}>
        {form.colors.map((row, index) => (
          <div key={index} className="grid gap-2 sm:grid-cols-[1fr_1fr_80px_auto]">
            <input
              className={fieldClass}
              placeholder="Ad"
              value={row.label}
              onChange={(e) =>
                patch(
                  "colors",
                  form.colors.map((r, i) => (i === index ? { ...r, label: e.target.value, slug: slugify(e.target.value) } : r)),
                )
              }
            />
            <input className={fieldClass} placeholder="slug" value={row.slug} onChange={(e) => patch("colors", form.colors.map((r, i) => (i === index ? { ...r, slug: slugify(e.target.value) } : r)))} />
            <input className={fieldClass} type="color" value={row.hex} onChange={(e) => patch("colors", form.colors.map((r, i) => (i === index ? { ...r, hex: e.target.value } : r)))} />
            <Button type="button" variant="ghost" onClick={() => patch("colors", form.colors.filter((_, i) => i !== index))}>
              Sil
            </Button>
          </div>
        ))}
      </ListBlock>

      <ListBlock title="Bedenler" onAdd={() => patch("sizes", [...form.sizes, { label: "" }])}>
        {form.sizes.map((row, index) => (
          <div key={index} className="flex gap-2">
            <input className={fieldClass} value={row.label} onChange={(e) => patch("sizes", form.sizes.map((r, i) => (i === index ? { ...r, label: e.target.value } : r)))} />
            <Button type="button" variant="ghost" onClick={() => patch("sizes", form.sizes.filter((_, i) => i !== index))}>
              Sil
            </Button>
          </div>
        ))}
      </ListBlock>

      <ListBlock
        title="Fiyat kademeleri (₺ / adet)"
        onAdd={() => patch("tiers", [...form.tiers, { minQty: 1, maxQty: null, unitPriceTry: 0 }])}
      >
        {form.tiers.map((row, index) => (
          <div key={index} className="grid gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
            <input className={fieldClass} type="number" min={1} value={row.minQty} onChange={(e) => patch("tiers", form.tiers.map((r, i) => (i === index ? { ...r, minQty: Number(e.target.value) } : r)))} />
            <input
              className={fieldClass}
              type="number"
              placeholder="max"
              value={row.maxQty ?? ""}
              onChange={(e) => patch("tiers", form.tiers.map((r, i) => (i === index ? { ...r, maxQty: e.target.value === "" ? null : Number(e.target.value) } : r)))}
            />
            <input className={fieldClass} type="number" min={0} step="0.01" value={row.unitPriceTry} onChange={(e) => patch("tiers", form.tiers.map((r, i) => (i === index ? { ...r, unitPriceTry: Number(e.target.value) } : r)))} />
            <Button type="button" variant="ghost" onClick={() => patch("tiers", form.tiers.filter((_, i) => i !== index))}>
              Sil
            </Button>
          </div>
        ))}
      </ListBlock>

      <ListBlock title="Teknik özellikler" onAdd={() => patch("specs", [...form.specs, { label: "", value: "" }])}>
        {form.specs.map((row, index) => (
          <div key={index} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
            <input className={fieldClass} placeholder="Kumaş" value={row.label} onChange={(e) => patch("specs", form.specs.map((r, i) => (i === index ? { ...r, label: e.target.value } : r)))} />
            <input className={fieldClass} placeholder="PVC" value={row.value} onChange={(e) => patch("specs", form.specs.map((r, i) => (i === index ? { ...r, value: e.target.value } : r)))} />
            <Button type="button" variant="ghost" onClick={() => patch("specs", form.specs.filter((_, i) => i !== index))}>
              Sil
            </Button>
          </div>
        ))}
      </ListBlock>

      <div className="flex flex-wrap gap-3">
        <Button type="button" className="h-10 px-4" disabled={pending || form.name.trim().length < 2} onClick={onSave}>
          {pending ? "Kaydediliyor…" : "Kaydet"}
        </Button>
        {form.id ? (
          <Button
            type="button"
            variant="outline"
            className="h-10 px-4"
            disabled={pending}
            onClick={() => {
              if (!confirm("Ürün silinsin mi?")) return;
              startTransition(async () => {
                await deleteProduct(form.id!);
              });
            }}
          >
            Sil
          </Button>
        ) : null}
        <Button type="button" variant="ghost" className="h-10 px-4" onClick={() => router.push("/admin/urunler")}>
          Listeye dön
        </Button>
      </div>
    </div>
  );
}

function ListBlock({
  title,
  onAdd,
  children,
}: {
  title: string;
  onAdd: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3 rounded-xl border border-border bg-background p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">{title}</h2>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          Ekle
        </Button>
      </div>
      {children}
    </section>
  );
}
