"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { deleteCategory, saveCategory } from "@/app/admin/(panel)/kategoriler/actions";
import { Button } from "@/components/ui/button";
import { fieldClass, labelClass } from "@/lib/admin-ui";
import { slugify } from "@/lib/slug";

export function CategoryCreateForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  return (
    <form
      className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          const result = await saveCategory({ name, slug: slug || slugify(name) });
          if (result.error) {
            toast.error(result.error);
            return;
          }
          toast.success("Kategori eklendi");
          setName("");
          setSlug("");
          router.refresh();
        });
      }}
    >
      <label className={labelClass}>
        Kategori adı
        <input
          className={fieldClass}
          value={name}
          required
          minLength={2}
          disabled={pending}
          onChange={(e) => {
            const next = e.target.value;
            setName(next);
            setSlug(slugify(next));
          }}
        />
      </label>
      <label className={labelClass}>
        Slug
        <input className={fieldClass} value={slug} disabled={pending} onChange={(e) => setSlug(slugify(e.target.value))} />
      </label>
      <Button type="submit" className="h-12 rounded-2xl px-5" disabled={pending || name.trim().length < 2}>
        {pending ? "Kaydediliyor…" : "Ekle"}
      </Button>
    </form>
  );
}

export function CategoryRowActions({
  id,
  name,
  slug,
  productCount,
}: {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const [nextName, setNextName] = useState(name);
  const [nextSlug, setNextSlug] = useState(slug);

  if (editing) {
    return (
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input className={fieldClass} value={nextName} onChange={(e) => setNextName(e.target.value)} disabled={pending} />
        <input
          className={fieldClass}
          value={nextSlug}
          onChange={(e) => setNextSlug(slugify(e.target.value))}
          disabled={pending}
        />
        <div className="flex gap-2">
          <Button
            type="button"
            className="h-10 rounded-xl px-3"
            disabled={pending}
            onClick={() => {
              startTransition(async () => {
                const result = await saveCategory({ id, name: nextName, slug: nextSlug });
                if (result.error) {
                  toast.error(result.error);
                  return;
                }
                toast.success("Kategori güncellendi");
                setEditing(false);
                router.refresh();
              });
            }}
          >
            Kaydet
          </Button>
          <Button type="button" variant="ghost" className="h-10 rounded-xl px-3" disabled={pending} onClick={() => setEditing(false)}>
            İptal
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end gap-2">
      <Button type="button" variant="outline" className="h-9 rounded-xl px-3" onClick={() => setEditing(true)}>
        Düzenle
      </Button>
      <Button
        type="button"
        variant="ghost"
        className="h-9 rounded-xl px-3 text-destructive"
        disabled={pending}
        onClick={() => {
          if (productCount > 0) {
            toast.error(`Bu kategoride ${productCount} ürün var.`);
            return;
          }
          if (!confirm("Kategori silinsin mi?")) return;
          startTransition(async () => {
            const result = await deleteCategory(id);
            if (result.error) {
              toast.error(result.error);
              return;
            }
            toast.success("Kategori silindi");
            router.refresh();
          });
        }}
      >
        Sil
      </Button>
    </div>
  );
}
