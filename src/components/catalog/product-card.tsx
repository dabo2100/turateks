import Link from "next/link";

import { formatTry, productFromPrice, type MockProduct } from "@/lib/mock-catalog";

export function ProductCard({ product }: { product: MockProduct }) {
  const [front, hover] = [product.angles[0] ?? "Ön", product.angles[1] ?? product.angles[0]];

  return (
    <Link
      href={`/urunler/${product.slug}`}
      className="group block overflow-hidden rounded-xl border border-border bg-card transition hover:-translate-y-0.5"
    >
      <div className="relative aspect-[4/5] bg-surface">
        {product.imageUrls?.[0] ? (
          <>
            <img
              src={product.imageUrls[0]}
              alt={product.name}
              className="h-full w-full object-cover transition-opacity group-hover:opacity-0"
            />
            {product.imageUrls[1] ? (
              <img
                src={product.imageUrls[1]}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity group-hover:opacity-100"
              />
            ) : null}
          </>
        ) : (
          <>
            <div className="absolute inset-0 flex items-center justify-center text-xs tracking-wide text-silver uppercase transition-opacity group-hover:opacity-0">
              {front}
            </div>
            <div className="absolute inset-0 flex items-center justify-center text-xs tracking-wide text-charcoal uppercase opacity-0 transition-opacity group-hover:opacity-100">
              {hover}
            </div>
          </>
        )}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.wholesale ? (
            <span className="rounded bg-copper px-2 py-0.5 text-[10px] font-semibold text-white uppercase">
              Toptan
            </span>
          ) : null}
          {product.isNew ? (
            <span className="rounded bg-charcoal px-2 py-0.5 text-[10px] font-semibold text-white uppercase">
              Yeni
            </span>
          ) : null}
        </div>
      </div>
      <div className="space-y-2 p-4">
        <div className="flex flex-wrap gap-1">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="rounded border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="font-semibold tracking-tight">{product.name}</h3>
        <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
        <div className="flex items-end justify-between gap-2">
          <p className="text-lg font-semibold text-primary">
            <span className="mr-1 text-xs font-normal text-muted-foreground">den</span>
            {formatTry(productFromPrice(product))}
          </p>
          {product.wholesale ? (
            <span className="text-xs text-copper">Toptan indirim ↓</span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
