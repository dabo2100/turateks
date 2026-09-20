import { ProductForm } from "@/components/admin/product-form";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function NewProductPage() {
  await requireAdmin();
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return <ProductForm categories={categories} />;
}
