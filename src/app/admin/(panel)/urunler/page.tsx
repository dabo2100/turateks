import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { adminPrimaryBtnClass, adminTableWrapClass, adminTdClass, adminThClass } from "@/lib/admin-ui";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatTry } from "@/lib/mock-catalog";
import { kurusToTry } from "@/lib/money";

export default async function AdminProductsPage() {
  await requireAdmin();
  const products = await prisma.product.findMany({
    include: { category: true, tiers: { orderBy: { minQty: "asc" }, take: 1 } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Ürünler"
        description="Kataloğu yönetin. Toptan ürünler /toptan sayfasında listelenir."
        actions={
          <Link href="/admin/urunler/yeni" className={adminPrimaryBtnClass}>
            Yeni ürün
          </Link>
        }
      />
      <div className={adminTableWrapClass}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className={adminThClass}>Ürün</th>
              <th className={adminThClass}>SKU</th>
              <th className={adminThClass}>Kategori</th>
              <th className={adminThClass}>Satış</th>
              <th className={adminThClass}>Başlangıç fiyatı</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td className={`${adminTdClass} text-muted-foreground`} colSpan={5}>
                  Henüz ürün yok.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className={adminTdClass}>
                    <Link href={`/admin/urunler/${p.id}`} className="font-medium hover:text-primary">
                      {p.name}
                    </Link>
                  </td>
                  <td className={`${adminTdClass} text-muted-foreground`}>{p.sku}</td>
                  <td className={adminTdClass}>{p.category.name}</td>
                  <td className={adminTdClass}>
                    <span
                      className={
                        p.wholesale
                          ? "inline-flex rounded-full bg-[var(--admin-mint-soft,#e6f7ef)] px-2.5 py-1 text-xs font-semibold"
                          : "inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground"
                      }
                    >
                      {p.wholesale ? "Toptan" : "Perakende"}
                    </span>
                  </td>
                  <td className={adminTdClass}>{p.tiers[0] ? formatTry(kurusToTry(p.tiers[0].unitPrice)) : "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
