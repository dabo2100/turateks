import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
  Tag,
} from "lucide-react";

import { JsonLd } from "@/components/seo/json-ld";
import { prisma } from "@/lib/db";
import { BLOG_POSTS, getBlogPost } from "@/lib/blog-data";
import { formatTry, getProduct, productFromPrice } from "@/lib/mock-catalog";
import { articleJsonLd, breadcrumbJsonLd, buildMetadata, truncateText, absoluteUrl } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dbPost = await prisma.post.findUnique({ where: { slug } }).catch(() => null);
  const fallback = getBlogPost(slug);

  const title = dbPost?.title ?? fallback?.title;
  const description = truncateText(dbPost?.excerpt || fallback?.excerpt || "");
  const keywords = fallback?.keywords ?? ["yağmurluk", "toptan yağmurluk", "turateks"];
  const image = fallback?.image || "/brand/hero/hero-factory.png";
  const absoluteImageUrl = absoluteUrl(image);
  const canonicalUrl = absoluteUrl(`/blog/${slug}`);

  if (!title) return {};

  return {
    ...buildMetadata({
      title: `${title} | Turateks Yağmurluk Rehberi`,
      description,
      path: `/blog/${slug}`,
      type: "article",
    }),
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | Turateks`,
      description,
      url: canonicalUrl,
      type: "article",
      locale: "tr_TR",
      siteName: "Turateks Yağmurluk",
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

// Lightweight Markdown Formatter
function MarkdownContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let tableRows: string[][] = [];
  let inTable = false;

  const flushList = (key: string) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key} className="my-4 space-y-2 pl-2">
          {listItems.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm sm:text-base text-foreground/90 leading-relaxed">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
              <span dangerouslySetInnerHTML={{ __html: parseBold(item) }} />
            </li>
          ))}
        </ul>,
      );
      listItems = [];
    }
  };

  const flushTable = (key: string) => {
    if (tableRows.length > 0) {
      const [headerRow, , ...bodyRows] = tableRows;
      elements.push(
        <div key={key} className="my-6 overflow-x-auto rounded-xl border border-border bg-white shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm">
            {headerRow && (
              <thead className="bg-[#f8f9fa] border-b border-border text-charcoal font-bold">
                <tr>
                  {headerRow.map((cell, idx) => (
                    <th key={idx} className="px-4 py-3">
                      {cell.trim()}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody className="divide-y divide-border/60">
              {bodyRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-[#fcfcfc]">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-4 py-3 text-muted-foreground" dangerouslySetInnerHTML={{ __html: parseBold(cell.trim()) }} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      tableRows = [];
      inTable = false;
    }
  };

  const parseBold = (text: string) => {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-charcoal">$1</strong>');
  };

  // Extract H2 headings for Table of Contents
  const tocHeadings: { id: string; text: string }[] = [];
  lines.forEach((l) => {
    const trimmed = l.trim();
    if (trimmed.startsWith("## ")) {
      const text = trimmed.slice(3).trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9ğüşıöç]+/g, "-")
        .replace(/^-|-$/g, "");
      tocHeadings.push({ id, text });
    }
  });

  if (tocHeadings.length >= 2) {
    elements.push(
      <nav
        key="toc"
        aria-label="İçindekiler"
        className="mb-8 rounded-2xl border border-primary/20 bg-primary/5 p-5 text-sm"
      >
        <div className="flex items-center gap-2 font-bold text-charcoal mb-3">
          <span className="size-2 rounded-full bg-primary" />
          <span>Bu Makalede Neler Var? (İçindekiler)</span>
        </div>
        <ol className="space-y-2 pl-4 list-decimal text-muted-foreground text-xs sm:text-sm">
          {tocHeadings.map((h, i) => (
            <li key={i}>
              <a
                href={`#${h.id}`}
                className="hover:text-primary hover:underline transition-colors font-medium text-charcoal/90"
              >
                {h.text}
              </a>
            </li>
          ))}
        </ol>
      </nav>,
    );
  }

  lines.forEach((rawLine, idx) => {
    const line = rawLine.trim();

    if (line.startsWith("|")) {
      flushList(`list-${idx}`);
      inTable = true;
      const cols = line
        .split("|")
        .filter((_, i, arr) => i > 0 && i < arr.length - 1);
      tableRows.push(cols);
      return;
    } else if (inTable) {
      flushTable(`table-${idx}`);
    }

    if (line.startsWith("- ") || line.startsWith("* ")) {
      listItems.push(line.slice(2));
      return;
    } else {
      flushList(`list-${idx}`);
    }

    if (line.startsWith("## ")) {
      const headingText = line.slice(3).trim();
      const headingId = headingText
        .toLowerCase()
        .replace(/[^a-z0-9ğüşıöç]+/g, "-")
        .replace(/^-|-$/g, "");

      elements.push(
        <h2
          key={idx}
          id={headingId}
          className="mt-10 mb-4 text-xl sm:text-2xl font-black text-charcoal tracking-tight border-b border-border/70 pb-2.5 scroll-mt-24"
        >
          {headingText}
        </h2>,
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={idx} className="mt-7 mb-3 text-lg sm:text-xl font-bold text-charcoal">
          {line.slice(4)}
        </h3>,
      );
    } else if (line.startsWith("> ")) {
      elements.push(
        <blockquote key={idx} className="my-6 rounded-2xl border-l-4 border-primary bg-primary/5 p-4 sm:p-5 text-sm sm:text-base font-medium text-charcoal leading-relaxed">
          <div dangerouslySetInnerHTML={{ __html: parseBold(line.slice(2)) }} />
        </blockquote>,
      );
    } else if (line === "---") {
      elements.push(<hr key={idx} className="my-8 border-border" />);
    } else if (line.length > 0) {
      elements.push(
        <p key={idx} className="my-3.5 text-sm sm:text-base text-foreground/85 leading-relaxed" dangerouslySetInnerHTML={{ __html: parseBold(line) }} />,
      );
    }
  });

  flushList("list-final");
  if (inTable) flushTable("table-final");

  return <div className="prose-content">{elements}</div>;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const dbPost = await prisma.post.findUnique({ where: { slug } }).catch(() => null);
  const fallback = getBlogPost(slug);

  if (!dbPost && !fallback) notFound();

  const title = dbPost?.title ?? fallback?.title ?? "";
  const excerpt = dbPost?.excerpt ?? fallback?.excerpt ?? "";
  const body = dbPost?.body || fallback?.body || "";
  const tag = fallback?.tag ?? "Teknik Rehber";
  const minutes = fallback?.minutes ?? 5;
  const createdAt = dbPost?.createdAt ?? fallback?.createdAt ?? new Date();
  const updatedAt = dbPost?.updatedAt ?? fallback?.updatedAt ?? new Date();
  const relatedProduct = fallback?.relatedProductSlug ? getProduct(fallback.relatedProductSlug) : null;

  const dateStr = new Date(createdAt).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-24">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Anasayfa", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: title, path: `/blog/${slug}` },
        ])}
      />
      <JsonLd
        data={articleJsonLd({
          title,
          excerpt,
          slug,
          image: fallback?.image,
          keywords: fallback?.keywords,
          datePublished: new Date(createdAt),
          dateModified: new Date(updatedAt),
        })}
      />

      {/* Header Banner */}
      <section className="relative overflow-hidden bg-[#111315] text-white pt-28 pb-14 sm:pt-36 sm:pb-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(circle at 50% 10%, rgba(245, 130, 32, 0.2) 0%, transparent 60%)",
          }}
        />

        <div className="relative mx-auto max-w-4xl px-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="size-3.5" />
            <span>Tüm Makalelere Dön</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 border border-primary/30 px-3 py-1 font-semibold text-primary">
              <Tag className="size-3" />
              {tag}
            </span>
            <span className="inline-flex items-center gap-1 text-white/70">
              <Clock className="size-3" />
              {minutes} dk okuma
            </span>
            <span className="inline-flex items-center gap-1 text-white/70">
              <Calendar className="size-3" />
              {dateStr}
            </span>
          </div>

          <h1 className="mt-4 text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl text-white leading-tight">
            {title}
          </h1>

          <p className="mt-4 text-sm sm:text-base text-white/75 leading-relaxed border-l-2 border-primary pl-4 italic">
            {excerpt}
          </p>
        </div>
      </section>

      {/* Article Content & Sidebar */}
      <main className="mx-auto max-w-4xl px-4 pt-10 sm:pt-14">
        <article className="overflow-hidden rounded-3xl border border-border/80 bg-white shadow-sm">
          {fallback?.image && (
            <div className="relative aspect-video sm:aspect-21/9 w-full overflow-hidden bg-muted">
              <img
                src={fallback.image}
                alt={title}
                className="size-full object-cover"
              />
            </div>
          )}
          <div className="p-6 sm:p-10 lg:p-12">
            <MarkdownContent content={body} />

          {/* Related Product Spotlight (Internal Linking for SEO & Conversion) */}
          {relatedProduct && (
            <div className="mt-12 rounded-2xl border-2 border-primary/20 bg-primary/5 p-6 sm:p-8">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <ShieldCheck className="size-4" />
                <span>Önerilen Ürün & Fabrika Fiyatı</span>
              </div>

              <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h4 className="text-xl font-black text-charcoal">{relatedProduct.name}</h4>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-lg">
                    {relatedProduct.description}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-charcoal">
                    <span className="rounded-md bg-white border border-border px-2.5 py-1 font-semibold">
                      Su Sütunu: {relatedProduct.specs.find((s) => s.label.toLowerCase().includes("su"))?.value ?? "10.000 mm+"}
                    </span>
                    <span className="rounded-md bg-white border border-border px-2.5 py-1 font-semibold">
                      Kumaş: {relatedProduct.specs.find((s) => s.label.toLowerCase().includes("kumaş"))?.value ?? "PVC Kaplama"}
                    </span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-end justify-between sm:justify-center shrink-0 pt-2 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <span className="text-xs text-muted-foreground">Başlayan toptan fiyat</span>
                    <p className="text-2xl font-black text-primary">
                      {formatTry(productFromPrice(relatedProduct))}
                    </p>
                  </div>

                  <Link
                    href={`/urunler/${relatedProduct.slug}`}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm px-5 py-2.5 shadow-md shadow-primary/20 transition-transform hover:scale-105"
                  >
                    <span>Ürünü İncele</span>
                    <ExternalLink className="size-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Bottom CTA Box for Wholesale Orders */}
          <div className="mt-10 rounded-2xl bg-[#111315] p-6 sm:p-8 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-primary uppercase tracking-wider">
                <CheckCircle2 className="size-3.5" />
                <span>Kurumsal İmalat & Toptan Sipariş</span>
              </span>
              <h4 className="mt-1 text-lg sm:text-xl font-black text-white">
                Firmanız İçin Özel Fiyat Teklifi Alın
              </h4>
              <p className="mt-1 text-xs sm:text-sm text-white/70 max-w-md">
                Kademeli toptan indirimler, özel logo baskısı ve numune talepleriniz için uzman ekibimizle görüşün.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/iletisim"
                className="inline-flex items-center gap-2 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm px-6 py-3 shadow-md shadow-primary/30 transition-transform hover:scale-105 cursor-pointer"
              >
                <PhoneCall className="size-3.5" />
                <span>Teklif İste</span>
              </Link>

              <Link
                href="/iletisim"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs sm:text-sm px-5 py-3 transition-colors cursor-pointer"
              >
                <MessageCircle className="size-3.5 text-[#25D366]" />
                <span>İletişime Geç</span>
              </Link>
            </div>
          </div>
        </div>
      </article>
      </main>
    </div>
  );
}
