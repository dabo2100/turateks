"use client";

import Image from "next/image";
import { ImagePlus, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { fieldClass, labelClass } from "@/lib/admin-ui";
import { cn } from "@/lib/utils";

export type ProductImageRow = { label: string; url: string };

export function ProductImageUploader({
  images,
  onChange,
}: {
  images: ProductImageRow[];
  onChange: (next: ProductImageRow[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const preview = images[activeIndex] ?? images[0];

  async function uploadFiles(files: FileList | File[]) {
    const list = Array.from(files);
    if (list.length === 0) return;
    setUploading(true);
    try {
      const uploaded: ProductImageRow[] = [];
      for (const file of list) {
        const body = new FormData();
        body.set("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body });
        const data = (await res.json()) as { url?: string; error?: string };
        if (!res.ok || !data.url) {
          toast.error(data.error ?? "Yükleme başarısız");
          continue;
        }
        uploaded.push({ label: file.name.replace(/\.[^.]+$/, "") || "Görsel", url: data.url });
      }
      if (uploaded.length) {
        const next = [...images.filter((i) => i.url.trim()), ...uploaded];
        onChange(next);
        setActiveIndex(Math.max(0, next.length - uploaded.length));
        toast.success(`${uploaded.length} görsel yüklendi`);
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl bg-muted",
          dragging ? "ring-2 ring-primary ring-offset-2" : "",
        )}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void uploadFiles(e.dataTransfer.files);
        }}
      >
        {preview?.url ? (
          <Image src={preview.url} alt={preview.label || "Ürün görseli"} fill className="object-cover" unoptimized />
        ) : (
          <div className="flex flex-col items-center gap-2 px-6 text-center text-muted-foreground">
            <Upload className="size-8 opacity-60" />
            <p className="text-sm font-medium">Görselleri sürükleyip bırakın</p>
            <p className="text-xs">veya aşağıdaki + ile seçin</p>
          </div>
        )}
        {uploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/35 text-sm font-medium text-white">
            Yükleniyor…
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        {images.map((image, index) => (
          <button
            key={`${image.url}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={cn(
              "relative size-16 overflow-hidden rounded-2xl bg-muted",
              activeIndex === index ? "ring-2 ring-primary" : "",
            )}
          >
            {image.url ? (
              <Image src={image.url} alt={image.label || "Küçük görsel"} fill className="object-cover" unoptimized />
            ) : (
              <span className="flex size-full items-center justify-center text-[10px] text-muted-foreground">URL</span>
            )}
          </button>
        ))}
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="inline-flex size-16 items-center justify-center rounded-2xl border border-dashed border-primary/50 bg-[var(--admin-mint-soft,#e6f7ef)] text-primary-foreground transition hover:bg-primary/40"
          aria-label="Görsel ekle"
        >
          <ImagePlus className="size-5 text-foreground" />
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) void uploadFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {preview ? (
        <div className="grid gap-3">
          <label className={labelClass}>
            Görsel etiketi
            <input
              className={fieldClass}
              value={preview.label}
              onChange={(e) => {
                const label = e.target.value;
                onChange(images.map((row, i) => (i === activeIndex ? { ...row, label } : row)));
              }}
            />
          </label>
          <label className={labelClass}>
            Görsel URL
            <input
              className={fieldClass}
              value={preview.url}
              placeholder="/uploads/..."
              onChange={(e) => {
                const url = e.target.value;
                onChange(images.map((row, i) => (i === activeIndex ? { ...row, url } : row)));
              }}
            />
          </label>
          <Button
            type="button"
            variant="ghost"
            className="h-10 w-fit rounded-xl px-3 text-destructive"
            onClick={() => {
              const next = images.filter((_, i) => i !== activeIndex);
              onChange(next.length ? next : [{ label: "", url: "" }]);
              setActiveIndex(0);
            }}
          >
            <Trash2 className="size-4" />
            Görseli kaldır
          </Button>
        </div>
      ) : null}
    </div>
  );
}
