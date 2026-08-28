"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slug";

const pageSchema = z.object({
  id: z.string(),
  title: z.string().min(2),
  body: z.string().min(1),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
});

const postSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2),
  slug: z.string().min(2),
  excerpt: z.string(),
  body: z.string().min(1),
  published: z.boolean(),
});

const PAGE_PATH: Record<string, string> = {
  hakkimizda: "/hakkimizda",
  iletisim: "/iletisim",
  kvkk: "/kvkk",
  "mesafeli-satis": "/mesafeli-satis",
  iade: "/iade",
  "on-bilgilendirme": "/on-bilgilendirme",
};

export async function savePage(input: z.infer<typeof pageSchema>) {
  await requireAdmin();
  const data = pageSchema.parse(input);
  const page = await prisma.page.update({
    where: { id: data.id },
    data: {
      title: data.title,
      body: data.body,
      seoTitle: data.seoTitle?.trim() || null,
      seoDesc: data.seoDesc?.trim() || null,
    },
  });
  revalidatePath("/admin/sayfalar");
  revalidatePath(PAGE_PATH[page.slug] ?? `/${page.slug}`);
}

export async function savePost(input: z.infer<typeof postSchema>) {
  await requireAdmin();
  const data = postSchema.parse(input);
  const saved = data.id
    ? await prisma.post.update({
        where: { id: data.id },
        data: {
          title: data.title,
          slug: slugify(data.slug),
          excerpt: data.excerpt,
          body: data.body,
          published: data.published,
        },
      })
    : await prisma.post.create({
        data: {
          title: data.title,
          slug: slugify(data.slug),
          excerpt: data.excerpt,
          body: data.body,
          published: data.published,
        },
      });
  revalidatePath("/blog");
  revalidatePath(`/blog/${saved.slug}`);
  revalidatePath("/admin/blog");
  redirect(`/admin/blog/${saved.id}`);
}

export async function deletePost(id: string) {
  await requireAdmin();
  await prisma.post.delete({ where: { id } });
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}
