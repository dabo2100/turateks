"use client";

import Image from "next/image";
import { ChevronDown, Search, X } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export function ProductGallery({
  angles,
  name,
  urls = [],
}: {
  angles: string[];
  name: string;
  urls?: string[];
}) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const slides = urls.length > 0 ? urls : angles;
  const current = slides[active];
  const isImage = (slide: string) => slide.startsWith("/") || slide.startsWith("http");
  const currentIsImage = current ? isImage(current) : false;

  return (
    <>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:gap-4">
        {/* Thumbs — horizontal on mobile, vertical on desktop */}
        <div className="order-2 flex gap-2 overflow-x-auto pb-1 lg:order-1 lg:max-h-[560px] lg:w-[72px] lg:shrink-0 lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0">
          {slides.map((slide, i) => (
            <button
              key={`${slide}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-xl border-2 bg-surface transition-colors sm:size-[4.5rem] lg:size-[4.25rem]",
                i === active ? "border-charcoal" : "border-transparent hover:border-border",
              )}
              aria-label={`${name} ${angles[i] ?? i + 1}`}
              aria-current={i === active ? "true" : undefined}
            >
              {isImage(slide) ? (
                <Image src={slide} alt="" fill sizes="72px" className="object-cover" />
              ) : (
                <span className="flex size-full items-center justify-center px-1 text-center text-[10px] text-muted-foreground">
                  {slide}
                </span>
              )}
            </button>
          ))}
          {slides.length > 4 ? (
            <span className="hidden justify-center text-muted-foreground lg:flex" aria-hidden>
              <ChevronDown className="size-4" />
            </span>
          ) : null}
        </div>

        <div className="relative order-1 aspect-[4/5] w-full overflow-hidden rounded-2xl bg-surface lg:order-2 lg:min-h-[520px] lg:flex-1 lg:aspect-auto">
          {currentIsImage && current ? (
            <Image
              src={current}
              alt={name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <span className="text-lg font-medium tracking-wide text-charcoal">
                {angles[active] ?? "Ön"} görünüm
              </span>
            </div>
          )}

          {currentIsImage ? (
            <button
              type="button"
              onClick={() => setZoomed(true)}
              className="absolute right-3 bottom-3 flex size-10 items-center justify-center rounded-full border border-border bg-white/95 text-charcoal shadow-sm backdrop-blur-sm transition hover:bg-white"
              aria-label="Görseli büyüt"
            >
              <Search className="size-4" />
            </button>
          ) : null}
        </div>
      </div>

      {zoomed && currentIsImage && current ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Ürün görseli"
          onClick={() => setZoomed(false)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-white/90 text-charcoal"
            aria-label="Kapat"
            onClick={() => setZoomed(false)}
          >
            <X className="size-5" />
          </button>
          <div className="relative h-[min(90vh,900px)] w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <Image src={current} alt={name} fill sizes="100vw" className="object-contain" />
          </div>
        </div>
      ) : null}
    </>
  );
}
