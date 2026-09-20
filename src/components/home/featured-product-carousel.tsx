"use client";

import { useState, type TransitionEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, ShoppingBag } from "lucide-react";

import { CATEGORIES, formatTry, productFromPrice, type MockProduct } from "@/lib/mock-catalog";
import { cn } from "@/lib/utils";

function FeaturedCard({ product }: { product: MockProduct }) {
  const category = CATEGORIES.find((item) => item.slug === product.category)?.label;
  const sizes = product.sizes.slice(0, 4);

  return (
    <Link
      href={`/urunler/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-black/5 bg-white p-2.5 shadow-[0_18px_45px_rgba(72,52,30,.10)] outline-none transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(72,52,30,.16)] focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1rem] bg-[#f4f0e8]">
        <Image src={product.imageUrls?.[0] ?? "/brand/logo.png"} alt={product.name} fill sizes="(max-width: 639px) 86vw, (max-width: 1023px) 29vw, 20vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.025]" />
        <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-bold tracking-[.08em] text-charcoal uppercase shadow-sm backdrop-blur">
          {product.isNew ? "Yeni" : product.wholesale ? "Toptan" : "Popüler"}
        </span>
        {product.colors.length > 0 ? (
          <div className="absolute right-3 bottom-3 flex gap-1 rounded-full bg-white/90 p-1.5 shadow-sm backdrop-blur">
            {product.colors.slice(0, 4).map((color) => <span key={color.id} className="size-3 rounded-full border border-black/10" style={{ backgroundColor: color.hex }} title={color.label} />)}
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col px-2 pt-3 pb-2">
        <p className="text-[10px] font-semibold tracking-[.08em] text-primary uppercase">{category ?? "Turateks"}</p>
        <h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-bold leading-5 tracking-tight text-charcoal">{product.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-[10px] leading-4 text-muted-foreground">
          {product.description}
        </p>
        {sizes.length > 0 ? (
          <div className="mt-3">
            <p className="mb-1.5 text-[10px] font-semibold text-muted-foreground">Beden seçin</p>
            <div className="grid grid-cols-4 gap-1">
              {sizes.map((size, index) => (
                <span key={size} className={cn("flex h-7 items-center justify-center rounded-lg border text-[10px] font-medium", index === Math.min(2, sizes.length - 1) ? "border-charcoal bg-charcoal text-white" : "border-border bg-white text-charcoal")}>{size}</span>
              ))}
            </div>
          </div>
        ) : null}
        <div className="mt-auto flex items-center gap-2 pt-4">
          <p className="min-w-0 flex-1 text-lg font-black tracking-tight text-charcoal">{formatTry(productFromPrice(product))}</p>
          <span className="flex h-10 items-center justify-center gap-1.5 rounded-full bg-charcoal px-3 text-[10px] font-bold text-white transition-colors group-hover:bg-primary">
            <ShoppingBag className="size-3.5" aria-hidden="true" /><span className="hidden lg:inline">İncele</span><ArrowUpRight className="size-3.5" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function FeaturedProductCarousel({ products }: { products: MockProduct[] }) {
  const items = products.slice(0, 5);
  const [order, setOrder] = useState(() => [...items.slice(-2), ...items.slice(0, -2)]);
  const [direction, setDirection] = useState<-1 | 0 | 1>(0);
  const [animating, setAnimating] = useState(false);

  if (items.length === 0) return null;

  const displayItems = [order.at(-1)!, ...order, order[0]];
  const activeDisplayIndex = 3 + direction;
  const activeProductIndex = items.findIndex((item) => item.slug === order[2]?.slug);

  const move = (nextDirection: -1 | 1) => {
    if (animating) return;
    setAnimating(true);
    setDirection(nextDirection);
  };

  const finishMove = (event: TransitionEvent<HTMLDivElement>) => {
    if (
      event.currentTarget !== event.target
      || (event.propertyName !== "transform" && event.propertyName !== "translate")
    ) return;
    if (!animating || direction === 0) return;
    setOrder((current) => direction === 1
      ? [...current.slice(1), current[0]]
      : [current.at(-1)!, ...current.slice(0, -1)]);
    setAnimating(false);
    setDirection(0);
  };

  const centerProduct = (productIndex: number) => {
    if (animating) return;
    setOrder(Array.from({ length: items.length }, (_, offset) => (
      items[(productIndex - 2 + offset + items.length) % items.length]
    )));
  };

  return (
    <div className="relative mt-8 sm:mt-10">
      <div className="h-[31.5rem] overflow-hidden sm:h-[31rem] lg:h-[33rem]">
        <div
          onTransitionEnd={finishMove}
          className={cn(
            "flex h-full will-change-transform",
            animating ? "transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)]" : "transition-none",
            direction === -1 && "-translate-x-[184%] sm:-translate-x-[33.333%] lg:translate-x-0",
            direction === 0 && "-translate-x-[276%] sm:-translate-x-[66.666%] lg:-translate-x-[20%]",
            direction === 1 && "-translate-x-[368%] sm:-translate-x-full lg:-translate-x-[40%]",
          )}
        >
          {displayItems.map((product, index) => {
            const distance = Math.abs(index - activeDisplayIndex);
            return (
              <div
                key={`${product.slug}-${index}`}
                className={cn(
                  "h-[29rem] w-[92%] shrink-0 p-2 transition-[transform,opacity] duration-700 ease-[cubic-bezier(.22,1,.36,1)] sm:h-[29.5rem] sm:w-1/3 lg:h-[31rem] lg:w-1/5",
                  distance === 0 && "relative z-20 scale-100 opacity-100 lg:scale-[1.06]",
                  distance === 1 && "scale-[.94] opacity-90",
                  distance > 1 && "scale-[.88] opacity-65",
                )}
              >
                <FeaturedCard product={product} />
              </div>
            );
          })}
        </div>
      </div>
      <button type="button" onClick={() => move(-1)} disabled={animating} className="absolute top-[44%] left-0 z-30 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/5 bg-white text-charcoal shadow-lg transition hover:bg-charcoal hover:text-white disabled:pointer-events-none sm:size-11 sm:-translate-x-1/3" aria-label="Önceki ürün"><ArrowLeft className="size-4" aria-hidden="true" /></button>
      <button type="button" onClick={() => move(1)} disabled={animating} className="absolute top-[44%] right-0 z-30 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/5 bg-white text-charcoal shadow-lg transition hover:bg-charcoal hover:text-white disabled:pointer-events-none sm:size-11 sm:translate-x-1/3" aria-label="Sonraki ürün"><ArrowRight className="size-4" aria-hidden="true" /></button>
      <div className="mt-1 flex justify-center gap-2" aria-label="Ürün slaytları">
        {items.map((product, index) => <button key={product.slug} type="button" onClick={() => centerProduct(index)} className={cn("h-2 rounded-full transition-all", activeProductIndex === index ? "w-7 bg-primary" : "w-2 bg-charcoal/20 hover:bg-charcoal/40")} aria-label={`${index + 1}. ürünü göster`} aria-current={activeProductIndex === index ? "true" : undefined} />)}
      </div>
    </div>
  );
}
