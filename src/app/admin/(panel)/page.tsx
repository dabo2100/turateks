import Link from "next/link";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatTry } from "@/lib/mock-catalog";
import { kurusToTry } from "@/lib/money";
import { ORDER_STATUS_LABEL } from "@/lib/order-labels";

export default async function AdminHomePage() {
  await requireAdmin();
  const [productCount, orderCount, pageCount, postCount, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.page.count(),
    prisma.post.count(),
    prisma.order.findMany({ take: 8, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Yönetim</h1>
        <p className="text-sm text-muted-foreground">Ürün, sipariş, sayfa ve ayarlar.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {[
          { href: "/admin/urunler", label: "Ürünler", value: productCount },
          { href: "/admin/siparisler", label: "Siparişler", value: orderCount },
          { href: "/admin/sayfalar", label: "Sayfalar", value: pageCount },
          { href: "/admin/blog", label: "Yazılar", value: postCount },
        ].map((card) => (
          <Link key={card.href} href={card.href} className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs text-muted-foreground">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold">{card.value}</p>
          </Link>
        ))}
      </div>
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Son siparişler</h2>
          <Link href="/admin/siparisler" className="text-sm text-primary">
            Tümü
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sipariş yok.</p>
        ) : (
          <ul className="divide-y rounded-xl border border-border bg-background">
            {recentOrders.map((order) => (
              <li key={order.id} className="flex flex-col gap-1 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                <Link href={`/admin/siparisler/${order.id}`} className="hover:text-primary">
                  {order.merchantOid}
                </Link>
                <span className="text-muted-foreground">{ORDER_STATUS_LABEL[order.status]}</span>
                <span>{formatTry(kurusToTry(order.total))}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
