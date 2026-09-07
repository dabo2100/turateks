import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { ProductCard } from "@/components/catalog/product-card";
import { ProductBuyBox } from "@/components/product/product-buy-box";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInfoTabs } from "@/components/product/product-info-tabs";
import { JsonLd } from "@/components/seo/json-ld";
import { loadCatalog, loadCategories, loadProduct } from "@/lib/catalog";
import { productFromPrice } from "@/lib/mock-catalog";
import { absoluteUrl, breadcrumbJsonLd, buildMetadata, productJsonLd, truncateText } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await loadProduct(slug);
  if (!product) return {};
  return buildMetadata({
    title: product.name,
    description: truncateText(product.description),
    path: `/urunler/${product.slug}`,
    image: product.imageUrls[0] ? absoluteUrl(product.imageUrls[0]) : undefined,
  });
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await loadProduct(slug);
  if (!product) notFound();

  const [categories, catalog] = await Promise.all([loadCategories(), loadCatalog()]);
  const category = categories.find((c) => c.slug === product.category);
  const related = catalog
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4);

  const crumbs = [
    { name: "Anasayfa", path: "/" },
    { name: "Ürünler", path: "/urunler" },
    ...(category ? [{ name: category.name, path: `/urunler?kategori=${category.slug}` }] : []),
    { name: product.name, path: `/urunler/${product.slug}` },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={productJsonLd({
          name: product.name,
          slug: product.slug,
          description: product.description,
          sku: product.sku,
          image: product.imageUrls[0] ? absoluteUrl(product.imageUrls[0]) : undefined,
          price: productFromPrice(product),
        })}
      />

      <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary">
          Anasayfa
        </Link>
        <span className="mx-2">/</span>
        <Link href="/urunler" className="hover:text-primary">
          Ürünler
        </Link>
        {category ? (
          <>
            <span className="mx-2">/</span>
            <Link href={`/urunler?kategori=${category.slug}`} className="hover:text-primary">
              {category.name}
            </Link>
          </>
        ) : null}
        <span className="mx-2">/</span>
        <span className="text-charcoal">{product.name}</span>
      </nav>

      {/* Purchase area: gallery + variants only (no long description) */}
      <div className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12">
        <ProductGallery angles={product.angles} name={product.name} urls={product.imageUrls} />

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {product.isNew ? (
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-charcoal">
                Yeni
              </span>
            ) : null}
            {product.wholesale ? (
              <span className="rounded-full bg-copper/15 px-3 py-1 text-xs font-semibold text-copper">
                Toptan
              </span>
            ) : null}
          </div>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-charcoal sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">SKU: {product.sku}</p>

          <div className="mt-8">
            <ProductBuyBox product={product} />
          </div>
        </div>
      </div>

      <ProductInfoTabs product={product} />

      {related.length > 0 ? (
        <section className="mt-16 sm:mt-20">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-xl font-semibold text-charcoal sm:text-2xl">Beğenebileceğiniz ürünler</h2>
            <Link
              href={category ? `/urunler?kategori=${category.slug}` : "/urunler"}
              className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-charcoal hover:text-primary"
            >
              Tümünü gör
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
