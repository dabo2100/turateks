import type { Metadata } from "next";

import { HomeLanding } from "@/components/home/home-landing";
import { loadCatalog } from "@/lib/catalog";
import { prisma } from "@/lib/db";
import { ensureCategoryAssetsSynced } from "@/lib/category-sync";
import { ensureHeroAssetsSynced } from "@/lib/hero-sync";
import { BLOG_POSTS } from "@/lib/blog-data";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Profesyonel Yağmurluk Üreticisi",
  description:
    "Türkiye'de üretilen profesyonel yağmurluk ve koruyucu giysi. Balıkçı, kurye, inşaat ve denizci modelleri. Toptan ve perakende.",
  path: "/",
});

export default async function HomePage() {
  ensureHeroAssetsSynced();
  await ensureCategoryAssetsSynced();
  const [catalog, dbPosts] = await Promise.all([
    loadCatalog(),
    prisma.post
      .findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
      })
      .catch(() => null),
  ]);

  const posts =
    dbPosts && dbPosts.length > 0
      ? dbPosts.map((p) => {
          const meta = BLOG_POSTS.find((bp) => bp.slug === p.slug);
          return {
            slug: p.slug,
            title: p.title,
            excerpt: p.excerpt,
            tag: meta?.tag ?? "Rehber",
            minutes: meta?.minutes ?? 5,
            image: meta?.image ?? "/brand/hero/hero-factory.png",
            createdAt: p.createdAt.toISOString(),
          };
        })
      : BLOG_POSTS.map((bp) => ({
          slug: bp.slug,
          title: bp.title,
          excerpt: bp.excerpt,
          tag: bp.tag,
          minutes: bp.minutes,
          image: bp.image,
          createdAt: bp.createdAt,
        }));

  return (
    <HomeLanding
      catalog={catalog}
      posts={posts}
    />
  );
}
