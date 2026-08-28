import type { Redirect } from "next/dist/lib/load-custom-routes";

/**
 * WordPress permalinks (from local dump):
 * - posts/pages: /%postname%/
 * - WooCommerce product_base: /urun
 * - category_base: urun-kategori
 * - tag_base: urun-etiketi
 *
 * New catalog: /urunler/[slug]. Tag archives are not recreated.
 */
export const WP_PERMANENT_REDIRECTS: Redirect[] = [
  { source: "/urun", destination: "/urunler", statusCode: 301 },
  { source: "/urun/:slug", destination: "/urunler/:slug", statusCode: 301 },
  { source: "/product/:slug", destination: "/urunler/:slug", statusCode: 301 },
  { source: "/shop", destination: "/urunler", statusCode: 301 },
  { source: "/shop/:path*", destination: "/urunler", statusCode: 301 },
  { source: "/urun-kategori/:slug", destination: "/urunler", statusCode: 301 },
  { source: "/product-category/:path*", destination: "/urunler", statusCode: 301 },
  { source: "/cart", destination: "/sepet", statusCode: 301 },
  { source: "/basket", destination: "/sepet", statusCode: 301 },
  { source: "/checkout", destination: "/odeme", statusCode: 301 },
  { source: "/my-account", destination: "/hesap", statusCode: 301 },
  { source: "/hesabim", destination: "/hesap", statusCode: 301 },
  { source: "/about", destination: "/hakkimizda", statusCode: 301 },
  { source: "/about-us", destination: "/hakkimizda", statusCode: 301 },
  { source: "/contact", destination: "/iletisim", statusCode: 301 },
  { source: "/privacy-policy", destination: "/kvkk", statusCode: 301 },
  { source: "/gizlilik-politikasi", destination: "/kvkk", statusCode: 301 },
  { source: "/iade-politikasi", destination: "/iade", statusCode: 301 },
  { source: "/mesafeli-satis-sozlesmesi", destination: "/mesafeli-satis", statusCode: 301 },
];

const GONE_EXACT = new Set([
  "/hizmetlerimiz",
  "/hizmetlerimiz",
  "/services",
  "/feed",
  "/comments/feed",
]);

const GONE_PREFIXES = [
  "/hizmetlerimiz/",
  "/hizmetlerimiz/",
  "/services/",
  "/urun-etiketi/",
  "/product-tag/",
  "/tag/",
];

export function isGonePath(pathname: string) {
  const path = pathname.replace(/\/$/, "") || "/";
  if (GONE_EXACT.has(path) || GONE_EXACT.has(pathname)) return true;
  return GONE_PREFIXES.some((prefix) => pathname.startsWith(prefix) || `${path}/`.startsWith(prefix));
}
