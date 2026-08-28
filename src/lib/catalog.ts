import { prisma } from "@/lib/db";
import type { MockProduct } from "@/lib/mock-catalog";

export type CatalogProduct = MockProduct & {
  imageUrls: string[];
};

function kurusToTry(kurus: number) {
  return kurus / 100;
}

export async function loadCatalog(): Promise<CatalogProduct[]> {
  const rows = await prisma.product.findMany({
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      colors: true,
      sizes: { orderBy: { sortOrder: "asc" } },
      tiers: { orderBy: { minQty: "asc" } },
      specs: true,
      tags: { include: { tag: true } },
    },
    orderBy: { name: "asc" },
  });

  return rows.map((p) => ({
    slug: p.slug,
    name: p.name,
    sku: p.sku,
    category: p.category.slug,
    description: p.description,
    tags: p.tags.map((t) => t.tag.name),
    wholesale: p.wholesale,
    isNew: p.isNew,
    colors: p.colors.map((c) => ({ id: c.slug, label: c.label, hex: c.hex })),
    sizes: p.sizes.map((s) => s.label),
    angles: p.images.map((i) => i.label),
    imageUrls: p.images.map((i) => i.url).filter((u): u is string => Boolean(u)),
    tiers: p.tiers.map((t) => ({
      minQty: t.minQty,
      maxQty: t.maxQty,
      unitPrice: kurusToTry(t.unitPrice),
    })),
    specs: p.specs.map((s) => ({ label: s.label, value: s.value })),
  }));
}

export async function loadCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function loadProduct(slug: string) {
  const all = await loadCatalog();
  return all.find((p) => p.slug === slug) ?? null;
}
