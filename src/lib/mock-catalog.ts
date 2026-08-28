export type PriceTier = {
  minQty: number;
  maxQty: number | null;
  unitPrice: number;
};

export type ProductColor = {
  id: string;
  label: string;
  hex: string;
};

export type MockProduct = {
  slug: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  tags: string[];
  wholesale: boolean;
  isNew: boolean;
  colors: ProductColor[];
  sizes: string[];
  angles: string[];
  tiers: PriceTier[];
  specs: { label: string; value: string }[];
  imageUrls?: string[];
};

export const CATEGORIES = [
  { slug: "balikci", label: "Balıkçı Yağmurluğu" },
  { slug: "kurye", label: "Kurye Takımı" },
  { slug: "insaat", label: "İnşaat / Endüstriyel" },
  { slug: "denizci", label: "Denizciler" },
  { slug: "hafif", label: "Hafif Yağmurluk" },
] as const;

function tiers(base: number): PriceTier[] {
  return [
    { minQty: 1, maxQty: 9, unitPrice: base },
    { minQty: 10, maxQty: 49, unitPrice: Math.round(base * 0.86) },
    { minQty: 50, maxQty: null, unitPrice: Math.round(base * 0.74) },
  ];
}

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    slug: "balikci-yagmurluk-pro",
    name: "Balıkçı Yağmurluk Pro",
    sku: "TRT-BYP-001",
    category: "balikci",
    description:
      "Ağır hava koşulları için tasarlanmış PVC kaplı profesyonel balıkçı yağmurluk. Kaynaklı dikişler ve reflektif şerit detayları ile tam koruma sağlar.",
    tags: ["Su Geçirmez", "PVC Kaplama"],
    wholesale: true,
    isNew: false,
    colors: [
      { id: "sari", label: "Sarı", hex: "#E8C547" },
      { id: "turuncu", label: "Turuncu", hex: "#F58220" },
      { id: "lacivert", label: "Lacivert", hex: "#1E3A5F" },
    ],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    angles: ["Ön", "Yan", "Detay", "Sırt"],
    tiers: tiers(890),
    specs: [
      { label: "Kumaş", value: "0,35 mm PVC kaplı polyester" },
      { label: "Su sütunu", value: "10.000 mm+" },
      { label: "Kullanım", value: "Balıkçılık, açık deniz" },
    ],
  },
  {
    slug: "kurye-takimi-x200",
    name: "Kurye Takımı X200",
    sku: "TRT-KTX-200",
    category: "kurye",
    description:
      "Motokurye ve dağıtım ekipleri için rüzgar kesici, su geçirmez takım. Reflektif detaylarla gece görünürlüğü artırır.",
    tags: ["Su Geçirmez", "Rüzgar Kesici"],
    wholesale: true,
    isNew: true,
    colors: [
      { id: "siyah", label: "Siyah", hex: "#222222" },
      { id: "lacivert", label: "Lacivert", hex: "#1E3A5F" },
    ],
    sizes: ["M", "L", "XL", "2XL"],
    angles: ["Ön", "Yan", "Detay"],
    tiers: tiers(620),
    specs: [
      { label: "Kumaş", value: "Kaplamalı ripstop" },
      { label: "Su sütunu", value: "8.000 mm" },
      { label: "Kullanım", value: "Kurye, moto kargo" },
    ],
  },
  {
    slug: "insaat-yagmurluk-heavy",
    name: "İnşaat Yağmurluk Heavy",
    sku: "TRT-IYH-003",
    category: "insaat",
    description:
      "Şantiye ve ağır saha işleri için kalın PVC kaplama. Yırtılmaya dayanıklı, sade kesim.",
    tags: ["Su Geçirmez", "PVC Kaplama"],
    wholesale: true,
    isNew: false,
    colors: [
      { id: "sari", label: "Sarı", hex: "#E8C547" },
      { id: "haki", label: "Haki", hex: "#5C6B3A" },
    ],
    sizes: ["L", "XL", "2XL", "3XL"],
    angles: ["Ön", "Yan", "Detay"],
    tiers: tiers(740),
    specs: [
      { label: "Kumaş", value: "0,40 mm PVC" },
      { label: "Su sütunu", value: "12.000 mm" },
      { label: "Kullanım", value: "İnşaat, saha" },
    ],
  },
  {
    slug: "denizci-yagmurluk-lite",
    name: "Denizci Yağmurluk Lite",
    sku: "TRT-DYL-004",
    category: "denizci",
    description:
      "Hafif ama su geçirmez denizci kesim. Uzun süre giyime uygun, hareket rahatlığı öncelikli.",
    tags: ["Su Geçirmez", "Rüzgar Kesici"],
    wholesale: false,
    isNew: true,
    colors: [
      { id: "lacivert", label: "Lacivert", hex: "#1E3A5F" },
      { id: "sari", label: "Sarı", hex: "#E8C547" },
    ],
    sizes: ["S", "M", "L", "XL"],
    angles: ["Ön", "Yan", "Sırt"],
    tiers: tiers(1150),
    specs: [
      { label: "Kumaş", value: "Nefes alır membran" },
      { label: "Su sütunu", value: "10.000 mm" },
      { label: "Kullanım", value: "Deniz, marina" },
    ],
  },
  {
    slug: "hafif-gunluk-yagmurluk",
    name: "Hafif Günlük Yağmurluk",
    sku: "TRT-HGY-005",
    category: "hafif",
    description: "Günlük kullanım ve depo/lojistik için hafif yağmurluk.",
    tags: ["Su Geçirmez", "Hafif"],
    wholesale: false,
    isNew: false,
    colors: [{ id: "lacivert", label: "Lacivert", hex: "#1E3A5F" }],
    sizes: ["S", "M", "L", "XL"],
    angles: ["Ön", "Yan"],
    tiers: tiers(390),
    specs: [
      { label: "Kumaş", value: "Hafif polyester kaplama" },
      { label: "Su sütunu", value: "5.000 mm" },
      { label: "Kullanım", value: "Günlük, depo" },
    ],
  },
  {
    slug: "pvc-tulum-pro",
    name: "PVC Tulum Pro",
    sku: "TRT-PTP-006",
    category: "insaat",
    description: "Tam kapalı tulum. Kimyasal sıçrama ve yoğun yağmur için.",
    tags: ["Su Geçirmez", "PVC Kaplama"],
    wholesale: true,
    isNew: false,
    colors: [
      { id: "sari", label: "Sarı", hex: "#E8C547" },
      { id: "yesil", label: "Yeşil", hex: "#3F6B3A" },
    ],
    sizes: ["M", "L", "XL", "2XL", "3XL"],
    angles: ["Ön", "Yan", "Detay"],
    tiers: tiers(560),
    specs: [
      { label: "Kumaş", value: "PVC tulum" },
      { label: "Su sütunu", value: "15.000 mm" },
      { label: "Kullanım", value: "Endüstri, temizlik" },
    ],
  },
  {
    slug: "fermuarli-balikci-takim",
    name: "Fermuarlı Balıkçı Takım",
    sku: "TRT-FBT-007",
    category: "balikci",
    description: "Ceket + pantolon takım. Fermuarlı giyim, hızlı giy-çıkar.",
    tags: ["Su Geçirmez", "PVC Kaplama"],
    wholesale: true,
    isNew: true,
    colors: [
      { id: "haki", label: "Haki", hex: "#5C6B3A" },
      { id: "sari", label: "Sarı", hex: "#E8C547" },
    ],
    sizes: ["M", "L", "XL", "2XL"],
    angles: ["Ön", "Yan", "Detay"],
    tiers: tiers(980),
    specs: [
      { label: "Kumaş", value: "PVC takım" },
      { label: "Parça", value: "Ceket + pantolon" },
      { label: "Kullanım", value: "Balıkçılık" },
    ],
  },
  {
    slug: "neon-pardesu",
    name: "Neon Sarı Pardesü",
    sku: "TRT-NPD-008",
    category: "kurye",
    description: "Yüksek görünürlük pardesü. Yol ve saha ekipleri için.",
    tags: ["Su Geçirmez", "Rüzgar Kesici"],
    wholesale: true,
    isNew: true,
    colors: [{ id: "neon", label: "Neon Sarı", hex: "#D4E157" }],
    sizes: ["M", "L", "XL", "2XL"],
    angles: ["Ön", "Yan"],
    tiers: tiers(510),
    specs: [
      { label: "Kumaş", value: "Kaplamalı polyester" },
      { label: "Görünürlük", value: "Neon + reflektif" },
      { label: "Kullanım", value: "Kurye, yol" },
    ],
  },
];

export const MOCK_POSTS = [
  {
    slug: "pvc-mi-polyester-mi",
    title: "PVC mi, Polyester mi? Profesyonel Yağmurluk Seçimi",
    tag: "Ürün Bilgisi",
    minutes: 5,
  },
  {
    slug: "toptan-yagmurluk-alirken",
    title: "Toptan Yağmurluk Alırken Dikkat Edilmesi Gerekenler",
    tag: "Toptan",
    minutes: 7,
  },
  {
    slug: "su-sutunu-nedir",
    title: "Su Geçirmezlik Standartları: Su Sütunu Nedir?",
    tag: "Teknik",
    minutes: 4,
  },
] as const;

export function formatTry(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);
}

export function productFromPrice(product: MockProduct) {
  return Math.min(...product.tiers.map((t) => t.unitPrice));
}

export function getProduct(slug: string) {
  return MOCK_PRODUCTS.find((p) => p.slug === slug);
}

export function allTags() {
  return [...new Set(MOCK_PRODUCTS.flatMap((p) => p.tags))].sort((a, b) =>
    a.localeCompare(b, "tr"),
  );
}
