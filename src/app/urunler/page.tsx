import type { Metadata } from "next";
import Link from "next/link";

import { CatalogFilters } from "@/components/catalog/catalog-filters";
import { CatalogPagination } from "@/components/catalog/catalog-pagination";
import { CatalogSort } from "@/components/catalog/catalog-sort";
import { ProductCard } from "@/components/catalog/product-card";
import { loadCatalog, loadCategories } from "@/lib/catalog";
import { catalogHref, filterCatalog, type CatalogQuery } from "@/lib/catalog-query";
import { buildMetadata } from "@/lib/seo";

type Props = {
  searchParams: Promise<CatalogQuery>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const query = await searchParams;
  const categories = await loadCategories();
  const category = categories.find((c) => c.slug === query.kategori);
  const title = category?.name ?? "Yağmurluk Ürünleri";
  const description = category
    ? `${category.name} — üreticiden toptan ve perakende yağmurluk.`
    : "Profesyonel yağmurluk ve koruyucu giysi kataloğu. Toptan ve perakende.";
  return buildMetadata({
    title,
    description,
    path: catalogHref({ kategori: query.kategori }),
    index: !query.etiket,
  });
}

export default async function UrunlerPage({ searchParams }: Props) {
  const query = await searchParams;
  const [catalog, categories] = await Promise.all([loadCatalog(), loadCategories()]);
  const result = filterCatalog(query, catalog);
  const categoryLabel = categories.find((c) => c.slug === query.kategori)?.name;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">
          Anasayfa
        </Link>
        <span className="mx-2">/</span>
        Ürünler
      </p>
      <div className="mt-8 grid gap-10 lg:grid-cols-[220px_1fr]">
        <CatalogFilters query={query} categories={categories} tags={[]} />
        <div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                {categoryLabel ?? "Tüm Ürünler"}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">{result.total} ürün</p>
            </div>
            <CatalogSort query={query} />
          </div>
          {result.items.length === 0 ? (
            <div className="mt-12 rounded-xl border border-dashed border-border p-10 text-center">
              <p className="font-medium">Ürün bulunamadı</p>
              <p className="mt-1 text-sm text-muted-foreground">Filtreleri temizleyip tekrar deneyin.</p>
              <Link href={catalogHref({})} className="mt-4 inline-block text-sm text-primary">
                Filtreleri sıfırla
              </Link>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {result.items.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          )}
          <CatalogPagination query={query} page={result.page} pages={result.pages} />
        </div>
      </div>
    </div>
  );
}
