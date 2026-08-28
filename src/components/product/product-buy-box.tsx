"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { useCartStore } from "@/lib/cart-store";

import { Button } from "@/components/ui/button";
import type { MockProduct } from "@/lib/mock-catalog";
import { formatTry } from "@/lib/mock-catalog";
import { formatQtyRange, isTierActive, resolveUnitPrice } from "@/lib/pricing";
import { whatsappHref } from "@/lib/site";
import { cn } from "@/lib/utils";

export function ProductBuyBox({ product }: { product: MockProduct }) {
  const [colorId, setColorId] = useState(product.colors[0]?.id ?? "");
  const [size, setSize] = useState<string>("");
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();

  const color = product.colors.find((c) => c.id === colorId);
  const unit = useMemo(() => resolveUnitPrice(product.tiers, qty), [product.tiers, qty]);
  const line = unit * qty;
  const canAdd =
    (product.sizes.length === 0 || Boolean(size)) &&
    (product.colors.length === 0 || Boolean(colorId));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-wide text-copper uppercase">Toptan fiyat tablosu</p>
        <div className="mt-2 overflow-hidden rounded-lg border border-border">
          {product.tiers.map((tier) => {
            const active = isTierActive(tier, qty);
            return (
              <div
                key={tier.minQty}
                className={cn(
                  "flex items-center justify-between px-3 py-2 text-sm",
                  active ? "bg-primary/10" : "bg-background",
                )}
              >
                <span>{formatQtyRange(tier)}</span>
                <span className={cn("font-semibold", active && "text-primary")}>
                  {formatTry(tier.unitPrice)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {product.colors.length > 0 ? (
      <div>
        <p className="text-sm font-medium">Renk — {color?.label ?? "Seçin"}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {product.colors.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setColorId(c.id)}
              className={cn(
                "size-8 rounded-full border-2",
                colorId === c.id ? "border-primary" : "border-transparent",
              )}
              style={{ backgroundColor: c.hex }}
              aria-label={c.label}
            />
          ))}
        </div>
      </div>
      ) : null}

      {product.sizes.length > 0 ? (
      <div>
        <p className="text-sm font-medium">Beden</p>
        {!size ? <p className="mt-1 text-xs text-muted-foreground">Lütfen beden seçin</p> : null}
        <div className="mt-2 flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              className={cn(
                "min-w-10 rounded-md border px-3 py-2 text-sm",
                size === s ? "border-primary bg-primary text-primary-foreground" : "border-border",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      ) : null}

      <div>
        <p className="text-sm font-medium">Adet</p>
        <div className="mt-2 flex w-fit items-center rounded-md border border-border">
          <button
            type="button"
            className="size-10"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Azalt"
          >
            −
          </button>
          <span className="min-w-10 text-center text-sm">{qty}</span>
          <button
            type="button"
            className="size-10"
            onClick={() => setQty((q) => q + 1)}
            aria-label="Artır"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Birim fiyat</p>
          <p className="text-2xl font-semibold text-primary">{formatTry(unit)}</p>
        </div>
        <p className="text-sm text-muted-foreground">Toplam {formatTry(line)}</p>
      </div>

      <div className="flex flex-col gap-2">
        <Button
          type="button"
          size="lg"
          className="h-11"
          disabled={!canAdd}
          onClick={() => {
            addItem({
              slug: product.slug,
              name: product.name,
              sku: product.sku,
              qty,
              color: color?.label,
              size: size || undefined,
              imageUrl: product.imageUrls?.[0],
              tiers: product.tiers,
            });
            toast.success("Sepete eklendi");
            router.push("/sepet");
          }}
        >
          Sepete ekle
        </Button>
        <a
          href={whatsappHref(`${product.name} (${product.sku}) için toptan fiyat almak istiyorum.`)}
          className="inline-flex h-11 items-center justify-center rounded-lg border border-border text-sm font-medium hover:bg-muted"
        >
          WhatsApp&apos;tan teklif al
        </a>
      </div>
    </div>
  );
}
