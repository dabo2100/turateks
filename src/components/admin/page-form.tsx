"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { savePage } from "@/app/admin/(panel)/cms-actions";
import { Button } from "@/components/ui/button";
import { fieldClass } from "@/lib/admin-ui";

export function PageForm({
  id,
  title,
  body,
  seoTitle,
  seoDesc,
}: {
  id: string;
  title: string;
  body: string;
  seoTitle?: string | null;
  seoDesc?: string | null;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(async () => {
          await savePage({
            id,
            title: String(data.get("title") ?? ""),
            body: String(data.get("body") ?? ""),
            seoTitle: String(data.get("seoTitle") ?? ""),
            seoDesc: String(data.get("seoDesc") ?? ""),
          });
          toast.success("Sayfa kaydedildi");
        });
      }}
    >
      <label className="block text-sm">
        Başlık
        <input name="title" defaultValue={title} className={fieldClass} />
      </label>
      <label className="block text-sm">
        SEO başlığı
        <input name="seoTitle" defaultValue={seoTitle ?? ""} className={fieldClass} />
      </label>
      <label className="block text-sm">
        SEO açıklaması
        <textarea name="seoDesc" defaultValue={seoDesc ?? ""} className={`${fieldClass} min-h-24`} />
      </label>
      <label className="block text-sm">
        Metin
        <textarea name="body" defaultValue={body} className={`${fieldClass} min-h-80 font-mono`} />
      </label>
      <Button type="submit" className="h-10 px-4" disabled={pending}>
        Kaydet
      </Button>
    </form>
  );
}
