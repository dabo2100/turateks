import type { Metadata } from "next";

import { getPage } from "@/lib/cms";
import { getSettings } from "@/lib/settings";
import { SITE } from "@/lib/site";

export const PUBLIC_PAGE_PATH: Record<string, string> = {
  hakkimizda: "/hakkimizda",
  iletisim: "/iletisim",
  kvkk: "/kvkk",
  "mesafeli-satis": "/mesafeli-satis",
  iade: "/iade",
  "on-bilgilendirme": "/on-bilgilendirme",
};

const NOINDEX = { index: false, follow: false } as const;

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

export function absoluteUrl(path = "/") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") return siteUrl();
  return `${siteUrl()}${normalized}`;
}

export function truncateText(value: string, max = 160) {
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

export const noIndexMetadata: Metadata = {
  robots: NOINDEX,
};

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  index?: boolean;
  image?: string | null;
  type?: "website" | "article";
};

export function buildMetadata({
  title,
  description,
  path,
  index = true,
  image,
  type = "website",
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image ? [{ url: image }] : undefined;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: index ? { index: true, follow: true } : NOINDEX,
    openGraph: {
      title,
      description,
      url,
      locale: "tr_TR",
      type,
      siteName: SITE.name,
      images: ogImage,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export async function legalPageMetadata(slug: string): Promise<Metadata> {
  const [page, settings] = await Promise.all([getPage(slug), getSettings()]);
  const path = PUBLIC_PAGE_PATH[slug] ?? `/${slug}`;
  const title = page?.seoTitle || page?.title || slug;
  const description =
    page?.seoDesc ||
    truncateText(page?.body || `${page?.title ?? slug} — ${settings.name}.`);
  return buildMetadata({ title, description, path });
}

export function organizationJsonLd(settings: {
  name: string;
  email: string;
  phoneDisplay: string;
  address: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.name,
    url: siteUrl(),
    logo: absoluteUrl("/brand/logo.png"),
    email: settings.email,
    telephone: settings.phoneDisplay,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressCountry: "TR",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function productJsonLd(input: {
  name: string;
  slug: string;
  description: string;
  sku: string;
  image?: string;
  price: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    sku: input.sku,
    description: truncateText(input.description, 300),
    image: input.image ? [input.image] : undefined,
    brand: { "@type": "Brand", name: SITE.name },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/urunler/${input.slug}`),
      priceCurrency: "TRY",
      price: input.price.toFixed(2),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
}

export function articleJsonLd(input: {
  title: string;
  excerpt: string;
  slug: string;
  datePublished: Date;
  dateModified: Date;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: truncateText(input.excerpt || input.title),
    datePublished: input.datePublished.toISOString(),
    dateModified: input.dateModified.toISOString(),
    mainEntityOfPage: absoluteUrl(`/blog/${input.slug}`),
    author: { "@type": "Organization", name: SITE.name },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: absoluteUrl("/brand/logo.png") },
    },
  };
}
