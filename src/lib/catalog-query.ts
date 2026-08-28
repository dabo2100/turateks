import { CATEGORIES, MOCK_PRODUCTS, productFromPrice, type MockProduct } from "@/lib/mock-catalog";

export const PAGE_SIZE = 6;

export type CatalogQuery = {
  kategori?: string;
  etiket?: string;
  sira?: string;
  sayfa?: string;
};

export function filterCatalog(query: CatalogQuery, source: MockProduct[] = MOCK_PRODUCTS) {
  let items: MockProduct[] = [...source];

  if (query.kategori) {
    items = items.filter((p) => p.category === query.kategori);
  }
  if (query.etiket) {
    items = items.filter((p) => p.tags.includes(query.etiket!));
  }

  switch (query.sira) {
    case "fiyat-artan":
      items.sort((a, b) => productFromPrice(a) - productFromPrice(b));
      break;
    case "fiyat-azalan":
      items.sort((a, b) => productFromPrice(b) - productFromPrice(a));
      break;
    case "isim":
      items.sort((a, b) => a.name.localeCompare(b.name, "tr"));
      break;
    default:
      break;
  }

  const page = Math.max(1, Number(query.sayfa) || 1);
  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, pages);
  const start = (safePage - 1) * PAGE_SIZE;

  return {
    items: items.slice(start, start + PAGE_SIZE),
    total,
    page: safePage,
    pages,
    categoryLabel:
      source.find((p) => p.category === query.kategori)?.category ??
      CATEGORIES.find((c) => c.slug === query.kategori)?.label,
  };
}

export function catalogHref(query: CatalogQuery) {
  const params = new URLSearchParams();
  if (query.kategori) params.set("kategori", query.kategori);
  if (query.etiket) params.set("etiket", query.etiket);
  if (query.sira && query.sira !== "varsayilan") params.set("sira", query.sira);
  if (query.sayfa && query.sayfa !== "1") params.set("sayfa", query.sayfa);
  const qs = params.toString();
  return qs ? `/urunler?${qs}` : "/urunler";
}
