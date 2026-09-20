"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CloudRain, Fish, ShieldCheck } from "lucide-react";

import {
  ScrollReveal,
  ScrollRevealItem,
  ScrollRevealStagger,
} from "./scroll-reveal";

// Custom outline SVGs to match the reference icons with 1.5 stroke width
function ApronIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
      <path d="M8 7h8l2 5v9a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-9l2-5z" />
      <path d="M9 14h6v3a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-3z" />
    </svg>
  );
}

function MotorcycleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="5.5" cy="16.5" r="2.5" />
      <circle cx="18.5" cy="16.5" r="2.5" />
      <path d="M12 16.5h2l3-6h-4.5l-2 3-3-1" />
      <path d="M9.5 9.5l2-4.5h3" />
      <path d="M6 14l2-4.5" />
    </svg>
  );
}

function BoatIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M2 19c2 1 4 1 6 0s4-1 6 0 4 1 6 0" />
      <path d="M3.5 16.5l1.5-5h14l1.5 5c-2.5 1-4.5 1-6.5 0s-4-1-6 0-3 0.5-4.5 0z" />
      <path d="M12 11.5V5m0 0l-3 3m3-3h4v4h-4" />
    </svg>
  );
}

function PantsIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 3h12v3l-1 15h-3.5L12 11l-1.5 10H7L6 6V3z" />
      <path d="M6 6h12" />
    </svg>
  );
}

function JacketIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 7l4-4h8l4 4-2 4-3-1v10H9V10L6 11 4 7z" />
      <path d="M12 3v17" />
      <path d="M9 3a3 3 0 0 0 6 0" />
    </svg>
  );
}

function SleeveIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 8c3-2 11-2 14 0l-2 10c-3 2-7 2-10 0L5 8z" />
      <path d="M5 8c0 1.5 3.1 2.5 7 2.5s7-1 7-2.5" />
      <path d="M7 18c0 1 2.2 1.5 5 1.5s5-.5 5-1.5" />
      <path d="M8 12c1 1 3 1.5 4 1.5s3-.5 4-1.5" strokeDasharray="1 2" />
    </svg>
  );
}

type CategoryData = {
  number: string;
  title: string;
  subtitle: string;
  image: string;
  href: string;
  objectPosition: string;
  icon: React.ComponentType<{ className?: string }>;
  shopNow?: boolean;
};

const CATEGORIES_DATA: CategoryData[] = [
  {
    number: "01",
    title: "BOY PARDESÜ YAĞMURLUK",
    subtitle: "Uzun Boy Pardesü & Trençkot",
    image: "/categories/rainwear.webp",
    href: "/urunler?kategori=hafif",
    objectPosition: "center 25%",
    icon: CloudRain,
  },
  {
    number: "02",
    title: "ÖNLÜK",
    subtitle: "PVC Su Geçirmez İş Önlüğü",
    image: "/categories/apron.webp",
    href: "/urunler?kategori=insaat",
    objectPosition: "center 30%",
    icon: ApronIcon,
    shopNow: true,
  },
  {
    number: "03",
    title: "REFLEKTÖRLÜ BOY PARDESÜ",
    subtitle: "Yüksek Görünürlüklü İş Güvenliği",
    image: "/categories/reflective-raincoat.webp",
    href: "/urunler?kategori=kurye",
    objectPosition: "center 25%",
    icon: ShieldCheck,
  },
  {
    number: "04",
    title: "BALIKÇI TİP TAKIM YAĞMURLUK",
    subtitle: "Açık Deniz & Ağır Hizmet Takım",
    image: "/categories/fishing-rainwear.webp",
    href: "/urunler?kategori=balikci",
    objectPosition: "center 35%",
    icon: Fish,
  },
  {
    number: "05",
    title: "MOTORCU TAKIM",
    subtitle: "Motokurye Su & Rüzgar Geçirmez",
    image: "/categories/motorcycle-rainwear.webp",
    href: "/urunler?kategori=kurye",
    objectPosition: "center 38%",
    icon: MotorcycleIcon,
  },
  {
    number: "06",
    title: "GIRGIR BALIKÇI TAKIM MUŞAMBA",
    subtitle: "Endüstriyel Balıkçı Muşambası",
    image: "/categories/fishing-suit.webp",
    href: "/urunler?kategori=denizci",
    objectPosition: "center 45%",
    icon: BoatIcon,
  },
  {
    number: "07",
    title: "PANTOLON YAĞMURLUK",
    subtitle: "Askılı & Beli Lastikli Pantolon",
    image: "/categories/rain-pants.webp",
    href: "/urunler?kategori=balikci",
    objectPosition: "center 60%",
    icon: PantsIcon,
  },
  {
    number: "08",
    title: "ÇİZMELİ ÜRÜNLER",
    subtitle: "Dikişsiz Kaynaklı Çizmeli Tulum",
    image: "/categories/booted-products.webp",
    href: "/urunler?kategori=insaat",
    objectPosition: "center 75%",
    icon: JacketIcon,
  },
  {
    number: "09",
    title: "KOLLUK",
    subtitle: "Su Geçirmez Koruyucu Kolluk",
    image: "/categories/sleeves.webp",
    href: "/urunler",
    objectPosition: "center 48%",
    icon: SleeveIcon,
  },
];

export function CategoryShowcase() {
  return (
    <section
      className="mx-auto max-w-6xl px-4 py-12 sm:py-16"
      aria-labelledby="home-categories-heading"
    >
      {/* Top Header Area */}
      <ScrollReveal>
        <div className="flex items-center justify-center gap-3">
          <span className="h-px w-6 bg-border" aria-hidden="true" />
          <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase">
            ÜRÜN KOLEKSİYONLARI
          </span>
          <span className="h-px w-6 bg-border" aria-hidden="true" />
        </div>

        <h2
          id="home-categories-heading"
          className="mt-3 text-center text-2xl font-extrabold tracking-tight text-neutral-950 sm:text-3xl lg:text-[38px] lg:leading-[1.18]"
        >
          Zorlu hava koşullarına meydan okuyan
          <br className="hidden sm:inline" />{" "}
          profesyonel <span className="text-[#f58220]">yağmurluk</span> ve{" "}
          <span className="text-[#3b82f6]">koruyucu</span> giysiler.
        </h2>

        <p className="mx-auto mt-2.5 max-w-2xl text-center text-xs text-muted-foreground sm:text-sm md:text-base">
          Açık denizden şantiyeye, kuryeden endüstriyel tesislere: %100 su geçirmez profesyonel koruma ve toptan imalat çözümleri.
        </p>
      </ScrollReveal>

      {/* Responsive Grid:
          Mobile: 1 column across (cards stacked vertically under each other)
          Tablet: 2 columns across
          Desktop: 3 columns across for all 9 cards
      */}
      <ScrollRevealStagger className="mt-8 grid grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 md:gap-6.5">
        {CATEGORIES_DATA.map((category) => {
          const Icon = category.icon;

          return (
            <ScrollRevealItem
              key={category.number}
              className="w-full"
            >
              <Link
                href={category.href}
                className="group relative block w-full overflow-hidden rounded-2xl bg-[#0b121d] aspect-[2.4/1] sm:aspect-[2.1/1] md:aspect-[2.6/1] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              >
                {/* Background Image */}
                <Image
                  src={category.image}
                  alt={`${category.title} - ${category.subtitle}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  style={{ objectPosition: category.objectPosition }}
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />

                {/* Dark Vignette Overlay for Readability while preserving photo brightness */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-[#050c14]/90 via-[#050c14]/50 to-[#050c14]/15 transition-opacity duration-300 group-hover:opacity-95"
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#050c14]/40 via-transparent to-transparent opacity-60"
                  aria-hidden="true"
                />

                {/* Card Content Overlay */}
                <div className="relative flex h-full flex-col justify-between p-4 sm:p-4.5 lg:p-5">
                  {/* Top-Left: Number, Orange Accent Line, Outline Icon */}
                  <div className="flex flex-col gap-1.5 sm:gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white/85">
                        {category.number}
                      </span>
                      <span
                        className="h-[2px] w-5 rounded-full bg-[#f58220] sm:w-6"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="size-5 text-white/90 sm:size-[22px]">
                      <Icon className="size-full stroke-[1.5]" />
                    </div>
                  </div>

                  {/* Middle / Bottom Content */}
                  <div className="pr-12 sm:pr-14">
                    <h3 className="text-sm font-bold uppercase tracking-tight text-white leading-tight sm:text-[15px]">
                      {category.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-white/70">
                      {category.subtitle}
                    </p>
                  </div>

                  {/* Circular Arrow CTA */}
                  <div
                    className="absolute bottom-3.5 right-3.5 flex size-9 sm:size-10 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-xs text-white transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:border-primary"
                    aria-hidden="true"
                  >
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            </ScrollRevealItem>
          );
        })}
      </ScrollRevealStagger>

      {/* Mobile Full-Width CTA: "Tüm Koleksiyonları İncele →" */}
      <div className="mt-4 block sm:mt-5 md:hidden">
        <Link
          href="/urunler"
          className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#0d141f] px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-black active:scale-[0.99]"
        >
          <span>Tüm Koleksiyonları İncele</span>
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
