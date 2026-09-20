import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { adminCardClass, adminPrimaryBtnClass, adminTableWrapClass, adminTdClass, adminThClass } from "@/lib/admin-ui";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatTry } from "@/lib/mock-catalog";
import { kurusToTry } from "@/lib/money";
import { ORDER_STATUS_LABEL } from "@/lib/order-labels";
import { cn } from "@/lib/utils";

export default async function AdminHomePage() {
  await requireAdmin();
  const [productCount, orderCount, pageCount, postCount, categoryCount, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.page.count(),
    prisma.post.count(),
    prisma.category.count(),
    prisma.order.findMany({ take: 8, orderBy: { createdAt: "desc" } }),
  ]);

  const cards = [
    { href: "/admin/urunler", label: "Ürünler", value: productCount },
    { href: "/admin/siparisler", label: "Siparişler", value: orderCount },
    { href: "/admin/kategoriler", label: "Kategoriler", value: categoryCount },
    { href: "/admin/sayfalar", label: "Sayfalar", value: pageCount },
    { href: "/admin/blog", label: "Yazılar", value: postCount },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Özet"
        description="Mağaza durumuna hızlı bakış."
        actions={
          <Link href="/admin/urunler/yeni" className={adminPrimaryBtnClass}>
            Yeni ürün
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className={cn(adminCardClass, "transition hover:bg-[var(--admin-mint-soft,#e6f7ef)]")}>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{card.label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight">{card.value}</p>
          </Link>
        ))}
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Son siparişler</h2>
          <Link href="/admin/siparisler" className="text-sm font-medium text-foreground/70 hover:text-foreground">
            Tümü
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className={cn(adminCardClass, "text-sm text-muted-foreground")}>Sipariş yok.</div>
        ) : (
          <div className={adminTableWrapClass}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className={adminThClass}>Sipariş</th>
                  <th className={adminThClass}>Durum</th>
                  <th className={adminThClass}>Tutar</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0">
                    <td className={adminTdClass}>
                      <Link href={`/admin/siparisler/${order.id}`} className="font-medium hover:text-primary">
                        {order.merchantOid}
                      </Link>
                    </td>
                    <td className={`${adminTdClass} text-muted-foreground`}>{ORDER_STATUS_LABEL[order.status]}</td>
                    <td className={adminTdClass}>{formatTry(kurusToTry(order.total))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
