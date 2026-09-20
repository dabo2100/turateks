import { notFound } from "next/navigation";

import { AdminCard } from "@/components/admin/admin-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { OrderStatusForm } from "@/components/admin/order-status-form";
import { adminTableWrapClass, adminTdClass, adminThClass } from "@/lib/admin-ui";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatTry } from "@/lib/mock-catalog";
import { kurusToTry } from "@/lib/money";
import { ORDER_STATUS_LABEL } from "@/lib/order-labels";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) notFound();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={order.name}
        description={`${order.merchantOid} · ${ORDER_STATUS_LABEL[order.status]}`}
      />

      <AdminCard title="Durum">
        <OrderStatusForm orderId={order.id} status={order.status} />
      </AdminCard>

      <AdminCard title="Teslimat">
        <div className="space-y-1 text-sm">
          <p>{order.email}</p>
          <p>{order.phone}</p>
          <p>
            {order.address}, {order.district} / {order.city}
          </p>
          {order.company ? <p>{order.company}</p> : null}
        </div>
      </AdminCard>

      <div className={adminTableWrapClass}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className={adminThClass}>Kalem</th>
              <th className={adminThClass}>Adet</th>
              <th className={adminThClass}>Tutar</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-border last:border-0">
                <td className={adminTdClass}>
                  {item.name}
                  <span className="block text-xs text-muted-foreground">
                    {item.sku}
                    {item.color ? ` · ${item.color}` : ""}
                    {item.size ? ` · ${item.size}` : ""}
                  </span>
                </td>
                <td className={adminTdClass}>{item.qty}</td>
                <td className={adminTdClass}>{formatTry(kurusToTry(item.unitPrice * item.qty))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-right text-lg font-semibold">Toplam {formatTry(kurusToTry(order.total))}</p>
    </div>
  );
}
