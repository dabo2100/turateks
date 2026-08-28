import Link from "next/link";

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
      <h1 className="text-2xl font-semibold">Siparişler</h1>
      <div className="overflow-x-auto rounded-xl border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Sipariş</th>
              <th className="px-4 py-3">Müşteri</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3">Tutar</th>
              <th className="px-4 py-3">Tarih</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-border">
                <td className="px-4 py-3">
                  <Link href={`/admin/siparisler/${order.id}`} className="font-medium hover:text-primary">
                    {order.merchantOid}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  {order.name}
                  <span className="block text-xs text-muted-foreground">{order.email}</span>
                </td>
                <td className="px-4 py-3">{ORDER_STATUS_LABEL[order.status]}</td>
                <td className="px-4 py-3">{formatTry(kurusToTry(order.total))}</td>
                <td className="px-4 py-3 text-muted-foreground">{order.createdAt.toLocaleDateString("tr-TR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
