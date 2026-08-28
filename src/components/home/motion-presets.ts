/** Shared Motion presets — scroll reveals, mobile-friendly offsets, reduced-motion fallbacks. */

export const MOTION_EASE = [0.22, 1, 0.36, 1] as const;

/** Triggers a bit early on small viewports (negative bottom margin). */
export const SCROLL_VIEWPORT = {
  once: true,
  amount: 0.18,
  margin: "0px 0px -48px 0px" as const,
};

export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: MOTION_EASE },
  },
};

export const fadeUpReduced = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.45, ease: MOTION_EASE },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: MOTION_EASE },
  },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.06 },
  },
};

export const heroStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.11, delayChildren: 0.05 },
  },
};

export const STATS: { end?: number; suffix?: string; text?: string; label: string }[] = [
  { end: 37, suffix: "+", label: "Yıllık üretim deneyimi" },
  { end: 200, suffix: "+", label: "Aktif toptan müşteri" },
  { end: 50, suffix: "+", label: "Ürün modeli" },
  { text: "TR", label: "Tamamen yerli üretim" },
];

export const REASONS = [
  {
    icon: "factory" as const,
    title: "Fabrika kalitesi",
    text: "1987'den bu yana Türkiye'de üretim. Standart dışı ürün çıkmaz.",
  },
  {
    icon: "shield" as const,
    title: "Toptan fiyat",
    text: "10 adet ve üzeri siparişlerde kademeli fiyat avantajı.",
  },
  {
    icon: "truck" as const,
    title: "Hızlı teslimat",
    text: "Stok ürünlerde 2–3 iş günü kargo. Toptan üretim takvimi şeffaf.",
  },
] as const;

export const WHOLESALE_STEPS = [
  ["Ürün seçin", "Katalogdan ürün ve renk seçin."],
  ["Toptan fiyat görün", "Adet girin, anlık birim fiyat görün."],
  ["Teklif veya sipariş", "WhatsApp veya direkt sipariş."],
] as const;
