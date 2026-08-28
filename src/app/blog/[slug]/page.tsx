import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/seo/json-ld";
import { prisma } from "@/lib/db";
import { articleJsonLd, breadcrumbJsonLd, buildMetadata, truncateText } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post || !post.published) return {};
  return buildMetadata({
    title: post.title,
    description: truncateText(post.excerpt || post.body),
    path: `/blog/${post.slug}`,
    type: "article",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post || !post.published) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Anasayfa", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />
      <JsonLd
        data={articleJsonLd({
          title: post.title,
          excerpt: post.excerpt,
          slug: post.slug,
          datePublished: post.createdAt,
          dateModified: post.updatedAt,
        })}
      />
      <p className="text-sm text-muted-foreground">{post.createdAt.toLocaleDateString("tr-TR")}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{post.title}</h1>
      <div className="mt-6 whitespace-pre-wrap text-sm leading-7">{post.body}</div>
    </article>
  );
}
