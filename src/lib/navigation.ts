export const MAIN_NAV = [
  { href: "/urunler", label: "Ürünler" },
  { href: "/toptan", label: "Toptan" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/blog", label: "Blog" },
  { href: "/iletisim", label: "İletişim" },
] as const;

export const CATEGORY_NAV = [
  { href: "/urunler?kategori=balikci", label: "Balıkçı Yağmurluğu" },
  { href: "/urunler?kategori=kurye", label: "Kurye Takımı" },
  { href: "/urunler?kategori=insaat", label: "İnşaat / Endüstriyel" },
  { href: "/urunler?kategori=denizci", label: "Denizciler" },
] as const;

export const LEGAL_NAV = [
  { href: "/kvkk", label: "KVKK" },
  { href: "/mesafeli-satis", label: "Mesafeli Satış" },
  { href: "/iade", label: "İade Politikası" },
  { href: "/on-bilgilendirme", label: "Ön Bilgilendirme" },
] as const;

export const FOOTER_PRODUCT_NAV = [
  { href: "/urunler?kategori=balikci", label: "Balıkçı Yağmurluğu" },
  { href: "/urunler?kategori=kurye", label: "Kurye Takımı" },
  { href: "/urunler?kategori=insaat", label: "İnşaat" },
  { href: "/urunler?kategori=denizci", label: "Denizciler" },
  { href: "/urunler", label: "Tüm Ürünler" },
] as const;
