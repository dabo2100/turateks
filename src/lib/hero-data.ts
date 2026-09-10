import type { StaticImageData } from "next/image";

import boyPardesuDesktop from "../../hero photos/desktop/Gemini_Generated_Image_4dfqpv4dfqpv4dfq.jpe";
import girgirciDesktop from "../../hero photos/desktop/Gemini_Generated_Image_83ju9w83ju9w83ju.jpe";
import cizmeliDesktop from "../../hero photos/desktop/Gemini_Generated_Image_auqu2bauqu2bauqu.jpe";
import balikciDesktop from "../../hero photos/desktop/Gemini_Generated_Image_tphuobtphuobtphu.jpe";
import motorcuDesktop from "../../hero photos/desktop/Gemini_Generated_Image_wbr983wbr983wbr9.jpe";
import cizmeliMobile from "../../hero photos/phone/Artboard 1.jpg";
import boyPardesuMobile from "../../hero photos/phone/Artboard 2.jpg";
import balikciMobile from "../../hero photos/phone/Artboard 3.jpg";
import motorcuMobile from "../../hero photos/phone/Artboard 4.jpg";
import girgirciMobile from "../../hero photos/phone/Artboard 5.jpg";

export interface HeroSlideData {
  id: string;
  badge: string;
  title: string;
  description: string;
  highlights: string[];
  ctaPrimary: {
    label: string;
    href: string;
  };
  ctaSecondary: {
    label: string;
    href: string;
  };
  desktopSrc: string;
  mobileSrc: StaticImageData;
  alt: string;
}

export const HERO_SLIDES: HeroSlideData[] = [
  {
    id: "girgirci-takim",
    badge: "Profesyonel koruma",
    title: "GIRGIRCI TAKIM",
    description:
      "Zorlu deniz şartlarına özel, dayanıklı ve su geçirmez gırgır balıkçı takım muşamba modelleriyle tanışın.",
    highlights: ["Zorlu Deniz Şartları", "Ekstra Dayanıklı Muşamba", "Balıkçı Takım"],
    ctaPrimary: {
      label: "Ürünü İncele",
      href: "/urunler/fermuarli-balikci-takim",
    },
    ctaSecondary: {
      label: "WhatsApp Sipariş",
      href: "/toptan",
    },
    desktopSrc: girgirciDesktop,
    mobileSrc: girgirciMobile,
    alt: "Turateks Gırgırcı Takım Balıkçı Muşambası",
  },
  {
    id: "balikci-takim",
    badge: "Profesyonel koruma",
    title: "BALIKÇI TAKIM",
    description:
      "Su geçirmez, hafif ve rahat balıkçı tip takım yağmurluk modelleriyle açık havada profesyonel koruma ve hareket özgürlüğünü deneyimleyin.",
    highlights: ["Hafif ve Rahat", "Profesyonel Koruma", "Hareket Özgürlüğü"],
    ctaPrimary: {
      label: "Ürünü İncele",
      href: "/urunler/balikci-yagmurluk-pro",
    },
    ctaSecondary: {
      label: "WhatsApp Sipariş",
      href: "/toptan",
    },
    desktopSrc: balikciDesktop,
    mobileSrc: balikciMobile,
    alt: "Turateks Balıkçı Takım Yağmurluk",
  },
  {
    id: "boy-pardesu",
    badge: "Profesyonel koruma",
    title: "BOY PARDESÜ",
    description:
      "Su geçirmez boy pardösü yağmurluk, farklı renk seçenekleri ve reflektör detaylarıyla en şiddetli yağışlarda bile şık ve tam koruma sağlar.",
    highlights: ["Reflektör Detayları", "Farklı Renk Seçenekleri", "Tam Boy Koruma"],
    ctaPrimary: {
      label: "Ürünü İncele",
      href: "/urunler/neon-pardesu",
    },
    ctaSecondary: {
      label: "WhatsApp Sipariş",
      href: "/toptan",
    },
    desktopSrc: boyPardesuDesktop,
    mobileSrc: boyPardesuMobile,
    alt: "Turateks Boy Pardesü Yağmurluk",
  },
  {
    id: "cizmeli-urunler",
    badge: "Profesyonel koruma",
    title: "ÇİZMELİ ÜRÜNLER",
    description:
      "Tek parça ısı yalıtımlı tulum-çizme wader, su geçirmez yapısıyla zorlu koşullarda tam koruma sunar. Tüm bedenlerde mevcuttur.",
    highlights: ["Isı Yalıtımlı", "Tulum-Çizme Wader", "Tüm Bedenlerde Mevcut"],
    ctaPrimary: {
      label: "Ürünü İncele",
      href: "/urunler/pvc-tulum-pro",
    },
    ctaSecondary: {
      label: "WhatsApp Sipariş",
      href: "/toptan",
    },
    desktopSrc: cizmeliDesktop,
    mobileSrc: cizmeliMobile,
    alt: "Turateks Çizmeli Tulum Ürünleri",
  },
  {
    id: "motorcu-takim",
    badge: "Profesyonel koruma",
    title: "MOTORCU TAKIM",
    description:
      "Reflektif motorcu yağmurluk takım (kurye) modelleriyle tanışın. Su geçirmez koruma ve gece sürüşlerinde maksimum güvenlik sunar. Yakalı ve kapşonlu detaylı iki farklı model seçeneğiyle mevcuttur.",
    highlights: ["Reflektif Gece Güvenliği", "Yakalı ve Kapüşonlu Seçenek", "Kurye & Motorcu"],
    ctaPrimary: {
      label: "Ürünü İncele",
      href: "/urunler/kurye-takimi-x200",
    },
    ctaSecondary: {
      label: "WhatsApp Sipariş",
      href: "/toptan",
    },
    desktopSrc: motorcuDesktop,
    mobileSrc: motorcuMobile,
    alt: "Turateks Reflektif Motorcu Yağmurluk Takım",
  },
];
