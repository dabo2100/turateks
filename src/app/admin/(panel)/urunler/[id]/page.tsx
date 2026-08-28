import { notFound } from "next/navigation";

import { ProductForm } from "@/components/admin/product-form";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { kurusToTry } from "@/lib/money";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        colors: true,
        sizes: { orderBy: { sortOrder: "asc" } },
        tiers: { orderBy: { minQty: "asc" } },
        specs: true,
        tags: { include: { tag: true } },
      },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{product.name}</h1>
      <ProductForm
        categories={categories}
        initial={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          sku: product.sku,
          description: product.description,
          wholesale: product.wholesale,
          isNew: product.isNew,
          categoryId: product.categoryId,
          tags: product.tags.map((t) => t.tag.name).join(", "),
          images: product.images.map((i) => ({ label: i.label, url: i.url ?? "" })),
          colors: product.colors.map((c) => ({ slug: c.slug, label: c.label, hex: c.hex })),
          sizes: product.sizes.map((s) => ({ label: s.label })),
          tiers: product.tiers.map((t) => ({
            minQty: t.minQty,
            maxQty: t.maxQty,
            unitPriceTry: kurusToTry(t.unitPrice),
          })),
          specs: product.specs.map((s) => ({ label: s.label, value: s.value })),
        }}
      />
    </div>
  );
}
