import type { Metadata } from "next";
import Link from "next/link";

import { ProductCard } from "@/components/catalog/product-card";
import { buttonVariants } from "@/components/ui/button";
import { loadCatalog } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";
import { whatsappHref } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Toptan Yağmurluk",
  description: "Doğrudan üreticiden toptan yağmurluk. Adet kademeli fiyat, özel baskı ve hızlı teslimat.",
  path: "/toptan",
});

export default async function ToptanPage() {
  const catalog = await loadCatalog();
  const wholesale = catalog.filter((p) => p.wholesale);

  return (
    <div>
      <section className="bg-[#222222] text-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">Toptan</p>
          <h1 className="mt-2 max-w-2xl text-4xl font-semibold tracking-tight">Doğrudan üreticiden alın</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">
            Aynı ürün, yüksek adette daha düşük birim fiyat. 10 ve 50 adet kademeleri üründe tabloda görünür. Özel baskı için WhatsApp.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div>
              <h2 className="font-semibold">1. Ürün seçin</h2>
              <p className="mt-1 text-sm text-white/65">Katalogdan model ve renk.</p>
            </div>
            <div>
              <h2 className="font-semibold">2. Toptan fiyat görün</h2>
              <p className="mt-1 text-sm text-white/65">Adet girin, birim fiyat anında değişsin.</p>
            </div>
            <div>
              <h2 className="font-semibold">3. Teklif veya sipariş</h2>
              <p className="mt-1 text-sm text-white/65">WhatsApp veya sepet (Phase 5).</p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/urunler" className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}>
              Kataloğa git
            </Link>
            <a
              href={whatsappHref("Toptan fiyat ve minimum sipariş hakkında bilgi almak istiyorum.")}
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "h-11 border-white/20 bg-transparent px-5 text-white hover:bg-white/10 hover:text-white",
              )}
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-semibold">Toptan uygun ürünler</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {wholesale.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
