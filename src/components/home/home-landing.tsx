"use client";

import Link from "next/link";
import { Factory, ShieldCheck, Truck } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { HeroSection } from "@/components/home/hero-section";
import { ProductCard } from "@/components/catalog/product-card";
import { buttonVariants } from "@/components/ui/button";
import type { MockProduct } from "@/lib/mock-catalog";
import { CATEGORY_NAV } from "@/lib/navigation";
import { whatsappHref } from "@/lib/site";
import { cn } from "@/lib/utils";

import {
  MOTION_EASE,
  REASONS,
  SCROLL_VIEWPORT,
  WHOLESALE_STEPS,
} from "./motion-presets";
import { ScrollReveal, ScrollRevealItem, ScrollRevealStagger } from "./scroll-reveal";

const REASON_ICONS = {
  factory: Factory,
  shield: ShieldCheck,
  truck: Truck,
} as const;

type BlogTeaser = {
  slug: string;
  title: string;
  createdAt: string;
};

type HomeLandingProps = {
  catalog: MockProduct[];
  posts: BlogTeaser[];
};

export function HomeLanding({ catalog, posts }: HomeLandingProps) {
  const reduced = useReducedMotion();

  return (
    <>
      <HeroSection />

      <nav className="border-b border-border bg-surface">
        <ScrollReveal>
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-3 text-sm sm:gap-x-8">
            {CATEGORY_NAV.map((item, i) => (
              <span key={item.href} className="flex items-center gap-6 sm:gap-8">
                {i > 0 ? <span className="hidden text-silver sm:inline">|</span> : null}
                <Link href={item.href} className="text-charcoal transition-colors hover:text-primary">
                  {item.label}
                </Link>
              </span>
            ))}
          </div>
        </ScrollReveal>
      </nav>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:py-16">
        <ScrollReveal>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Öne çıkan ürünler</p>
          <div className="mt-2 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Katalog</h2>
            <Link href="/urunler" className="shrink-0 text-sm text-primary hover:underline">
              Tümünü gör →
            </Link>
          </div>
        </ScrollReveal>
        <ScrollRevealStagger className="mt-8 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {catalog.slice(0, 4).map((product) => (
            <ScrollRevealItem key={product.slug}>
              <ProductCard product={product} />
            </ScrollRevealItem>
          ))}
        </ScrollRevealStagger>
      </section>

      <section className="bg-surface">
        <ScrollRevealStagger className="mx-auto grid max-w-6xl gap-5 px-4 py-14 sm:grid-cols-2 sm:gap-6 sm:py-16 md:grid-cols-3">
          {REASONS.map(({ icon, title, text }) => {
            const Icon = REASON_ICONS[icon];
            return (
              <ScrollRevealItem key={title}>
                <motion.div
                  className="h-full rounded-xl bg-white p-5 sm:p-6"
                  whileHover={reduced ? undefined : { y: -4, transition: { duration: 0.25, ease: MOTION_EASE } }}
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
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                </motion.div>
              </ScrollRevealItem>
            );
          })}
        </ScrollRevealStagger>
      </section>

      <section className="bg-[#222222] text-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-16">
          <ScrollReveal>
            <p className="text-xs font-semibold tracking-wide text-primary uppercase">Toptan alım</p>
            <h2 className="mt-2 max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
              Doğrudan üreticiden alın
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
              10 adet ve üzeri siparişlerde kademeli toptan fiyat. Özel baskı ve kurumsal teklifler için WhatsApp veya
              formu kullanın.
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

      <section className="mx-auto max-w-6xl px-4 py-14 sm:py-16">
        <ScrollReveal>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Blog</p>
          <div className="mt-2 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Teknik & sektör</h2>
            <Link href="/blog" className="shrink-0 text-sm text-primary hover:underline">
              Tüm yazılar →
            </Link>
          </div>
        </ScrollReveal>
        <ScrollRevealStagger className="mt-8 grid gap-5 sm:gap-6 md:grid-cols-3">
          {posts.length === 0 ? (
            <ScrollRevealItem>
              <p className="text-sm text-muted-foreground">Yayınlanmış yazı henüz yok.</p>
            </ScrollRevealItem>
          ) : (
            posts.map((post) => (
              <ScrollRevealItem key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="block rounded-xl border border-border p-5 transition-colors hover:border-primary/40"
                >
                  <p className="text-xs text-muted-foreground">
                    {new Date(post.createdAt).toLocaleDateString("tr-TR")}
                  </p>
                  <h3 className="mt-3 font-semibold tracking-tight">{post.title}</h3>
                </Link>
              </ScrollRevealItem>
            ))
          )}
        </ScrollRevealStagger>
      </section>
    </>
  );
}
