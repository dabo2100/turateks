"use client";

import Image from "next/image";
import Link from "next/link";

import { ScrollReveal, ScrollRevealItem, ScrollRevealStagger } from "./scroll-reveal";

const HOME_CATEGORIES = [
  {
    href: "/urunler?kategori=balikci",
    label: "Balıkçı",
    image: "/uploads/2024/10/Balikci-takim-haki-logo-2.png",
  },
  {
    href: "/urunler?kategori=kurye",
    label: "Kurye",
    image: "/uploads/2024/10/motokurye-reflektorlu-musamba-yagmurluk-tam-takim.jpg",
  },
  {
    href: "/urunler?kategori=insaat",
    label: "İnşaat",
    image: "/uploads/2024/10/kamuflaj-boydan-ust-musamba-yagmurluk.jpg",
  },
  {
    href: "/urunler?kategori=denizci",
    label: "Denizci",
    image: "/uploads/2024/10/Girgirci-takim-1-logo.png",
  },
  {
    href: "/urunler?kategori=hafif",
    label: "Hafif",
    image: "/uploads/2024/10/Pardesu-haki-logo.png",
  },
  {
    href: "/urunler?kategori=kurye",
    label: "Pardesü",
    image: "/uploads/2024/10/Pardesu-ref-neon-sari-1-logo.png",
  },
] as const;

export function CategoryShowcase() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16" aria-labelledby="home-categories-heading">
      <ScrollReveal>
        <h2
          id="home-categories-heading"
          className="text-center text-2xl font-medium tracking-tight text-charcoal sm:text-3xl"
        >
          Popüler Kategoriler
        </h2>
      </ScrollReveal>

      <ScrollRevealStagger className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-4 md:grid-cols-3 md:gap-5">
        {HOME_CATEGORIES.map((category) => (
          <ScrollRevealItem key={`${category.href}-${category.label}`}>
            <Link
              href={category.href}
              className="group relative block aspect-[4/3] overflow-hidden rounded-xl bg-charcoal"
            >
              <Image
                src={category.image}
                alt=""
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 px-3 pb-4 text-center text-base font-semibold tracking-wide text-white sm:pb-5 sm:text-lg md:text-xl">
                {category.label}
              </span>
            </Link>
          </ScrollRevealItem>
        ))}
      </ScrollRevealStagger>
    </section>
  );
}
