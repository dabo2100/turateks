import { notFound } from "next/navigation";

import { OrderStatusForm } from "@/components/admin/order-status-form";
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
      <div>
        <p className="text-sm text-muted-foreground">{order.merchantOid}</p>
        <h1 className="text-2xl font-semibold">{order.name}</h1>
        <p className="text-sm text-muted-foreground">{ORDER_STATUS_LABEL[order.status]}</p>
      </div>
      <OrderStatusForm orderId={order.id} status={order.status} />
      <section className="rounded-xl border border-border bg-background p-4 text-sm">
        <p>{order.email}</p>
        <p>{order.phone}</p>
        <p>
          {order.address}, {order.district} / {order.city}
        </p>
        {order.company ? <p>{order.company}</p> : null}
      </section>
      <ul className="divide-y rounded-xl border border-border bg-background">
        {order.items.map((item) => (
          <li key={item.id} className="flex flex-col gap-1 px-4 py-3 text-sm sm:flex-row sm:justify-between">
            <span>
              {item.name} × {item.qty}
              <span className="block text-xs text-muted-foreground">
                {item.sku}
                {item.color ? ` · ${item.color}` : ""}
                {item.size ? ` · ${item.size}` : ""}
              </span>
            </span>
            <span>{formatTry(kurusToTry(item.unitPrice * item.qty))}</span>
          </li>
        ))}
      </ul>
      <p className="text-right text-lg font-semibold">Toplam {formatTry(kurusToTry(order.total))}</p>
    </div>
  );
}
