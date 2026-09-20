"use client";

import Link from "next/link";
import {
  BadgePercent,
  Factory,
  Headphones,
  RefreshCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { BlogSlider, type BlogSliderItem } from "@/components/home/blog-slider";
import { CategoryShowcase } from "@/components/home/category-showcase";
import { CatalogSlider } from "@/components/home/catalog-slider";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { VideoShowcaseSection } from "@/components/home/video-showcase-section";
import { buttonVariants } from "@/components/ui/button";
import type { MockProduct } from "@/lib/mock-catalog";
import { whatsappHref } from "@/lib/site";
import { cn } from "@/lib/utils";

import {
  MOTION_EASE,
  REASONS,
  SCROLL_VIEWPORT,
  WHOLESALE_STEPS,
} from "./motion-presets";
import {
  ScrollReveal,
  ScrollRevealItem,
  ScrollRevealStagger,
} from "./scroll-reveal";

const REASON_ICONS = {
  factory: Factory,
  shield: ShieldCheck,
  truck: Truck,
} as const;

const TRUST_ITEMS = [
  {
    icon: BadgePercent,
    title: "Toptan özel fiyatlar",
    text: "Üreticiden kademeli fiyat avantajı",
  },
  {
    icon: ShieldCheck,
    title: "Güvenli ödeme",
    text: "PayTR ile güvenli ödeme",
  },
  {
    icon: Headphones,
    title: "24 saat hizmet",
    text: "Her an yanınızdayız",
  },
  {
    icon: RefreshCcw,
    title: "Kolay iade",
    text: "Sorunsuz iade imkanı",
  },
] as const;

type HomeLandingProps = {
  catalog: MockProduct[];
  posts: BlogSliderItem[];
};

export function HomeLanding({ catalog, posts }: HomeLandingProps) {
  const reduced = useReducedMotion();

  return (
    <>
      <HeroCarousel />

      <section
        className="relative z-10 border-b border-border/80 bg-gradient-to-b from-[#111315]/5 via-background to-background py-3.5 sm:py-8"
        aria-label="Turateks avantajları"
      >
        {/* Mobile: Infinite Moving Ticker / Marquee Strip */}
        <div className="relative overflow-hidden sm:hidden py-0.5">
          {/* Gradient fade masks on edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-background to-transparent" />

          <div className="flex w-max">
            {[0, 1].map((copyIdx) => (
              <div
                key={copyIdx}
                className="animate-marquee shrink-0 items-center gap-3.5 pr-3.5"
                aria-hidden={copyIdx > 0}
              >
                {TRUST_ITEMS.map(({ icon: Icon, title, text }) => (
                  <div
                    key={title}
                    className="flex shrink-0 items-center gap-3 rounded-2xl border border-border/80 bg-white px-4 py-2.5 shadow-xs"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-xs">
                      <Icon className="size-4.5" strokeWidth={2} aria-hidden />
                    </div>
                    <div className="whitespace-nowrap">
                      <p className="text-[11px] font-black uppercase tracking-wider text-charcoal">
                        {title}
                      </p>
                      <p className="text-[10px] leading-tight text-muted-foreground">
                        {text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Tablet & Desktop: 4 Grid Cards */}
        <div className="mx-auto hidden max-w-6xl px-4 sm:block">
          <ScrollReveal>
            <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
              {TRUST_ITEMS.map(({ icon: Icon, title, text }) => (
                <li
                  key={title}
                  className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-border/70 bg-white p-4 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                >
                  {/* Subtle hover gradient accent */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/[0.04] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Icon Box */}
                  <div className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-xs transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white group-hover:shadow-md group-hover:shadow-primary/25 sm:size-13">
                    <Icon
                      className="size-6 transition-transform duration-300 group-hover:rotate-6"
                      strokeWidth={1.8}
                      aria-hidden
                    />
                  </div>

                  {/* Content */}
                  <div className="relative min-w-0 flex-1">
                    <p className="text-xs sm:text-[13px] font-black tracking-wider text-charcoal uppercase transition-colors group-hover:text-primary">
                      {title}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      {text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </section>

      <CategoryShowcase />

      <VideoShowcaseSection />

      <CatalogSlider products={catalog} />

      <section className="bg-surface">
        <ScrollRevealStagger className="mx-auto grid max-w-6xl gap-5 px-4 py-14 sm:grid-cols-2 sm:gap-6 sm:py-16 md:grid-cols-3">
          {REASONS.map(({ icon, title, text }) => {
            const Icon = REASON_ICONS[icon];
            return (
              <ScrollRevealItem key={title}>
                <motion.div
                  className="h-full rounded-xl bg-white p-5 sm:p-6"
                  whileHover={
                    reduced
                      ? undefined
                      : {
                          y: -4,
                          transition: { duration: 0.25, ease: MOTION_EASE },
                        }
                  }
                >
                  <motion.div
                    initial={reduced ? false : { scale: 0.85, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={SCROLL_VIEWPORT}
                    transition={{ duration: 0.4, ease: MOTION_EASE }}
                  >
                    <Icon className="size-6 text-primary" aria-hidden />
                  </motion.div>
                  <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {text}
                  </p>
                </motion.div>
              </ScrollRevealItem>
            );
          })}
        </ScrollRevealStagger>
      </section>

      <section className="bg-[#222222] text-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-16">
          <ScrollReveal>
            <p className="text-xs font-semibold tracking-wide text-primary uppercase">
              Toptan alım
            </p>
            <h2 className="mt-2 max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
              Doğrudan üreticiden alın
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
              10 adet ve üzeri siparişlerde kademeli toptan fiyat. Özel baskı ve
              kurumsal teklifler için WhatsApp veya formu kullanın.
            </p>
          </ScrollReveal>

          <ScrollRevealStagger className="mt-8 grid gap-5 sm:grid-cols-3 sm:gap-6">
            {WHOLESALE_STEPS.map(([title, text], stepIndex) => (
              <ScrollRevealItem key={title}>
                <div className="relative pl-10 sm:pl-0">
                  <span className="absolute left-0 flex size-8 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary sm:static sm:mb-3 sm:inline-flex">
                    {stepIndex + 1}
                  </span>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-white/65">{text}</p>
                </div>
              </ScrollRevealItem>
            ))}
          </ScrollRevealStagger>

          <ScrollReveal delay={0.15}>
            <Link
              href={whatsappHref("Toptan fiyat teklifi almak istiyorum.")}
              className={cn(buttonVariants({ size: "lg" }), "mt-8 h-11 px-5")}
            >
              WhatsApp&apos;tan teklif al
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <BlogSlider posts={posts} />
    </>
  );
}
