"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Droplets,
  Layers,
  Ruler,
  Shield,
  Shirt,
  Truck,
  Users,
  Wind,
} from "lucide-react";
import { useMemo, useState } from "react";

import type { MockProduct } from "@/lib/mock-catalog";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "detaylar", label: "Detaylar" },
  { id: "malzeme", label: "Malzeme" },
  { id: "beden", label: "Beden & Kesim" },
  { id: "kargo", label: "Kargo & İade" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const TAG_ICONS = [Shirt, Layers, Shield, Wind, Droplets, Users] as const;

function FeatureIcon({ index }: { index: number }) {
  const Icon = TAG_ICONS[index % TAG_ICONS.length];
  return <Icon className="size-5 shrink-0 text-charcoal" strokeWidth={1.5} aria-hidden />;
}

export function ProductInfoTabs({ product }: { product: MockProduct }) {
  const [tab, setTab] = useState<TabId>("detaylar");
  const urls = product.imageUrls ?? [];
  const detailImage = urls[1] ?? urls[0];

  const materialSpecs = useMemo(
    () =>
      product.specs.filter((s) =>
        /kumaş|su|kaplama|membran|pvc|polyester|görünürlük|parça/i.test(s.label),
      ),
    [product.specs],
  );

  const otherSpecs = useMemo(() => {
    const materialLabels = new Set(materialSpecs.map((s) => s.label));
    return product.specs.filter((s) => !materialLabels.has(s.label));
  }, [product.specs, materialSpecs]);

  return (
    <section className="mt-16 sm:mt-20" aria-labelledby="product-info-heading">
      <h2 id="product-info-heading" className="sr-only">
        Ürün bilgileri
      </h2>

      <div
        className="flex gap-6 overflow-x-auto border-b border-border"
        role="tablist"
        aria-label="Ürün bilgi sekmeleri"
      >
        {TABS.map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`tab-${item.id}`}
              aria-selected={active}
              aria-controls={`panel-${item.id}`}
              tabIndex={active ? 0 : -1}
              onClick={() => setTab(item.id)}
              className={cn(
                "shrink-0 border-b-2 pb-3 text-sm transition-colors",
                active
                  ? "border-charcoal font-semibold text-charcoal"
                  : "border-transparent text-muted-foreground hover:text-charcoal",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-12">
        <div
          role="tabpanel"
          id={`panel-${tab}`}
          aria-labelledby={`tab-${tab}`}
          className="min-w-0"
        >
          {tab === "detaylar" ? (
            <div className="space-y-6">
              <p className="text-sm leading-7 text-muted-foreground sm:text-[0.9375rem] sm:leading-8">
                {product.description}
              </p>
              {(product.tags.length > 0 || otherSpecs.some((s) => s.label === "Kullanım")) && (
                <ul className="space-y-3.5">
                  {product.tags.map((tag, i) => (
                    <li key={tag} className="flex items-center gap-3 text-sm text-charcoal">
                      <FeatureIcon index={i} />
                      <span>{tag}</span>
                    </li>
                  ))}
                  {otherSpecs
                    .filter((s) => s.label === "Kullanım")
                    .map((s, i) => (
                      <li key={s.label} className="flex items-center gap-3 text-sm text-charcoal">
                        <FeatureIcon index={product.tags.length + i} />
                        <span>{s.value}</span>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          ) : null}

          {tab === "malzeme" ? (
            <div className="space-y-4">
              <p className="text-sm leading-7 text-muted-foreground">
                Ürünün teknik malzeme ve koruma özellikleri aşağıdadır.
              </p>
              {(materialSpecs.length > 0 ? materialSpecs : product.specs).length > 0 ? (
                <ul className="divide-y overflow-hidden rounded-xl border border-border">
                  {(materialSpecs.length > 0 ? materialSpecs : product.specs).map((row) => (
                    <li
                      key={row.label}
                      className="flex items-start justify-between gap-4 px-4 py-3 text-sm"
                    >
                      <span className="text-muted-foreground">{row.label}</span>
                      <span className="text-right font-medium text-charcoal">{row.value}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Malzeme bilgisi yakında eklenecek.</p>
              )}
            </div>
          ) : null}

          {tab === "beden" ? (
            <div className="space-y-5">
              <p className="text-sm leading-7 text-muted-foreground">
                Doğru bedeni seçmek için beden tablosuna bakın. Şüpheniz varsa bir üst bedeni tercih
                edebilir veya WhatsApp üzerinden ölçülendirme desteği alabilirsiniz.
              </p>
              {product.sizes.length > 0 ? (
                <div>
                  <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-charcoal">
                    <Ruler className="size-4" strokeWidth={1.5} aria-hidden />
                    Mevcut bedenler
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <span
                        key={s}
                        className="min-w-11 rounded-xl border border-border px-3.5 py-2.5 text-center text-sm font-medium text-charcoal"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Bu üründe beden seçeneği yok (tek beden).</p>
              )}
            </div>
          ) : null}

          {tab === "kargo" ? (
            <div className="space-y-5 text-sm leading-7 text-muted-foreground">
              <div className="flex gap-3">
                <Truck className="mt-0.5 size-5 shrink-0 text-charcoal" strokeWidth={1.5} aria-hidden />
                <p>
                  Siparişleriniz Türkiye genelinde kargoya verilir. Toptan ve hacimli siparişlerde
                  teslimat süresi ürün ve adrese göre değişiklik gösterebilir.
                </p>
              </div>
              <div className="flex gap-3">
                <Shield className="mt-0.5 size-5 shrink-0 text-charcoal" strokeWidth={1.5} aria-hidden />
                <p>
                  Ödeme PayTR altyapısı ile güvenli şekilde alınır. İade ve cayma koşulları için yasal
                  metinleri inceleyebilirsiniz.
                </p>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1">
                <Link href="/iade" className="font-medium text-charcoal underline-offset-4 hover:underline">
                  İade politikası
                </Link>
                <Link
                  href="/mesafeli-satis"
                  className="font-medium text-charcoal underline-offset-4 hover:underline"
                >
                  Mesafeli satış
                </Link>
              </div>
            </div>
          ) : null}
        </div>

        <div className="relative hidden aspect-[4/5] overflow-hidden rounded-2xl bg-surface lg:block">
          {detailImage ? (
            <Image
              src={detailImage}
              alt=""
              fill
              sizes="(max-width: 1024px) 0vw, 40vw"
              className="object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
              {product.name}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
