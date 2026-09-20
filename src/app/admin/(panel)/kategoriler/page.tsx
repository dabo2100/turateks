import { AdminCard } from "@/components/admin/admin-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CategoryCreateForm, CategoryRowActions } from "@/components/admin/category-forms";
import { adminTableWrapClass, adminTdClass, adminThClass } from "@/lib/admin-ui";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Kategoriler"
        description="Ürünleri mağaza kategorilerine ayırın. Toptan/perakende ayrımı ürün formundaki satış tipinden gelir."
      />

      <AdminCard title="Yeni kategori">
        <CategoryCreateForm />
      </AdminCard>

      <div className={adminTableWrapClass}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className={adminThClass}>Kategori</th>
              <th className={adminThClass}>Slug</th>
              <th className={adminThClass}>Ürün</th>
              <th className={adminThClass} />
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td className={`${adminTdClass} text-muted-foreground`} colSpan={4}>
                  Henüz kategori yok.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id} className="border-b border-border last:border-0">
                  <td className={`${adminTdClass} font-medium`}>{category.name}</td>
                  <td className={`${adminTdClass} text-muted-foreground`}>/{category.slug}</td>
                  <td className={adminTdClass}>{category._count.products}</td>
                  <td className={adminTdClass}>
                    <CategoryRowActions
                      id={category.id}
                      name={category.name}
                      slug={category.slug}
                      productCount={category._count.products}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
