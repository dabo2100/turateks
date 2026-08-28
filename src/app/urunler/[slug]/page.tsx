import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/catalog/product-card";
import { ProductBuyBox } from "@/components/product/product-buy-box";
import { ProductGallery } from "@/components/product/product-gallery";
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
    .slice(0, 3);

  const crumbs = [
    { name: "Anasayfa", path: "/" },
    { name: "Ürünler", path: "/urunler" },
    ...(category ? [{ name: category.name, path: `/urunler?kategori=${category.slug}` }] : []),
    { name: product.name, path: `/urunler/${product.slug}` },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
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
      <p className="text-sm text-muted-foreground">
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
        {product.name}
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <ProductGallery angles={product.angles} name={product.name} urls={product.imageUrls} />
        <div>
          {product.wholesale ? (
            <span className="rounded bg-copper px-2 py-0.5 text-[10px] font-semibold text-white uppercase">
              Toptan
            </span>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-1">
            {product.tags.map((tag) => (
              <Link
                key={tag}
                href={`/urunler?etiket=${encodeURIComponent(tag)}`}
                className="rounded border border-border px-2 py-0.5 text-xs text-muted-foreground hover:border-primary"
              >
                {tag}
              </Link>
            ))}
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">{product.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">SKU: {product.sku}</p>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">{product.description}</p>
          <div className="mt-8">
            <ProductBuyBox product={product} />
          </div>
        </div>
      </div>

      {product.specs.length > 0 ? (
        <section className="mt-16">
          <h2 className="text-xl font-semibold">Teknik özellikler</h2>
          <div className="mt-4 divide-y rounded-xl border border-border">
            {product.specs.map((row) => (
              <div key={row.label} className="flex justify-between gap-4 px-4 py-3 text-sm">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-medium">{row.value}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className="mt-16">
          <h2 className="text-xl font-semibold">Benzer ürünler</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
