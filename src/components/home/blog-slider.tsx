"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl } from "@/lib/seo";
import { cn } from "@/lib/utils";

export type BlogSliderItem = {
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  minutes: number;
  image?: string;
  createdAt: string;
};

export function BlogSlider({ posts }: { posts: BlogSliderItem[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Turateks Yağmurluk Teknik & Sektörel Rehberler",
    description:
      "B2B toptan yağmurluk alım rehberleri, EN 343 su geçirmezlik standartları, PVC & PU kumaş özellikleri ve sektörel kullanım tavsiyeleri.",
    itemListElement: posts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/blog/${post.slug}`),
      name: post.title,
      description: post.excerpt,
      image: post.image ? absoluteUrl(post.image) : undefined,
    })),
  };

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
      window.addEventListener("resize", checkScroll);
      return () => {
        el.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [posts]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const { clientWidth } = scrollRef.current;
    const scrollAmount = clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (!posts || posts.length === 0) return null;

  return (
    <section
      className="relative mx-auto max-w-6xl px-4 py-14 sm:py-20"
      aria-labelledby="home-blog-heading"
    >
      <JsonLd data={itemListSchema} />
      {/* Background subtle decorative glow */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-72 w-full max-w-4xl -translate-x-1/2 rounded-full bg-primary/5 blur-3xl"
        aria-hidden="true"
      />

      {/* Header & Controls */}
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold tracking-wider text-primary uppercase shadow-xs">
            <BookOpen className="size-3.5" />
            <span>Teknik & Sektörel Rehber</span>
          </div>
          <h2
            id="home-blog-heading"
            className="mt-3 text-2xl font-black tracking-tight text-charcoal sm:text-3xl lg:text-4xl"
          >
            Yağmurluk ve Su Geçirmezlik Rehberi
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            B2B toptan yağmurluk alım rehberleri, EN 343 su geçirmezlik standartları, PVC & PU kumaş özellikleri ve sektörel kullanım tavsiyeleri.
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center justify-end">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-1.5 text-sm font-bold text-primary transition-colors hover:text-primary/80"
          >
            <span>Tüm yazıları incele</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Carousel Container with Left/Right Buttons */}
      <div className="relative group/slider mt-8">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          aria-label="Önceki yazılar"
          className={cn(
            "absolute left-1 sm:-left-5 top-1/2 -translate-y-1/2 z-20 flex size-11 items-center justify-center rounded-full border border-border/80 bg-white/95 text-charcoal shadow-lg shadow-black/10 backdrop-blur-sm transition-all duration-200",
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
          aria-label="Sonraki yazılar"
          className={cn(
            "absolute right-1 sm:-right-5 top-1/2 -translate-y-1/2 z-20 flex size-11 items-center justify-center rounded-full border border-border/80 bg-white/95 text-charcoal shadow-lg shadow-black/10 backdrop-blur-sm transition-all duration-200",
            canScrollRight
              ? "opacity-90 hover:opacity-100 hover:scale-110 hover:bg-primary hover:text-white hover:border-primary active:scale-95"
              : "opacity-0 pointer-events-none",
          )}
        >
          <ChevronRight className="size-6 translate-x-0.5" />
        </button>

        {/* Horizontal Carousel Track */}
        <div
          ref={scrollRef}
          className="no-scrollbar -mx-4 flex gap-5 overflow-x-auto px-4 pt-2 pb-4 sm:gap-6 sm:px-0 sm:mx-0 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
        {posts.map((post) => {
          const formattedDate = new Date(post.createdAt).toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
          const imageUrl = post.image || "/brand/hero/hero-factory.png";

          return (
            <article
              key={post.slug}
              className="group flex w-[280px] shrink-0 flex-col overflow-hidden rounded-2xl border border-border/80 bg-white shadow-md shadow-black/5 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 sm:w-[340px] lg:w-[365px] snap-start"
            >
              <Link
                href={`/blog/${post.slug}`}
                className="relative block aspect-[16/10] w-full overflow-hidden bg-muted"
                aria-label={post.title}
              >
                <Image
                  src={imageUrl}
                  alt={`${post.title} - Turateks Yağmurluk Blog`}
                  fill
                  sizes="(max-width: 640px) 280px, (max-width: 1024px) 340px, 365px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-90" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                  <span className="rounded-full bg-charcoal/85 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs backdrop-blur-md">
                    {post.tag || "Rehber"}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold text-white/90 backdrop-blur-md">
                    <Clock className="size-3 text-primary" />
                    <span>{post.minutes || 5} dk</span>
                  </span>
                </div>

                {/* Bottom image date tag */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-medium text-white/90">
                  <Calendar className="size-3.5 text-primary" />
                  <time dateTime={post.createdAt}>{formattedDate}</time>
                </div>
              </Link>

              {/* Card Body */}
              <div className="flex flex-1 flex-col p-5">
                <h3 className="line-clamp-2 text-base font-bold leading-snug tracking-tight text-charcoal transition-colors group-hover:text-primary sm:text-lg">
                  <Link href={`/blog/${post.slug}`} title={post.title}>
                    {post.title}
                  </Link>
                </h3>

                <p className="mt-2.5 line-clamp-2 flex-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {post.excerpt}
                </p>

                {/* Footer read more */}
                <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3.5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:underline">
                    <span>Yazıyı oku</span>
                    <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>

                  <span className="text-[11px] font-medium text-muted-foreground/80">
                    Turateks Uzmanlık
                  </span>
                </div>
              </div>
            </article>
          );
        })}
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${Math.max(15, scrollProgress)}%` }}
          />
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          {posts.length} Teknik Rehber
        </span>
      </div>
    </section>
  );
}
