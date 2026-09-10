import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/seo/json-ld";
import { prisma } from "@/lib/db";
import { MOCK_POSTS } from "@/lib/mock-catalog";
import { articleJsonLd, breadcrumbJsonLd, buildMetadata, truncateText } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } }).catch(() => null);
  const fallback = !post ? MOCK_POSTS.find((p) => p.slug === slug) : null;
  const title = post?.title ?? fallback?.title;
  const description = truncateText(post?.excerpt || post?.body || fallback?.title || "");
  if (!title) return {};
  return buildMetadata({
    title,
    description,
    path: `/blog/${slug}`,
    type: "article",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } }).catch(() => null);
  const fallback = !post ? MOCK_POSTS.find((p) => p.slug === slug) : null;
  const currentPost = post ?? (fallback ? {
    id: fallback.slug,
    slug: fallback.slug,
    title: fallback.title,
    excerpt: `${fallback.tag} • ${fallback.minutes} dakika`,
    body: `${fallback.title} hakkında detaylı bilgi ve teknik rehber çok yakında yayında olacaktır.`,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  } : null);

  if (!currentPost || !currentPost.published) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Anasayfa", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: currentPost.title, path: `/blog/${currentPost.slug}` },
        ])}
      />
      <JsonLd
        data={articleJsonLd({
          title: currentPost.title,
          excerpt: currentPost.excerpt,
          slug: currentPost.slug,
          datePublished: currentPost.createdAt,
          dateModified: currentPost.updatedAt,
        })}
      />
      <p className="text-sm text-muted-foreground">{currentPost.createdAt.toLocaleDateString("tr-TR")}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{currentPost.title}</h1>
      <div className="mt-6 whitespace-pre-wrap text-sm leading-7">{currentPost.body}</div>
    </article>
  );
}
