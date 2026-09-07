"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { BadgePercent, Minus, Plus, RefreshCcw, ShieldCheck, ShoppingBag } from "lucide-react";

import { useCartStore } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import type { MockProduct } from "@/lib/mock-catalog";
import { formatTry } from "@/lib/mock-catalog";
import { formatQtyRange, isTierActive, resolveUnitPrice } from "@/lib/pricing";
import { whatsappHref } from "@/lib/site";
import { cn } from "@/lib/utils";

const MAX_QTY = 9999;

function clampQty(n: number) {
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.min(MAX_QTY, Math.floor(n));
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export function ProductBuyBox({ product }: { product: MockProduct }) {
  const [colorId, setColorId] = useState(product.colors[0]?.id ?? "");
  const [size, setSize] = useState<string>("");
  const [qty, setQty] = useState(1);
  const [qtyDraft, setQtyDraft] = useState("1");
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();

  const color = product.colors.find((c) => c.id === colorId);
  const baseUnit = product.tiers[0]?.unitPrice ?? 0;
  const unit = useMemo(() => resolveUnitPrice(product.tiers, qty), [product.tiers, qty]);
  const line = unit * qty;
  const discountPct =
    baseUnit > 0 && unit < baseUnit ? Math.round(((baseUnit - unit) / baseUnit) * 100) : 0;
  const canAdd =
    (product.sizes.length === 0 || Boolean(size)) &&
    (product.colors.length === 0 || Boolean(colorId));

  function applyQty(next: number) {
    const n = clampQty(next);
    setQty(n);
    setQtyDraft(String(n));
  }

  function onQtyInputChange(raw: string) {
    const cleaned = digitsOnly(raw);
    setQtyDraft(cleaned);
    if (cleaned === "") return;
    const n = clampQty(parseInt(cleaned, 10));
    setQty(n);
  }

  function onQtyBlur() {
    if (qtyDraft === "") {
      applyQty(1);
      return;
    }
    applyQty(parseInt(qtyDraft, 10));
  }

  return (
    <div className="space-y-6">
      {/* Live price */}
      <div>
        <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
          <p className="text-3xl font-semibold tracking-tight text-charcoal tabular-nums sm:text-4xl">
            {formatTry(unit)}
          </p>
          {discountPct > 0 ? (
            <>
              <p className="pb-1 text-lg text-muted-foreground line-through tabular-nums">
                {formatTry(baseUnit)}
              </p>
              <span className="mb-1 rounded-full bg-charcoal px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white uppercase">
                %{discountPct} indirim
              </span>
            </>
          ) : null}
        </div>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Birim fiyat · Toplam <span className="font-medium text-charcoal">{formatTry(line)}</span>
        </p>
      </div>

      {/* Tier table */}
      <div>
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Miktara göre birim fiyat
        </p>
        <div className="mt-2 overflow-hidden rounded-xl border border-border">
          {product.tiers.map((tier) => {
            const active = isTierActive(tier, qty);
            return (
              <div
                key={tier.minQty}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 text-sm transition-colors",
                  active ? "bg-primary/10" : "bg-background",
                )}
              >
                <span className={cn(active && "font-medium text-charcoal")}>{formatQtyRange(tier)}</span>
                <span className={cn("font-semibold tabular-nums", active ? "text-primary" : "text-charcoal")}>
                  {formatTry(tier.unitPrice)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {product.colors.length > 0 ? (
        <div>
          <p className="text-sm font-semibold text-charcoal">
            Renk: <span className="font-medium">{color?.label ?? "Seçin"}</span>
          </p>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {product.colors.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setColorId(c.id)}
                className={cn(
                  "size-9 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.12)] transition",
                  colorId === c.id && "shadow-[0_0_0_2px_#333333]",
                )}
                style={{ backgroundColor: c.hex }}
                aria-label={c.label}
                aria-pressed={colorId === c.id}
              />
            ))}
          </div>
        </div>
      ) : null}

      {product.sizes.length > 0 ? (
        <div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-charcoal">
              Beden{size ? `: ${size}` : ""}
            </p>
            {!size ? <p className="text-xs text-muted-foreground">Lütfen beden seçin</p> : null}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={cn(
                  "min-w-11 rounded-xl border px-3.5 py-2.5 text-sm font-medium transition",
                  size === s
                    ? "border-charcoal bg-charcoal text-white"
                    : "border-border bg-white text-charcoal hover:border-charcoal/40",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* Qty: steppers + typed numeric input */}
      <div>
        <p className="text-sm font-semibold text-charcoal">Adet</p>
        <div className="mt-3 flex w-fit items-stretch overflow-hidden rounded-xl border border-border bg-white">
          <button
            type="button"
            className="flex size-11 items-center justify-center text-charcoal transition hover:bg-muted disabled:opacity-40"
            onClick={() => applyQty(qty - 1)}
            disabled={qty <= 1}
            aria-label="Azalt"
          >
            <Minus className="size-4" />
          </button>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            enterKeyHint="done"
            aria-label="Adet"
            value={qtyDraft}
            onChange={(e) => onQtyInputChange(e.target.value)}
            onBlur={onQtyBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur();
              }
            }}
            className="w-14 border-x border-border bg-transparent text-center text-sm font-semibold tabular-nums text-charcoal outline-none"
          />
          <button
            type="button"
            className="flex size-11 items-center justify-center text-charcoal transition hover:bg-muted disabled:opacity-40"
            onClick={() => applyQty(qty + 1)}
            disabled={qty >= MAX_QTY}
            aria-label="Artır"
          >
            <Plus className="size-4" />
          </button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Adedi yazarak da girebilirsiniz (sadece rakam).</p>
      </div>

      <div className="flex gap-2.5">
        <Button
          type="button"
          size="lg"
          className="h-12 flex-1 rounded-xl bg-charcoal text-white hover:bg-charcoal/90"
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
          <ShoppingBag className="size-4" />
          Sepete ekle
        </Button>
      </div>

      <a
        href={whatsappHref(`${product.name} (${product.sku}) için toptan fiyat almak istiyorum.`)}
        className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-border text-sm font-medium transition hover:bg-muted"
      >
        WhatsApp&apos;tan teklif al
      </a>

      <ul className="grid gap-4 border-t border-border pt-5 sm:grid-cols-3">
        {[
          { icon: BadgePercent, title: "Toptan fiyat", text: "Miktara göre indirim" },
          { icon: RefreshCcw, title: "Kolay iade", text: "Sorunsuz iade imkanı" },
          { icon: ShieldCheck, title: "Güvenli ödeme", text: "PayTR ile korumalı" },
        ].map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex items-start gap-2.5">
            <Icon className="mt-0.5 size-5 shrink-0 text-charcoal" strokeWidth={1.5} aria-hidden />
            <div>
              <p className="text-xs font-semibold text-charcoal">{title}</p>
              <p className="text-[11px] leading-4 text-muted-foreground">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
