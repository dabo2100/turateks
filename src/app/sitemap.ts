import type { MetadataRoute } from "next";

import { BLOG_POSTS } from "@/lib/blog-data";
import { loadCatalog, loadCategories } from "@/lib/catalog";
import { prisma } from "@/lib/db";
import { PUBLIC_PAGE_PATH, absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, dbPosts] = await Promise.all([
    loadCatalog(),
    loadCategories(),
    prisma.post
      .findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      })
      .catch(() => null),
  ]);

  const posts = dbPosts && dbPosts.length > 0
    ? dbPosts
    : BLOG_POSTS.map((p) => ({
        slug: p.slug,
        updatedAt: new Date(p.updatedAt),
      }));

  const staticPaths = [
    "/",
    "/urunler",
    "/toptan",
    "/blog",
    ...Object.values(PUBLIC_PAGE_PATH),
  ];

  const now = new Date();

  return [
    ...staticPaths.map((path) => ({
      url: absoluteUrl(path),
      lastModified: now,
      changeFrequency: path === "/" ? ("daily" as const) : ("weekly" as const),
      priority: path === "/" ? 1 : 0.7,
    })),
    ...categories.map((category) => ({
      url: absoluteUrl(`/urunler?kategori=${category.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...products.map((product) => ({
      url: absoluteUrl(`/urunler/${product.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...posts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: post.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
