"use client";

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
  const slides = urls.length > 0 ? urls : angles;
  const current = slides[active];

  return (
    <div className="space-y-3">
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-surface">
        {current?.startsWith("/") || current?.startsWith("http") ? (
          <img src={current} alt={name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-lg font-medium tracking-wide text-charcoal">
            {angles[active] ?? "Ön"} görünüm
          </span>
        )}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {slides.map((slide, i) => (
          <button
            key={`${slide}-${i}`}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              "flex aspect-square items-center justify-center overflow-hidden rounded-lg border text-xs",
              i === active ? "border-primary text-primary" : "border-border text-muted-foreground",
            )}
            aria-label={`${name} ${angles[i] ?? i + 1}`}
          >
            {slide.startsWith("/") || slide.startsWith("http") ? (
              <img src={slide} alt="" className="h-full w-full object-cover" />
            ) : (
              slide
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
