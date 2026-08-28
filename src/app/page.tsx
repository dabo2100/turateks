import type { Metadata } from "next";

import { HomeLanding } from "@/components/home/home-landing";
import { loadCatalog } from "@/lib/catalog";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Profesyonel Yağmurluk Üreticisi",
  description:
    "Türkiye'de üretilen profesyonel yağmurluk ve koruyucu giysi. Balıkçı, kurye, inşaat ve denizci modelleri. Toptan ve perakende.",
  path: "/",
});

export default async function HomePage() {
  const [catalog, posts] = await Promise.all([
    loadCatalog(),
    prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { slug: true, title: true, createdAt: true },
    }),
  ]);

  return (
    <HomeLanding
      catalog={catalog}
      posts={posts.map((post) => ({
        slug: post.slug,
        title: post.title,
        createdAt: post.createdAt.toISOString(),
      }))}
    />
  );
}
