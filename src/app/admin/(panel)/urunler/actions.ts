"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { tryToKurus } from "@/lib/money";
import { slugify } from "@/lib/slug";

const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  slug: z.string().min(2),
  sku: z.string().min(1),
  description: z.string(),
  wholesale: z.boolean(),
  isNew: z.boolean(),
  categoryId: z.string().optional(),
  newCategoryName: z.string().optional(),
  tags: z.string(),
  images: z.array(z.object({ label: z.string(), url: z.string() })),
  colors: z.array(z.object({ slug: z.string(), label: z.string(), hex: z.string() })),
  sizes: z.array(z.object({ label: z.string() })),
  tiers: z
    .array(
      z.object({
        minQty: z.number().int().min(1),
        maxQty: z.number().int().nullable(),
        unitPriceTry: z.number().positive(),
      }),
    )
    .min(1),
  specs: z.array(z.object({ label: z.string(), value: z.string() })),
});

export type ProductInput = z.infer<typeof productSchema>;

async function resolveCategoryId(categoryId: string | undefined, newCategoryName: string | undefined) {
  if (newCategoryName?.trim()) {
    const slug = slugify(newCategoryName);
    const created = await prisma.category.upsert({
      where: { slug },
      update: { name: newCategoryName.trim() },
      create: { slug, name: newCategoryName.trim() },
    });
    return created.id;
  }
  if (categoryId) return categoryId;
  throw new Error("Kategori gerekli");
}

async function syncTags(productId: string, raw: string) {
  const names = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  await prisma.productTag.deleteMany({ where: { productId } });
  for (const name of names) {
    const tag = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    await prisma.productTag.create({ data: { productId, tagId: tag.id } });
  }
}

export async function saveProduct(input: ProductInput) {
  await requireAdmin();
  const data = productSchema.parse(input);
  const categoryId = await resolveCategoryId(data.categoryId, data.newCategoryName);

  const nested = {
    images: {
      create: data.images
        .filter((i) => i.url.trim())
        .map((i, sortOrder) => ({
          label: i.label.trim() || "Görsel",
          url: i.url.trim(),
          sortOrder,
        })),
    },
    colors: {
      create: data.colors
        .filter((c) => c.label.trim())
        .map((c) => ({
          slug: slugify(c.slug || c.label),
          label: c.label.trim(),
          hex: c.hex || "#333333",
        })),
    },
    sizes: {
      create: data.sizes
        .filter((s) => s.label.trim())
        .map((s, sortOrder) => ({ label: s.label.trim(), sortOrder })),
    },
    tiers: {
      create: data.tiers.map((t) => ({
        minQty: t.minQty,
        maxQty: t.maxQty,
        unitPrice: tryToKurus(t.unitPriceTry),
      })),
    },
    specs: {
      create: data.specs
        .filter((s) => s.label.trim())
        .map((s) => ({ label: s.label.trim(), value: s.value.trim() })),
    },
  };

  try {
    const saved = data.id
      ? await prisma.$transaction(async (tx) => {
          await tx.productImage.deleteMany({ where: { productId: data.id } });
          await tx.productColor.deleteMany({ where: { productId: data.id } });
          await tx.productSize.deleteMany({ where: { productId: data.id } });
          await tx.priceTier.deleteMany({ where: { productId: data.id } });
          await tx.productSpec.deleteMany({ where: { productId: data.id } });
          return tx.product.update({
            where: { id: data.id },
            data: {
              name: data.name,
              slug: slugify(data.slug),
              sku: data.sku.trim(),
              description: data.description,
              wholesale: data.wholesale,
              isNew: data.isNew,
              categoryId,
              ...nested,
            },
          });
        })
      : await prisma.product.create({
          data: {
            name: data.name,
            slug: slugify(data.slug),
            sku: data.sku.trim(),
            description: data.description,
            wholesale: data.wholesale,
            isNew: data.isNew,
            categoryId,
            ...nested,
          },
        });

    await syncTags(saved.id, data.tags);
    revalidatePath("/urunler");
    revalidatePath(`/urunler/${saved.slug}`);
    revalidatePath("/admin/urunler");
    redirect(`/admin/urunler/${saved.id}`);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "SKU veya slug zaten kullanılıyor." };
    }
    throw error;
  }
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return { error: "Ürün bulunamadı" };
  await prisma.product.delete({ where: { id } });
  revalidatePath("/urunler");
  revalidatePath("/admin/urunler");
  redirect("/admin/urunler");
}
