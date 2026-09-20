import Link from "next/link";
import { ArrowUpRight, BadgePercent, Droplets, ShieldCheck } from "lucide-react";

import { formatTry, productFromPrice, type MockProduct } from "@/lib/mock-catalog";
import { cn } from "@/lib/utils";

function RaincoatIllustration({
  colorHex,
  label,
  hoverLabel,
}: {
  colorHex?: string;
  label: string;
  hoverLabel: string;
}) {
  const coatColor = colorHex || "#F58220";

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-b from-[#F8FAFC] to-[#EEF2F6]">
      {/* Subtle technical grid & rain pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(#1E3A5F 1px, transparent 1px), linear-gradient(135deg, rgba(30,58,95,0.05) 25%, transparent 25%, transparent 50%, rgba(30,58,95,0.05) 50%, rgba(30,58,95,0.05) 75%, transparent 75%, transparent)`,
          backgroundSize: "20px 20px, 40px 40px",
        }}
      />

      {/* Decorative floating water droplets */}
      <div className="pointer-events-none absolute inset-0 flex justify-between p-4 opacity-25">
        <Droplets className="size-5 text-blue-500/60 animate-pulse" />
        <Droplets className="size-4 text-blue-400/50 mt-6" />
      </div>

      {/* Stylized Modern Raincoat Vector */}
      <div className="relative z-10 flex flex-col items-center transition-transform duration-500 ease-out group-hover:scale-105">
        <svg
          viewBox="0 0 160 200"
          className="h-44 w-36 drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)] transition-transform duration-500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Hood */}
          <path
            d="M58 52 C58 24 102 24 102 52 Z"
            fill={coatColor}
            fillOpacity="0.85"
            stroke="#222222"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Hood inner shadow */}
          <path
            d="M68 50 C68 34 92 34 92 50 Z"
            fill="#1E293B"
            fillOpacity="0.25"
          />

          {/* Shoulders and Main Body */}
          <path
            d="M58 52 L26 84 L40 102 L52 92 L52 178 L108 178 L108 92 L120 102 L134 84 L102 52 Z"
            fill={coatColor}
            stroke="#222222"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Welded Storm Flap / Front Zipper */}
          <path
            d="M80 52 L80 178"
            stroke="#222222"
            strokeWidth="3"
            strokeDasharray="4 2"
          />

          {/* Reflective Safety Stripes */}
          <path
            d="M52 142 L108 142"
            stroke="#E2E8F0"
            strokeWidth="4"
            strokeOpacity="0.9"
          />
          <path
            d="M33 90 L45 99"
            stroke="#E2E8F0"
            strokeWidth="3.5"
            strokeOpacity="0.9"
          />
          <path
            d="M127 90 L115 99"
            stroke="#E2E8F0"
            strokeWidth="3.5"
            strokeOpacity="0.9"
          />

          {/* Waterproof Pockets */}
          <rect
            x="58"
            y="148"
            width="16"
            height="18"
            rx="2"
            fill="#222222"
            fillOpacity="0.15"
            stroke="#222222"
            strokeWidth="2"
          />
          <rect
            x="86"
            y="148"
            width="16"
            height="18"
            rx="2"
            fill="#222222"
            fillOpacity="0.15"
            stroke="#222222"
            strokeWidth="2"
          />
        </svg>

        {/* View Angle Pill */}
        <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-charcoal uppercase shadow-xs backdrop-blur-xs border border-black/5">
          <span className="transition-opacity group-hover:hidden">{label}</span>
          <span className="hidden transition-opacity group-hover:inline">{hoverLabel}</span>
        </span>
      </div>
    </div>
  );
}

export function ProductCard({
  product,
  className,
}: {
  product: MockProduct;
  className?: string;
}) {
  const [front, hover] = [product.angles[0] ?? "Ön Görünüm", product.angles[1] ?? product.angles[0] ?? "Detay"];
  const primaryColor = product.colors?.[0]?.hex;
  const waterColumnSpec = product.specs?.find((s) => /su/i.test(s.label))?.value;

  return (
    <Link
      href={`/urunler/${product.slug}`}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10",
        className,
      )}
    >
      {/* Visual / Image Area */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface">
        {product.imageUrls?.[0] ? (
          <>
            <img
              src={product.imageUrls[0]}
              alt={product.name}
              className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-0"
            />
            {product.imageUrls[1] ? (
              <img
                src={product.imageUrls[1]}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
              />
            ) : null}
          </>
        ) : (
          <RaincoatIllustration
            colorHex={primaryColor}
            label={front}
            hoverLabel={hover}
          />
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5">
          {product.wholesale ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-copper px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase shadow-sm">
              Toptan
            </span>
          ) : null}
          {product.isNew ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-charcoal px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase shadow-sm">
              Yeni
            </span>
          ) : null}
        </div>

        {/* Quick View Action Icon on Hover */}
        <div className="absolute top-3 right-3 z-10">
          <span className="flex size-8 items-center justify-center rounded-full bg-white/90 text-charcoal shadow-sm backdrop-blur-xs transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:scale-110">
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>

        {/* Water Protection Spec Badge (Bottom Left of Image) */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/60 bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-blue-700 shadow-xs backdrop-blur-md">
            <Droplets className="size-3 text-blue-500 fill-blue-500/20" />
            <span>{waterColumnSpec || "100% Su Geçirmez"}</span>
          </span>
        </div>
      </div>

      {/* Card Content Details */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div className="space-y-2.5">
          {/* Tags / Fabric type */}
          <div className="flex flex-wrap items-center gap-1.5">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-md bg-surface px-2 py-0.5 text-[10px] font-semibold text-muted-foreground border border-border/60"
              >
                {tag === "Su Geçirmez" ? (
                  <ShieldCheck className="size-3 text-primary" />
                ) : null}
                {tag}
              </span>
            ))}
          </div>

          {/* Product Name */}
          <h3 className="text-base font-bold tracking-tight text-foreground transition-colors group-hover:text-primary line-clamp-1">
            {product.name}
          </h3>

          {/* SKU & Color Swatches Row */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <p className="text-[11px] font-mono text-muted-foreground/80">
              {product.sku}
            </p>

            {/* Color Swatches */}
            {product.colors && product.colors.length > 0 ? (
              <div className="flex items-center -space-x-1" title={`${product.colors.length} renk seçeneği`}>
                {product.colors.slice(0, 3).map((c) => (
                  <span
                    key={c.id}
                    className="size-3.5 rounded-full border-2 border-white shadow-xs transition-transform hover:scale-125 hover:z-10"
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
                {product.colors.length > 3 ? (
                  <span className="flex size-3.5 items-center justify-center rounded-full bg-muted text-[8px] font-bold text-muted-foreground border-2 border-white">
                    +{product.colors.length - 3}
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        {/* Pricing Row */}
        <div className="mt-4 flex items-end justify-between border-t border-border/60 pt-3">
          <div>
            <span className="block text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              Başlangıç
            </span>
            <p className="text-lg font-extrabold text-foreground tracking-tight group-hover:text-primary transition-colors">
              {formatTry(productFromPrice(product))}
            </p>
          </div>

          {product.wholesale ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-copper/10 px-2 py-1 text-[11px] font-semibold text-copper border border-copper/20">
              <BadgePercent className="size-3.5" />
              <span>Toptan İndirim</span>
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
