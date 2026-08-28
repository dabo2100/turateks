"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { fadeUp, heroStagger, MOTION_EASE, STATS } from "./motion-presets";
import { StatCounterCard } from "./stat-counter";

const SLIDES = [
  {
    src: "/brand/hero/hero-factory.png",
    alt: "Turateks yağmurluk üretim hattı",
  },
  {
    src: "/brand/hero/hero-harbor.png",
    alt: "Profesyonel yağmurluk — balıkçı ve kurye",
  },
] as const;

const SLIDE_MS = 7000;

export function HeroSection() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);

  const goTo = useCallback((next: number) => {
    setIndex((next + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const timer = window.setInterval(() => goTo(index + 1), SLIDE_MS);
    return () => window.clearInterval(timer);
  }, [index, goTo, reduced]);

  return (
    <section className="relative isolate min-h-[min(92vh,820px)] overflow-hidden text-white">
      {/* Background slider */}
      <div className="absolute inset-0 bg-charcoal" aria-hidden>
        {SLIDES.map((slide, i) => (
          <motion.div
            key={slide.src}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: i === index ? 1 : 0 }}
            transition={{ duration: reduced ? 0 : 1.35, ease: MOTION_EASE }}
          >
            <Image
              src={slide.src}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover object-[62%_center] sm:object-[58%_center] lg:object-center"
            />
          </motion.div>
        ))}

        {/* Readability overlays — stronger on the left (copy) and bottom (mobile stats) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/95 via-[#1c1c1c]/78 to-[#222]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414]/92 via-[#141414]/35 to-transparent" />
        <div className="absolute inset-0 bg-primary/5 mix-blend-soft-light" />
      </div>

      <div className="relative mx-auto flex min-h-[min(92vh,820px)] max-w-6xl flex-col justify-end px-4 pb-10 pt-28 sm:pb-14 sm:pt-32 lg:justify-center lg:pb-20 lg:pt-24">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-12">
          <motion.div
            className="max-w-xl space-y-5 sm:space-y-6"
            initial="hidden"
            animate="visible"
            variants={reduced ? undefined : heroStagger}
          >
            <motion.p
              variants={reduced ? undefined : fadeUp}
              className="inline-flex rounded-full border border-white/15 bg-black/35 px-3 py-1 text-xs font-semibold tracking-wide uppercase backdrop-blur-sm"
            >
              Türkiye&apos;de üretiliyor
            </motion.p>
            <motion.h1
              variants={reduced ? undefined : fadeUp}
              className="text-[1.75rem] font-semibold leading-tight tracking-tight drop-shadow-sm sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]"
            >
              Profesyonel{" "}
              <span className="text-primary">yağmurluk</span> üreticisi
            </motion.h1>
            <motion.p
              variants={reduced ? undefined : fadeUp}
              className="text-sm leading-7 text-white/85 sm:text-base sm:text-white/80"
            >
              Balıkçıdan kuryeye, inşaatçıdan denizciye — zorlu hava için endüstriyel kalite koruyucu
              giysi.
            </motion.p>
            <motion.div variants={reduced ? undefined : fadeUp} className="flex flex-wrap gap-3 pt-1">
              <Link href="/urunler" className={cn(buttonVariants({ size: "lg" }), "h-11 px-5 shadow-lg shadow-black/20")}>
                Ürünleri gör
              </Link>
              <Link
                href="/toptan"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "h-11 border-white/25 bg-white/10 px-5 text-white backdrop-blur-sm hover:bg-white/15 hover:text-white",
                )}
              >
                Toptan al
              </Link>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:gap-3">
            {STATS.map((stat, statIndex) => (
              <StatCounterCard key={stat.label} stat={stat} index={statIndex} startImmediately />
            ))}
          </div>
        </div>

        {/* Slide controls */}
        <div className="mt-8 flex items-center gap-3 lg:absolute lg:bottom-8 lg:left-4 lg:mt-0">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Slayt ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => goTo(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === index ? "w-8 bg-primary" : "w-4 bg-white/35 hover:bg-white/55",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
