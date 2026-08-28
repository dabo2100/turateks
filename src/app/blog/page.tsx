import type { Metadata } from "next";
import Link from "next/link";

import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description: "Yağmurluk kumaşları, toptan alım ve teknik rehberler.",
  path: "/blog",
});

export default async function BlogIndexPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Blog</h1>
      {posts.length === 0 ? (
        <p className="mt-6 text-muted-foreground">Henüz yayınlanmış yazı yok.</p>
      ) : (
        <ul className="mt-8 space-y-6">
          {posts.map((post) => (
            <li key={post.id} className="border-b border-border pb-6">
              <p className="text-xs text-muted-foreground">{post.createdAt.toLocaleDateString("tr-TR")}</p>
              <Link href={`/blog/${post.slug}`} className="mt-1 block text-xl font-semibold hover:text-primary">
                {post.title}
              </Link>
              <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
