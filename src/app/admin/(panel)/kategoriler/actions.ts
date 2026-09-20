"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slug";

const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  slug: z.string().optional(),
});

export async function saveCategory(input: z.infer<typeof categorySchema>) {
  await requireAdmin();
  const data = categorySchema.parse(input);
  const slug = slugify(data.slug || data.name);

  try {
    if (data.id) {
      await prisma.category.update({
        where: { id: data.id },
        data: { name: data.name.trim(), slug },
      });
    } else {
      await prisma.category.create({
        data: { name: data.name.trim(), slug },
      });
    }
  } catch {
    return { error: "Kategori kaydedilemedi. Slug benzersiz olmalı." };
  }

  revalidatePath("/admin/kategoriler");
  revalidatePath("/admin/urunler");
  revalidatePath("/urunler");
  return { ok: true as const };
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) {
    return { error: `Bu kategoride ${count} ürün var. Önce ürünleri taşıyın.` };
  }
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/kategoriler");
  revalidatePath("/admin/urunler");
  return { ok: true as const };
}
