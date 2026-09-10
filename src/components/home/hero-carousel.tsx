"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type TouchEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { HERO_SLIDES, type HeroSlideData } from "@/lib/hero-data";
import { whatsappHref } from "@/lib/site";
import { cn } from "@/lib/utils";

import { MOTION_EASE } from "./motion-presets";
import { MobileHeroCarousel } from "./mobile-hero-carousel";

const AUTO_PLAY_MS = 6500;

function HeroHeading({ title }: { title: string }) {
  const words = title.split(" ");
  const firstLine = words.slice(0, -1).join(" ");
  const accentWord = words.at(-1);

  return (
    <h1 className="font-black leading-[0.94] tracking-[-0.06em] text-white drop-shadow-[0_6px_24px_rgba(0,0,0,0.32)]">
      <span className="block">{firstLine}</span>
      <span className="block text-primary">{accentWord}</span>
    </h1>
  );
}

function SlideDots({ current, onSelect }: { current: number; onSelect: (index: number) => void }) {
  return (
    <div className="flex items-center gap-2" aria-label={"Slayt " + (current + 1) + " / " + HERO_SLIDES.length}>
      {HERO_SLIDES.map((slide, index) => (
        <button
          key={slide.id}
          type="button"
          onClick={() => onSelect(index)}
          aria-label={(index + 1) + ". slayt"}
          aria-current={current === index ? "true" : undefined}
          className={cn(
            "h-2 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary",
            current === index ? "w-8 bg-primary" : "w-2 bg-white/40 hover:bg-white/70",
          )}
        />
      ))}
    </div>
  );
}

function HeroBackground({ slide, eager }: { slide: HeroSlideData; eager: boolean }) {
  return (
    <motion.picture
      className="absolute inset-0 block"
      initial={{ opacity: 0, scale: 1.015 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.65, ease: MOTION_EASE }}
    >
      <source media="(max-width: 767px)" srcSet={encodeURI(slide.mobileSrc.src)} />
      {/* eslint-disable-next-line @next/next/no-img-element -- picture provides art-directed desktop/mobile source selection. */}
      <img
        src={slide.desktopSrc}
        alt={slide.alt}
        className="size-full object-cover"
        decoding="async"
        fetchPriority={eager ? "high" : "auto"}
        loading={eager ? "eager" : "lazy"}
      />
    </motion.picture>
  );
}

function ArrowButton({ direction, onClick }: { direction: "previous" | "next"; onClick: () => void }) {
  const previous = direction === "previous";
  const Icon = previous ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={previous ? "Önceki slayt" : "Sonraki slayt"}
      className={cn(
        "absolute top-1/2 z-30 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white shadow-lg shadow-black/20 backdrop-blur-sm transition hover:border-primary/80 hover:bg-primary focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-primary sm:size-11",
        previous ? "left-3 sm:left-5" : "right-3 sm:right-5",
      )}
    >
      <Icon className="size-5" aria-hidden />
    </button>
  );
}

function DesktopHeroCarousel() {
  const reduced = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const total = HERO_SLIDES.length;

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const onChange = () => setIsDesktop(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrent((previous) => (previous + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrent((previous) => (previous - 1 + total) % total);
  }, [total]);

  const goToSlide = useCallback((index: number) => {
    setCurrent(index);
  }, []);

  useEffect(() => {
    if (reduced || isPaused || !isDesktop) return;
    const timer = window.setInterval(nextSlide, AUTO_PLAY_MS);
    return () => window.clearInterval(timer);
  }, [isDesktop, isPaused, nextSlide, reduced]);

  useEffect(() => {
    if (!isDesktop) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") prevSlide();
      if (event.key === "ArrowRight") nextSlide();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDesktop, nextSlide, prevSlide]);

  const handleTouchStart = (event: TouchEvent) => {
    touchStartX.current = event.targetTouches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (event: TouchEvent) => {
    touchEndX.current = event.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;

    const distance = touchStartX.current - touchEndX.current;
    if (distance > 45) nextSlide();
    if (distance < -45) prevSlide();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const activeSlide = HERO_SLIDES[current];

  return (
    <section
      className="relative isolate h-[clamp(700px,82vh,900px)] min-h-[700px] w-full overflow-hidden bg-[#05090f] text-white md:h-[clamp(680px,82vh,900px)] md:min-h-[680px]"
      aria-label="Öne çıkan ürünler"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence initial={false} mode="sync">
        <HeroBackground key={activeSlide.id} slide={activeSlide} eager={current === 0} />
      </AnimatePresence>

      {/* The art remains a single scene; this only cushions live copy against its deliberate negative space. */}
      <div className="pointer-events-none absolute inset-0 z-10 hidden bg-[linear-gradient(90deg,rgba(5,9,15,0.98)_0%,rgba(5,9,15,0.94)_18%,rgba(5,9,15,0.82)_32%,rgba(5,9,15,0.55)_44%,rgba(5,9,15,0.22)_56%,rgba(5,9,15,0.05)_68%,transparent_78%)] md:block" />
      <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(5,9,15,0.12)_0%,rgba(5,9,15,0)_38%,rgba(5,9,15,0.7)_69%,rgba(5,9,15,0.94)_100%)] md:hidden" />

      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={activeSlide.id + "-content"}
          className="relative z-20 flex h-full items-end px-5 pb-20 pt-14 sm:px-6 md:items-center md:px-[clamp(48px,5vw,100px)] md:py-20"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: reduced ? 0 : 0.38, ease: MOTION_EASE }}
        >
          <div className="w-full md:w-[min(620px,38vw)]">
            <span className="inline-flex items-center gap-2 rounded-md border border-primary/65 bg-black/20 px-3 py-1.5 text-[10px] font-bold tracking-[0.12em] text-primary uppercase backdrop-blur-sm md:text-xs">
              <ShieldCheck className="size-3.5" aria-hidden />
              {activeSlide.badge}
            </span>

            <div className="mt-4 hidden text-[clamp(3.375rem,4.5vw,5.125rem)] md:block">
              <HeroHeading title={activeSlide.title} />
            </div>

            {/* Each supplied phone composition already includes its campaign heading, so a second mobile H1 would duplicate it. */}
            <p className="mt-3 max-w-[32.5rem] text-sm leading-6 text-white/88 sm:text-[0.95rem] md:mt-5 md:text-[clamp(1rem,1.15vw,1.125rem)] md:leading-7">
              {activeSlide.description}
            </p>

            <ul
              className="mt-4 flex flex-wrap gap-x-4 gap-y-2 md:mt-6"
              aria-label={activeSlide.title + " öne çıkan özellikleri"}
            >
              {activeSlide.highlights.map((highlight) => (
                <li key={highlight} className="flex items-center gap-1.5 text-xs font-semibold leading-4 text-white/95 md:text-sm">
                  <Check className="size-4 shrink-0 text-primary" strokeWidth={3} aria-hidden />
                  {highlight}
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row md:mt-8 md:gap-3">
              <Link
                href={activeSlide.ctaPrimary.href}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 w-full gap-2 px-5 font-bold shadow-lg shadow-primary/25 transition-shadow hover:shadow-primary/45 sm:w-auto",
                )}
              >
                {activeSlide.ctaPrimary.label}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link
                href={whatsappHref(activeSlide.title + " hakkında bilgi ve toptan teklif almak istiyorum.")}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "h-12 w-full gap-2 border-white/30 bg-black/25 px-5 font-bold text-white backdrop-blur-sm hover:bg-white/10 hover:text-white sm:w-auto",
                )}
              >
                <MessageCircle className="size-4 text-[#25D366]" aria-hidden />
                {activeSlide.ctaSecondary.label}
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <ArrowButton direction="previous" onClick={prevSlide} />
      <ArrowButton direction="next" onClick={nextSlide} />
      <div className="absolute bottom-7 left-1/2 z-30 -translate-x-1/2 sm:bottom-8">
        <SlideDots current={current} onSelect={goToSlide} />
      </div>
    </section>
  );
}

export function HeroCarousel() {
  return (
    <>
      <div className="block md:hidden">
        <MobileHeroCarousel />
      </div>
      <div className="hidden md:block">
        <DesktopHeroCarousel />
      </div>
    </>
  );
}
