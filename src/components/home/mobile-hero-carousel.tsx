"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type TouchEvent,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { HERO_SLIDES } from "@/lib/hero-data";
import { cn } from "@/lib/utils";

import { MOTION_EASE } from "./motion-presets";

const AUTO_PLAY_MS = 6500;

export function MobileHeroCarousel() {
  const reduced = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const total = HERO_SLIDES.length;

  const nextSlide = useCallback(() => {
    setCurrent((previous) => (previous + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrent((previous) => (previous - 1 + total) % total);
  }, [total]);

  const goToSlide = useCallback((index: number) => {
    setCurrent(index);
  }, []);

  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const onChange = () => setIsMobile(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced || isPaused || !isMobile) return;
    const timer = window.setInterval(nextSlide, AUTO_PLAY_MS);
    return () => window.clearInterval(timer);
  }, [isMobile, isPaused, nextSlide, reduced]);

  useEffect(() => {
    if (!isMobile) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") prevSlide();
      if (event.key === "ArrowRight") nextSlide();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobile, nextSlide, prevSlide]);

  const handleTouchStart = (event: TouchEvent) => {
    touchStartX.current = event.targetTouches[0].clientX;
    touchEndX.current = null;
    setIsPaused(true);
  };

  const handleTouchMove = (event: TouchEvent) => {
    touchEndX.current = event.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (touchStartX.current === null || touchEndX.current === null) return;

    const distance = touchStartX.current - touchEndX.current;
    if (distance > 40) nextSlide();
    if (distance < -40) prevSlide();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const activeSlide = HERO_SLIDES[current];

  return (
    <section
      className="relative flex w-full flex-col overflow-hidden bg-[#05090d] text-white select-none"
      aria-label="Öne çıkan ürünler"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Upper Area: Complete Mobile Artwork with object-fit: contain (Zero Cropping) */}
      <div className="relative aspect-[3/4] max-h-[calc(100svh-4rem-125px)] w-full overflow-hidden bg-[#05090d]">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={activeSlide.id}
            className="absolute inset-0 block size-full"
            initial={{ opacity: 0, scale: 1.005 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.45, ease: MOTION_EASE }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- direct rendering of dedicated phone artwork with contain */}
            <img
              src={activeSlide.mobileSrc.src}
              alt={activeSlide.alt}
              className="size-full object-contain object-top"
              decoding="async"
              fetchPriority={current === 0 ? "high" : "auto"}
              loading={current === 0 ? "eager" : "lazy"}
            />
          </motion.div>
        </AnimatePresence>

        {/* Subtle top vignette under navbar */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-14 bg-gradient-to-b from-[#05090d]/50 to-transparent" />

        {/* Subtle bottom vignette blending artwork seamlessly into the action panel */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(5, 9, 13, 0.65) 60%, #05090d 100%)",
          }}
        />

        {/* Lateral navigation arrows over the image area */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Önceki slayt"
          className="absolute left-3.5 top-[60%] z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white shadow-md backdrop-blur-sm transition active:scale-95 hover:bg-black/60 focus-visible:outline-2 focus-visible:outline-primary sm:left-4.5"
        >
          <ChevronLeft className="size-5" aria-hidden />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Sonraki slayt"
          className="absolute right-3.5 top-[60%] z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white shadow-md backdrop-blur-sm transition active:scale-95 hover:bg-black/60 focus-visible:outline-2 focus-visible:outline-primary sm:right-4.5"
        >
          <ChevronRight className="size-5" aria-hidden />
        </button>
      </div>

      {/* Mobile Action Panel: Deliberate premium UI area below artwork */}
      <div className="relative z-20 flex w-full flex-col justify-between bg-[#05090d] px-4 pt-3 pb-5 min-[390px]:px-6 min-[390px]:pt-4 min-[390px]:pb-6">
        {/* Top Control Row: Optional subtle product info on left + Product CTA pill on right */}
        <div className="flex w-full items-center justify-between gap-3">
          {/* Optional subtle product info */}
          <div className="min-w-0 pr-2">
            <span
              className="block text-[10px] font-bold tracking-[0.14em] uppercase transition-colors duration-300"
              style={{ color: activeSlide.mobileAccent }}
            >
              {activeSlide.badge}
            </span>
            <p className="truncate text-xs font-semibold text-white/80">
              {activeSlide.title}
            </p>
          </div>

          {/* Compact Product CTA Pill with current slide accent */}
          <div className="ml-auto shrink-0">
            <Link
              href={activeSlide.ctaPrimary.href}
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold tracking-wider uppercase shadow-lg backdrop-blur-md transition-all duration-200 active:scale-95"
              style={{
                backgroundColor: "rgba(10, 15, 24, 0.85)",
                borderColor: activeSlide.mobileAccent,
                color: activeSlide.mobileAccent,
                boxShadow: `0 0 16px -2px ${activeSlide.mobileAccent}30`,
              }}
            >
              <span>{activeSlide.mobileCtaLabel}</span>
              <ArrowRight
                className="size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5"
                style={{ color: activeSlide.mobileAccent }}
                aria-hidden
              />
            </Link>
          </div>
        </div>

        {/* Carousel Pagination Indicators */}
        <div
          className="mt-4 flex items-center justify-center gap-2"
          aria-label={`Slayt ${current + 1} / ${total}`}
        >
          {HERO_SLIDES.map((slide, index) => {
            const isActive = current === index;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => goToSlide(index)}
                aria-label={`${index + 1}. slayt`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "h-2 rounded-full transition-all duration-300 ease-out focus-visible:outline-2 focus-visible:outline-white",
                  isActive
                    ? "w-9 opacity-100"
                    : "w-2 bg-white/40 opacity-70 hover:bg-white/70 hover:opacity-100",
                )}
                style={
                  isActive ? { backgroundColor: slide.mobileAccent } : undefined
                }
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
