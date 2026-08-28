"use client";

import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { formatTry } from "@/lib/mock-catalog";
import { resolveUnitPrice } from "@/lib/pricing";
import { cn } from "@/lib/utils";

export function CartView({
  taxMode = "included",
  taxPercent = 20,
}: {
  taxMode?: "included" | "extra";
  taxPercent?: number;
}) {
  const items = useCartStore((s) => s.items);
  const setQty = useCartStore((s) => s.setQty);
  const removeItem = useCartStore((s) => s.removeItem);

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-10 text-center">
        <p className="font-medium">Sepetiniz boş</p>
        <Link href="/urunler" className="mt-4 inline-block text-sm text-primary">
          Ürünlere git
        </Link>
      </div>
    );
  }

  const total = items.reduce((sum, line) => {
    const unit = resolveUnitPrice(line.tiers, line.qty);
    return sum + unit * line.qty;
  }, 0);

  return (
    <div className="space-y-6">
      <ul className="divide-y rounded-xl border border-border">
        {items.map((line, index) => {
          const unit = resolveUnitPrice(line.tiers, line.qty);
          return (
            <li key={`${line.slug}-${index}`} className="flex gap-4 p-4">
              {line.imageUrl ? (
                <img src={line.imageUrl} alt="" className="size-20 rounded-md object-cover" />
              ) : (
                <div className="size-20 rounded-md bg-surface" />
              )}
              <div className="min-w-0 flex-1">
                <p className="font-medium">{line.name}</p>
                <p className="text-xs text-muted-foreground">
                  {line.sku}
                  {line.color ? ` · ${line.color}` : ""}
                  {line.size ? ` · ${line.size}` : ""}
                </p>
                <p className="mt-1 text-sm text-primary">{formatTry(unit)}</p>
                <div className="mt-2 flex items-center gap-2">
                  <button type="button" className="size-8 border" onClick={() => setQty(index, line.qty - 1)}>
                    −
                  </button>
                  <span className="min-w-6 text-center text-sm">{line.qty}</span>
                  <button type="button" className="size-8 border" onClick={() => setQty(index, line.qty + 1)}>
                    +
                  </button>
                  <button type="button" className="ml-2 text-xs text-muted-foreground" onClick={() => removeItem(index)}>
                    Kaldır
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="space-y-1">
        {taxMode === "extra" ? (
          <p className="text-sm text-muted-foreground">
            Ara toplam {formatTry(total)} + KDV %{taxPercent} = {formatTry(total + Math.round(total * (taxPercent / 100) * 100) / 100)}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">KDV fiyatlara dahildir.</p>
        )}
        <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">
          Toplam {formatTry(taxMode === "extra" ? total + Math.round(total * (taxPercent / 100) * 100) / 100 : total)}
        </p>
        <Link href="/odeme" className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}>
          Ödemeye geç
        </Link>
        </div>
      </div>
    </div>
  );
}
