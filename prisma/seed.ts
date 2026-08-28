import { PrismaClient } from "@prisma/client";

import { CATEGORIES, MOCK_PRODUCTS } from "../src/lib/mock-catalog";

const prisma = new PrismaClient();

function tryToKurus(tryAmount: number) {
  return Math.round(tryAmount * 100);
}

async function main() {
  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.label },
      create: { slug: cat.slug, name: cat.label },
    });
  }

  for (const product of MOCK_PRODUCTS) {
    const category = await prisma.category.findUniqueOrThrow({
      where: { slug: product.category },
    });

    const tagIds: string[] = [];
    for (const name of product.tags) {
      const tag = await prisma.tag.upsert({
        where: { name },
        update: {},
        create: { name },
      });
      tagIds.push(tag.id);
    }

    const saved = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        sku: product.sku,
        description: product.description,
        wholesale: product.wholesale,
        isNew: product.isNew,
        categoryId: category.id,
      },
      create: {
        slug: product.slug,
        name: product.name,
        sku: product.sku,
        description: product.description,
        wholesale: product.wholesale,
        isNew: product.isNew,
        categoryId: category.id,
      },
    });

    await prisma.productImage.deleteMany({ where: { productId: saved.id } });
    await prisma.productColor.deleteMany({ where: { productId: saved.id } });
    await prisma.productSize.deleteMany({ where: { productId: saved.id } });
    await prisma.priceTier.deleteMany({ where: { productId: saved.id } });
    await prisma.productSpec.deleteMany({ where: { productId: saved.id } });
    await prisma.productTag.deleteMany({ where: { productId: saved.id } });

    await prisma.productImage.createMany({
      data: product.angles.map((label, sortOrder) => ({
        productId: saved.id,
        label,
        sortOrder,
      })),
    });

    await prisma.productColor.createMany({
      data: product.colors.map((c) => ({
        productId: saved.id,
        slug: c.id,
        label: c.label,
        hex: c.hex,
      })),
    });

    await prisma.productSize.createMany({
      data: product.sizes.map((label, sortOrder) => ({
        productId: saved.id,
        label,
        sortOrder,
      })),
    });

    await prisma.priceTier.createMany({
      data: product.tiers.map((t) => ({
        productId: saved.id,
        minQty: t.minQty,
        maxQty: t.maxQty,
        unitPrice: tryToKurus(t.unitPrice),
      })),
    });

    await prisma.productSpec.createMany({
      data: product.specs.map((s) => ({
        productId: saved.id,
        label: s.label,
        value: s.value,
      })),
    });

    await prisma.productTag.createMany({
      data: tagIds.map((tagId) => ({ productId: saved.id, tagId })),
    });
  }

  console.log(`Seeded ${MOCK_PRODUCTS.length} products into turkey DB.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
