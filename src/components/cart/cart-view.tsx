"use client";

import Link from "next/link";
import { Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { buttonVariants } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { formatTry } from "@/lib/mock-catalog";
import { resolveUnitPrice } from "@/lib/pricing";
import { cn } from "@/lib/utils";

const FREE_SHIPPING_THRESHOLD = 1500;
const EXPRESS_SHIPPING_FEE = 150;

type ShippingMethod = "free" | "express";

function lineAttrs(line: { size?: string; color?: string; sku: string }) {
  const parts: string[] = [];
  if (line.size) parts.push(`Beden: ${line.size}`);
  if (line.color) parts.push(`Renk: ${line.color}`);
  if (parts.length === 0) return line.sku;
  return parts.join(", ");
}

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
  const [shipping, setShipping] = useState<ShippingMethod>("free");
  const [coupon, setCoupon] = useState("");

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

  const subtotal = items.reduce((sum, line) => {
    const unit = resolveUnitPrice(line.tiers, line.qty);
    return sum + unit * line.qty;
  }, 0);

  const taxAmount =
    taxMode === "extra" ? Math.round(subtotal * (taxPercent / 100) * 100) / 100 : 0;
  const goodsTotal = subtotal + taxAmount;
  const shippingFee = shipping === "express" ? EXPRESS_SHIPPING_FEE : 0;
  const total = goodsTotal + shippingFee;

  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const freeShippingUnlocked = remainingForFree === 0;

  function applyCoupon() {
    const code = coupon.trim();
    if (!code) {
      toast.error("Lütfen bir kupon kodu girin");
      return;
    }
    toast.message("Bu kupon geçerli değil", {
      description: "Kupon sistemi henüz aktif değil.",
    });
  }

  return (
    <div className="space-y-10">
      {/* Free shipping progress */}
      <div className="mx-auto max-w-md space-y-3 text-center">
        <p className="text-sm text-muted-foreground">
          {freeShippingUnlocked ? (
            <>
              Tebrikler — <span className="font-semibold text-charcoal">ÜCRETSİZ Kargo</span> kazandınız
            </>
          ) : (
            <>
              Ücretsiz kargo için{" "}
              <span className="font-semibold text-charcoal">{formatTry(remainingForFree)}</span> daha
              alışveriş yapın — <span className="font-semibold text-charcoal">ÜCRETSİZ Kargo</span>
            </>
          )}
        </p>
        <div className="relative mx-auto h-1.5 w-full max-w-sm rounded-full bg-[#E8E8E8]">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-emerald-500 transition-[width] duration-300"
            style={{ width: `${progressPct}%` }}
          />
          <span
            className="absolute top-1/2 flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm transition-[left] duration-300"
            style={{ left: `${Math.max(4, Math.min(progressPct, 96))}%` }}
            aria-hidden
          >
            <Truck className="size-3.5" strokeWidth={2} />
          </span>
        </div>
      </div>

      {/* Product table */}
      <div className="w-full">
        <div className="hidden grid-cols-[minmax(0,1fr)_7rem_6.5rem_6.5rem] gap-4 border-b border-border pb-3 text-sm font-semibold text-charcoal md:grid">
          <span>Ürün</span>
          <span className="text-center">Adet</span>
          <span className="text-right">Fiyat</span>
          <span className="text-right">Ara toplam</span>
        </div>

        <ul className="divide-y divide-border">
          {items.map((line, index) => {
            const unit = resolveUnitPrice(line.tiers, line.qty);
            const lineTotal = unit * line.qty;
            return (
              <li
                key={`${line.slug}-${line.color ?? ""}-${line.size ?? ""}-${index}`}
                className="grid grid-cols-1 gap-4 py-6 md:grid-cols-[minmax(0,1fr)_7rem_6.5rem_6.5rem] md:items-center md:gap-4"
              >
                <div className="flex gap-4">
                  {line.imageUrl ? (
                    <img
                      src={line.imageUrl}
                      alt=""
                      className="size-20 shrink-0 rounded-md bg-surface object-cover"
                    />
                  ) : (
                    <div className="size-20 shrink-0 rounded-md bg-surface" />
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-charcoal">{line.name}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{lineAttrs(line)}</p>
                    <button
                      type="button"
                      className="mt-2 text-sm text-muted-foreground underline-offset-2 hover:text-charcoal hover:underline"
                      onClick={() => removeItem(index)}
                    >
                      Kaldır
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-center">
                  <span className="text-sm text-muted-foreground md:hidden">Adet</span>
                  <div className="inline-flex h-10 items-center rounded-md border border-border">
                    <button
                      type="button"
                      className="flex size-10 items-center justify-center text-lg text-muted-foreground hover:text-charcoal"
                      aria-label="Azalt"
                      onClick={() => setQty(index, line.qty - 1)}
                    >
                      −
                    </button>
                    <span className="min-w-8 text-center text-sm font-medium tabular-nums">
                      {line.qty}
                    </span>
                    <button
                      type="button"
                      className="flex size-10 items-center justify-center text-lg text-muted-foreground hover:text-charcoal"
                      aria-label="Artır"
                      onClick={() => setQty(index, line.qty + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end">
                  <span className="text-sm text-muted-foreground md:hidden">Fiyat</span>
                  <span className="text-sm tabular-nums text-charcoal">{formatTry(unit)}</span>
                </div>

                <div className="flex items-center justify-between md:justify-end">
                  <span className="text-sm text-muted-foreground md:hidden">Ara toplam</span>
                  <span className="text-sm font-semibold tabular-nums text-charcoal">
                    {formatTry(lineTotal)}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Coupon + summary */}
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
        <div className="space-y-3">
          <div>
            <h2 className="text-base font-semibold text-charcoal">Kuponunuz var mı?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Anında sepet indirimi için kodunuzu ekleyin
            </p>
          </div>
          <div className="flex h-12 items-stretch overflow-hidden rounded-md border border-border bg-background">
            <input
              type="text"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  applyCoupon();
                }
              }}
              placeholder="Kod girin"
              className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-muted-foreground"
              aria-label="Kupon kodu"
            />
            <button
              type="button"
              onClick={applyCoupon}
              className="shrink-0 px-4 text-sm font-semibold text-charcoal hover:opacity-70"
            >
              Uygula
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-border p-6">
          <h2 className="text-base font-semibold text-charcoal">Sepet özeti</h2>

          <div className="mt-4 space-y-3">
            <label
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-md border px-3 py-3 text-sm transition-colors",
                shipping === "free" ? "border-charcoal" : "border-border hover:border-silver",
              )}
            >
              <input
                type="radio"
                name="shipping"
                value="free"
                checked={shipping === "free"}
                onChange={() => setShipping("free")}
                className="size-4 accent-charcoal"
              />
              <span className="flex-1 text-charcoal">Ücretsiz kargo</span>
              <span className="tabular-nums text-muted-foreground">{formatTry(0)}</span>
            </label>

            <label
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-md border px-3 py-3 text-sm transition-colors",
                shipping === "express" ? "border-charcoal" : "border-border hover:border-silver",
              )}
            >
              <input
                type="radio"
                name="shipping"
                value="express"
                checked={shipping === "express"}
                onChange={() => setShipping("express")}
                className="size-4 accent-charcoal"
              />
              <span className="flex-1 text-charcoal">Ekspres kargo</span>
              <span className="tabular-nums text-muted-foreground">+{formatTry(EXPRESS_SHIPPING_FEE)}</span>
            </label>
          </div>

          <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Ara toplam</span>
              <span className="tabular-nums text-charcoal">{formatTry(subtotal)}</span>
            </div>
            {taxMode === "extra" ? (
              <div className="flex justify-between text-muted-foreground">
                <span>KDV %{taxPercent}</span>
                <span className="tabular-nums text-charcoal">{formatTry(taxAmount)}</span>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">KDV fiyatlara dahildir.</p>
            )}
            {shipping === "express" ? (
              <div className="flex justify-between text-muted-foreground">
                <span>Kargo</span>
                <span className="tabular-nums text-charcoal">{formatTry(shippingFee)}</span>
              </div>
            ) : null}
            <div className="flex justify-between border-t border-border pt-3 text-base font-semibold text-charcoal">
              <span>Toplam</span>
              <span className="tabular-nums">{formatTry(total)}</span>
            </div>
          </div>

          <Link
            href="/odeme"
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-5 h-12 w-full rounded-md bg-charcoal text-white hover:bg-charcoal/90",
            )}
          >
            Ödemeye geç
          </Link>
        </div>
      </div>
    </div>
  );
}
