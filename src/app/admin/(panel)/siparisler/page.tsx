import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { adminTableWrapClass, adminTdClass, adminThClass } from "@/lib/admin-ui";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatTry } from "@/lib/mock-catalog";
import { kurusToTry } from "@/lib/money";
import { ORDER_STATUS_LABEL } from "@/lib/order-labels";

export default async function AdminOrdersPage() {
  await requireAdmin();
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 100 });

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Siparişler" description="Son siparişleri görüntüleyin ve durumlarını yönetin." />
      <div className={adminTableWrapClass}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className={adminThClass}>Sipariş</th>
              <th className={adminThClass}>Müşteri</th>
              <th className={adminThClass}>Durum</th>
              <th className={adminThClass}>Tutar</th>
              <th className={adminThClass}>Tarih</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td className={`${adminTdClass} text-muted-foreground`} colSpan={5}>
                  Sipariş yok.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0">
                  <td className={adminTdClass}>
                    <Link href={`/admin/siparisler/${order.id}`} className="font-medium hover:text-primary">
                      {order.merchantOid}
                    </Link>
                  </td>
                  <td className={adminTdClass}>
                    {order.name}
                    <span className="block text-xs text-muted-foreground">{order.email}</span>
                  </td>
                  <td className={adminTdClass}>{ORDER_STATUS_LABEL[order.status]}</td>
                  <td className={adminTdClass}>{formatTry(kurusToTry(order.total))}</td>
                  <td className={`${adminTdClass} text-muted-foreground`}>{order.createdAt.toLocaleDateString("tr-TR")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
