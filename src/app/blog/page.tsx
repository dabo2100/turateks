import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Calendar, Clock } from "lucide-react";

import { JsonLd } from "@/components/seo/json-ld";
import { prisma } from "@/lib/db";
import { BLOG_POSTS, type BlogPost } from "@/lib/blog-data";
import { absoluteUrl, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Yağmurluk Rehberi & Sektörel Blog | Turateks İmalat",
    description:
      "Toptan yağmurluk alımı, balıkçı ve motokurye yağmurluk standartları, PVC ve PU kumaş karşılaştırmaları ve teknik rehberler. Turateks uzman blog yazıları.",
    path: "/blog",
  }),
  keywords: [
    "yağmurluk rehberi",
    "toptan yağmurluk alımı",
    "balıkçı yağmurluğu seçimi",
    "motokurye yağmurluk takımı",
    "su sütunu nedir",
    "pvc yağmurluk kumaşı",
    "kurumsal yağmurluk imalatı bursa",
    "şantiye yağmurluğu en 343",
  ],
};

export default async function BlogIndexPage() {
  const dbPosts = await prisma.post
    .findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    })
    .catch(() => null);

  const posts: (BlogPost | {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    tag: string;
    minutes: number;
    image?: string;
    createdAt: string | Date;
  })[] = dbPosts && dbPosts.length > 0
    ? dbPosts.map((p) => {
        const meta = BLOG_POSTS.find((bp) => bp.slug === p.slug);
        return {
          id: p.id,
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt,
          tag: meta?.tag ?? "Rehber",
          minutes: meta?.minutes ?? 5,
          image: meta?.image,
          createdAt: p.createdAt,
        };
      })
    : BLOG_POSTS;

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Anasayfa", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-[#111315] text-white pt-28 pb-16 sm:pt-36 sm:pb-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{
            background:
              "radial-gradient(circle at 50% 15%, rgba(245, 130, 32, 0.22) 0%, transparent 60%), radial-gradient(circle at 85% 30%, rgba(166, 94, 46, 0.15) 0%, transparent 50%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative mx-auto max-w-5xl px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-1.5 text-xs font-bold tracking-wider text-primary uppercase shadow-xs backdrop-blur-xs">
            <BookOpen className="size-3.5 text-primary" />
            <span>Sektörel Rehberler & Bilgi Bankası</span>
          </div>

          <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl text-white">
            Yağmurluk ve Koruyucu İş Giysisi Rehberi
          </h1>

          <p className="mt-4 text-sm text-white/75 sm:text-base max-w-2xl mx-auto leading-relaxed">
            Toptan alım süreçleri, kumaş teknolojileri, balıkçı ve motokurye standartları hakkında 
            20 yıllık imalat tecrübemizle hazırladığımız teknik rehberler.
          </p>
        </div>
      </section>

      {/* Blog Cards Grid */}
      <main className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="flex items-center justify-between border-b border-border pb-4 mb-8">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-charcoal sm:text-2xl">
              Son Yayınlanan Makaleler
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Toplam {posts.length} uzman makalesi
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const dateStr = new Date(post.createdAt).toLocaleDateString("tr-TR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            });

            return (
              <article
                key={post.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-white shadow-xs transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <div>
                  {post.image ? (
                    <div className="relative aspect-video w-full overflow-hidden bg-muted">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  ) : null}

                  <div className="p-6 pb-0">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">
                        {post.tag}
                      </span>
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <Clock className="size-3" />
                        {post.minutes} dk okuma
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-charcoal group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      <Link href={`/blog/${post.slug}`} className="focus:outline-hidden">
                        {post.title}
                      </Link>
                    </h3>

                    <p className="mt-2.5 text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4 text-xs">
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="size-3" />
                      {dateStr}
                    </span>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 font-semibold text-primary group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Devamını Oku</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}
