import { prisma } from "@/lib/db";
import { CATEGORIES, MOCK_PRODUCTS, type MockProduct } from "@/lib/mock-catalog";

export type CatalogProduct = MockProduct & {
  imageUrls: string[];
};

function kurusToTry(kurus: number) {
  return kurus / 100;
}

export async function loadCatalog(): Promise<CatalogProduct[]> {
  try {
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

    if (rows.length > 0) {
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
  } catch {
    // Database connection failed, fallback to mock catalog
  }

  return MOCK_PRODUCTS.map((p) => ({
    ...p,
    imageUrls: p.imageUrls ?? [],
  }));
}

export async function loadCategories() {
  try {
    const rows = await prisma.category.findMany({ orderBy: { name: "asc" } });
    if (rows.length > 0) return rows;
  } catch {
    // fallback
  }
  return CATEGORIES.map((c) => ({
    id: c.slug,
    slug: c.slug,
    name: c.label,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
}

export async function loadProduct(slug: string) {
  const all = await loadCatalog();
  return all.find((p) => p.slug === slug) ?? null;
}
