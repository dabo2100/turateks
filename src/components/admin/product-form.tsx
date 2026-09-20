"use client";

import Link from "next/link";
import { Check, FileText, Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { deleteProduct, saveProduct } from "@/app/admin/(panel)/urunler/actions";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ProductImageUploader } from "@/components/admin/product-image-uploader";
import { Button } from "@/components/ui/button";
import { adminOutlineBtnClass, adminPrimaryBtnClass, fieldClass, labelClass } from "@/lib/admin-ui";
import { slugify } from "@/lib/slug";
import { cn } from "@/lib/utils";

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
  sizes: [{ label: "S" }, { label: "M" }, { label: "L" }, { label: "XL" }],
  tiers: [{ minQty: 1, maxQty: null, unitPriceTry: 0 }],
  specs: [{ label: "", value: "" }],
};

const SIZE_PRESETS = ["XS", "S", "M", "L", "XL", "XXL"];

export function ProductForm({
  categories,
  initial,
}: {
  categories: CategoryOption[];
  initial?: ProductFormValue;
}) {
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState<ProductFormValue>(initial ?? EMPTY);

  function patch<K extends keyof ProductFormValue>(key: K, value: ProductFormValue[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleSize(label: string) {
    const exists = form.sizes.some((s) => s.label === label);
    if (exists) {
      patch(
        "sizes",
        form.sizes.filter((s) => s.label !== label),
      );
      return;
    }
    patch("sizes", [...form.sizes, { label }]);
  }

  function onSave() {
    startTransition(async () => {
      const result = await saveProduct({
        ...form,
        slug: form.slug || slugify(form.name),
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
    <div className="space-y-6">
      <AdminPageHeader
        title={form.id ? form.name || "Ürünü düzenle" : "Yeni ürün ekle"}
        description="Kategori ve satış tipi (toptan/perakende) ürünün mağazada nasıl listeleneceğini belirler."
        actions={
          <>
            <Link href="/admin/urunler" className={adminOutlineBtnClass}>
              <FileText className="size-4" />
              Listeye dön
            </Link>
            <button type="button" className={adminPrimaryBtnClass} disabled={pending || form.name.trim().length < 2} onClick={onSave}>
              <Check className="size-4" />
              {pending ? "Kaydediliyor…" : form.id ? "Ürünü güncelle" : "Ürün ekle"}
            </button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
        <div className="space-y-6">
          <AdminCard title="Genel bilgiler">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={`${labelClass} sm:col-span-2`}>
                Ürün adı
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
              <label className={labelClass}>
                Slug
                <input className={fieldClass} value={form.slug} onChange={(e) => patch("slug", slugify(e.target.value))} />
              </label>
              <label className={labelClass}>
                SKU
                <input className={fieldClass} value={form.sku} onChange={(e) => patch("sku", e.target.value)} />
              </label>
              <label className={`${labelClass} sm:col-span-2`}>
                Açıklama
                <textarea
                  className={`${fieldClass} min-h-32`}
                  value={form.description}
                  onChange={(e) => patch("description", e.target.value)}
                />
              </label>
              <div className="sm:col-span-2">
                <p className={labelClass}>Bedenler</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {SIZE_PRESETS.map((size) => {
                    const active = form.sizes.some((s) => s.label === size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={cn(
                          "inline-flex size-11 items-center justify-center rounded-2xl text-sm font-semibold transition",
                          active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80",
                        )}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {form.sizes
                    .filter((s) => !SIZE_PRESETS.includes(s.label))
                    .map((row) => (
                      <span key={row.label} className="inline-flex items-center gap-1 rounded-2xl bg-muted px-3 py-1.5 text-sm">
                        {row.label}
                        <button type="button" className="text-muted-foreground hover:text-foreground" onClick={() => toggleSize(row.label)}>
                          ×
                        </button>
                      </span>
                    ))}
                  <button
                    type="button"
                    className="inline-flex h-9 items-center gap-1 rounded-2xl bg-muted px-3 text-xs font-semibold text-muted-foreground"
                    onClick={() => {
                      const label = prompt("Özel beden");
                      if (!label?.trim()) return;
                      if (!form.sizes.some((s) => s.label === label.trim())) {
                        patch("sizes", [...form.sizes, { label: label.trim() }]);
                      }
                    }}
                  >
                    <Plus className="size-3.5" />
                    Özel beden
                  </button>
                </div>
              </div>
              <div className="sm:col-span-2">
                <p className={labelClass}>Satış tipi</p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {[
                    { value: false, label: "Perakende", hint: "Normal ürün listesinde" },
                    { value: true, label: "Toptan", hint: "/toptan sayfasında + Toptan etiketi" },
                  ].map((option) => {
                    const active = form.wholesale === option.value;
                    return (
                      <button
                        key={String(option.value)}
                        type="button"
                        onClick={() => patch("wholesale", option.value)}
                        className={cn(
                          "rounded-2xl px-4 py-3 text-left transition",
                          active ? "bg-[var(--admin-mint-soft,#e6f7ef)] ring-2 ring-primary/50" : "bg-muted",
                        )}
                      >
                        <span className="block text-sm font-semibold">{option.label}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">{option.hint}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <label className="flex items-center gap-3 rounded-2xl bg-muted px-4 py-3 text-sm font-medium sm:col-span-2">
                <input
                  type="checkbox"
                  className="size-4 accent-[var(--admin-mint-strong,#6bcf9b)]"
                  checked={form.isNew}
                  onChange={(e) => patch("isNew", e.target.checked)}
                />
                Yeni ürün rozeti
              </label>
            </div>
          </AdminCard>

          <AdminCard title="Fiyat kademeleri" description="Adet aralığına göre birim fiyat (₺).">
            <div className="space-y-3">
              {form.tiers.map((row, index) => (
                <div key={index} className="grid gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
                  <label className={labelClass}>
                    Min adet
                    <input
                      className={fieldClass}
                      type="number"
                      min={1}
                      value={row.minQty}
                      onChange={(e) =>
                        patch(
                          "tiers",
                          form.tiers.map((r, i) => (i === index ? { ...r, minQty: Number(e.target.value) } : r)),
                        )
                      }
                    />
                  </label>
                  <label className={labelClass}>
                    Max adet
                    <input
                      className={fieldClass}
                      type="number"
                      placeholder="∞"
                      value={row.maxQty ?? ""}
                      onChange={(e) =>
                        patch(
                          "tiers",
                          form.tiers.map((r, i) =>
                            i === index ? { ...r, maxQty: e.target.value === "" ? null : Number(e.target.value) } : r,
                          ),
                        )
                      }
                    />
                  </label>
                  <label className={labelClass}>
                    Birim fiyat
                    <input
                      className={fieldClass}
                      type="number"
                      min={0}
                      step="0.01"
                      value={row.unitPriceTry}
                      onChange={(e) =>
                        patch(
                          "tiers",
                          form.tiers.map((r, i) => (i === index ? { ...r, unitPriceTry: Number(e.target.value) } : r)),
                        )
                      }
                    />
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    className="mt-7 h-11 rounded-xl"
                    onClick={() => patch("tiers", form.tiers.filter((_, i) => i !== index))}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-xl"
                onClick={() => patch("tiers", [...form.tiers, { minQty: 1, maxQty: null, unitPriceTry: 0 }])}
              >
                <Plus className="size-4" />
                Kademe ekle
              </Button>
            </div>
          </AdminCard>

          <AdminCard title="Renkler">
            <div className="space-y-3">
              {form.colors.map((row, index) => (
                <div key={index} className="grid gap-2 sm:grid-cols-[1fr_1fr_80px_auto]">
                  <input
                    className={fieldClass}
                    placeholder="Renk adı"
                    value={row.label}
                    onChange={(e) =>
                      patch(
                        "colors",
                        form.colors.map((r, i) =>
                          i === index ? { ...r, label: e.target.value, slug: slugify(e.target.value) } : r,
                        ),
                      )
                    }
                  />
                  <input
                    className={fieldClass}
                    placeholder="slug"
                    value={row.slug}
                    onChange={(e) =>
                      patch(
                        "colors",
                        form.colors.map((r, i) => (i === index ? { ...r, slug: slugify(e.target.value) } : r)),
                      )
                    }
                  />
                  <input
                    className={`${fieldClass} h-12 p-1`}
                    type="color"
                    value={row.hex}
                    onChange={(e) =>
                      patch(
                        "colors",
                        form.colors.map((r, i) => (i === index ? { ...r, hex: e.target.value } : r)),
                      )
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-12 rounded-xl"
                    onClick={() => patch("colors", form.colors.filter((_, i) => i !== index))}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-xl"
                onClick={() => patch("colors", [...form.colors, { slug: "", label: "", hex: "#888888" }])}
              >
                <Plus className="size-4" />
                Renk ekle
              </Button>
            </div>
          </AdminCard>

          <AdminCard title="Teknik özellikler">
            <div className="space-y-3">
              {form.specs.map((row, index) => (
                <div key={index} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                  <input
                    className={fieldClass}
                    placeholder="Özellik"
                    value={row.label}
                    onChange={(e) =>
                      patch(
                        "specs",
                        form.specs.map((r, i) => (i === index ? { ...r, label: e.target.value } : r)),
                      )
                    }
                  />
                  <input
                    className={fieldClass}
                    placeholder="Değer"
                    value={row.value}
                    onChange={(e) =>
                      patch(
                        "specs",
                        form.specs.map((r, i) => (i === index ? { ...r, value: e.target.value } : r)),
                      )
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-12 rounded-xl"
                    onClick={() => patch("specs", form.specs.filter((_, i) => i !== index))}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-xl"
                onClick={() => patch("specs", [...form.specs, { label: "", value: "" }])}
              >
                <Plus className="size-4" />
                Özellik ekle
              </Button>
            </div>
          </AdminCard>
        </div>

        <div className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          <AdminCard title="Ürün görselleri" description="Sürükle-bırak veya + ile yükleyin.">
            <ProductImageUploader images={form.images} onChange={(images) => patch("images", images)} />
          </AdminCard>

          <AdminCard title="Kategori">
            <label className={labelClass}>
              Ürün kategorisi
              <select className={fieldClass} value={form.categoryId} onChange={(e) => patch("categoryId", e.target.value)}>
                <option value="">Seçin</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <Link href="/admin/kategoriler" className={`${adminOutlineBtnClass} mt-4 w-full`}>
              <Plus className="size-4" />
              Kategori yönet
            </Link>
            <label className={`${labelClass} mt-4`}>
              Etiketler (virgülle)
              <input className={fieldClass} value={form.tags} onChange={(e) => patch("tags", e.target.value)} />
            </label>
            {form.wholesale ? (
              <p className="mt-2 text-xs text-muted-foreground">Toptan seçiliyken kayıtta otomatik “Toptan” etiketi eklenir.</p>
            ) : null}
          </AdminCard>

          {form.id ? (
            <AdminCard title="Tehlikeli alan">
              <Button
                type="button"
                variant="destructive"
                className="h-11 rounded-2xl px-4"
                disabled={pending}
                onClick={() => {
                  if (!confirm("Ürün silinsin mi?")) return;
                  startTransition(async () => {
                    await deleteProduct(form.id!);
                  });
                }}
              >
                Ürünü sil
              </Button>
            </AdminCard>
          ) : null}
        </div>
      </div>
    </div>
  );
}
