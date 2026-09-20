"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { deletePost, savePost } from "@/app/admin/(panel)/cms-actions";
import { AdminCard } from "@/components/admin/admin-card";
import { Button } from "@/components/ui/button";
import { fieldClass, labelClass } from "@/lib/admin-ui";
import { slugify } from "@/lib/slug";

export function PostForm({
  initial,
}: {
  initial?: { id: string; title: string; slug: string; excerpt: string; body: string; published: boolean };
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <AdminCard>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          startTransition(async () => {
            await savePost({
              id: initial?.id,
              title: String(data.get("title") ?? ""),
              slug: slugify(String(data.get("slug") || data.get("title") || "")),
              excerpt: String(data.get("excerpt") ?? ""),
              body: String(data.get("body") ?? ""),
              published: data.get("published") === "on",
            });
            toast.success("Yazı kaydedildi");
          });
        }}
      >
        <label className={labelClass}>
          Başlık
          <input name="title" defaultValue={initial?.title} required className={fieldClass} />
        </label>
        <label className={labelClass}>
          Slug
          <input name="slug" defaultValue={initial?.slug} className={fieldClass} />
        </label>
        <label className={labelClass}>
          Özet
          <textarea name="excerpt" defaultValue={initial?.excerpt} className={`${fieldClass} min-h-24`} />
        </label>
        <label className={labelClass}>
          Metin
          <textarea name="body" defaultValue={initial?.body} required className={`${fieldClass} min-h-80 font-mono`} />
        </label>
        <label className="flex items-center gap-3 rounded-2xl bg-muted px-4 py-3 text-sm font-medium">
          <input
            type="checkbox"
            name="published"
            defaultChecked={initial?.published}
            className="size-4 accent-[var(--admin-mint-strong,#6bcf9b)]"
          />
          Yayında
        </label>
        <div className="flex flex-wrap gap-3">
          <Button type="submit" className="h-11 rounded-2xl px-5" disabled={pending}>
            Kaydet
          </Button>
          {initial?.id ? (
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-2xl px-5"
              disabled={pending}
              onClick={() => {
                if (!confirm("Yazı silinsin mi?")) return;
                startTransition(async () => {
                  await deletePost(initial.id);
                });
              }}
            >
              Sil
            </Button>
          ) : (
            <Button type="button" variant="ghost" className="h-11 rounded-2xl px-5" onClick={() => router.push("/admin/blog")}>
              İptal
            </Button>
          )}
        </div>
      </form>
    </AdminCard>
  );
}
