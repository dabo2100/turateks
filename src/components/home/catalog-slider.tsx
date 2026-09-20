"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Droplets, Sparkles, ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { ProductCard } from "@/components/catalog/product-card";
import type { MockProduct } from "@/lib/mock-catalog";
import { cn } from "@/lib/utils";

const CATEGORY_FILTERS = [
  { id: "all", label: "Tümü" },
  { id: "balikci", label: "Balıkçı" },
  { id: "kurye", label: "Kurye / Moto" },
  { id: "insaat", label: "İnşaat / Saha" },
  { id: "denizci", label: "Denizci" },
  { id: "wholesale", label: "Toptan Alım" },
] as const;

export function CatalogSlider({ products }: { products: MockProduct[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const reduced = useReducedMotion();

  // Filter products based on active tab
  const filteredProducts = products.filter((p) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "wholesale") return p.wholesale;
    return p.category === activeFilter;
  });

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    const maxScroll = scrollWidth - clientWidth;
    setScrollProgress(maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      return () => el.removeEventListener("scroll", checkScroll);
    }
  }, [filteredProducts]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const { clientWidth } = scrollRef.current;
    const scrollAmount = clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: reduced ? "auto" : "smooth",
    });
  };

  return (
    <section className="relative mx-auto max-w-6xl px-4 py-14 sm:py-18" aria-label="Öne çıkan yağmurluklar">
      {/* Header & Controls */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold tracking-wider text-primary uppercase">
            <Droplets className="size-3.5" />
            <span>Öne Çıkan Ürünler</span>
          </div>
          <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl text-charcoal">
            Profesyonel Yağmurluk Kataloğu
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base max-w-xl">
            Ağır hava şartları, açık deniz, şantiye ve motokurye ekipleri için endüstriyel standartlarda %100 su geçirmez koruma.
          </p>
        </div>

        {/* Right Action: All Products Link */}
        <div className="flex items-center justify-end">
          <Link
            href="/urunler"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            <span>Tümünü gör</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="mt-6 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORY_FILTERS.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveFilter(cat.id)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer",
              activeFilter === cat.id
                ? "bg-charcoal text-white shadow-sm"
                : "bg-surface text-muted-foreground hover:bg-border/60 hover:text-charcoal",
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Product Slider / Carousel Container */}
      <div className="relative group/catalog-slider mt-6">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          aria-label="Önceki ürünler"
          className={cn(
            "absolute left-1 sm:-left-5 top-1/2 -translate-y-1/2 z-20 flex size-11 items-center justify-center rounded-full border border-border/80 bg-white/95 text-charcoal shadow-lg shadow-black/10 backdrop-blur-sm transition-all duration-200 cursor-pointer",
            canScrollLeft
              ? "opacity-90 hover:opacity-100 hover:scale-110 hover:bg-primary hover:text-white hover:border-primary active:scale-95"
              : "opacity-0 pointer-events-none",
          )}
        >
          <ChevronLeft className="size-6 -translate-x-0.5" />
        </button>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          aria-label="Sonraki ürünler"
          className={cn(
            "absolute right-1 sm:-right-5 top-1/2 -translate-y-1/2 z-20 flex size-11 items-center justify-center rounded-full border border-border/80 bg-white/95 text-charcoal shadow-lg shadow-black/10 backdrop-blur-sm transition-all duration-200 cursor-pointer",
            canScrollRight
              ? "opacity-90 hover:opacity-100 hover:scale-110 hover:bg-primary hover:text-white hover:border-primary active:scale-95"
              : "opacity-0 pointer-events-none",
          )}
        >
          <ChevronRight className="size-6 translate-x-0.5" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-6 pt-2 scroll-smooth snap-x snap-mandatory scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {filteredProducts.map((product) => (
            <div
              key={product.slug}
              className="w-[280px] shrink-0 snap-start sm:w-[300px] lg:w-[calc(25%-15px)]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Scroll Progress Bar */}
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-surface">
          <div
            className="h-full bg-primary/60 transition-all duration-300 rounded-full"
            style={{ width: `${Math.max(15, scrollProgress)}%` }}
          />
        </div>
      </div>
    </section>
  );
}
