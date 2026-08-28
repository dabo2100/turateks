"use client";

import type { OrderStatus } from "@prisma/client";
import { useTransition } from "react";
import { toast } from "sonner";

import { updateOrderStatus } from "@/app/admin/(panel)/siparisler/actions";
import { Button } from "@/components/ui/button";
import { fieldClass } from "@/lib/admin-ui";
import { ADMIN_ORDER_STATUSES, ORDER_STATUS_LABEL } from "@/lib/order-labels";

export function OrderStatusForm({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="flex flex-wrap items-end gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        const next = new FormData(e.currentTarget).get("status") as OrderStatus;
        startTransition(async () => {
          await updateOrderStatus(orderId, next);
          toast.success("Sipariş durumu güncellendi");
        });
      }}
    >
      <label className="text-sm">
        Durum
        <select name="status" defaultValue={status} className={fieldClass}>
          {ADMIN_ORDER_STATUSES.map((value) => (
            <option key={value} value={value}>
              {ORDER_STATUS_LABEL[value]}
            </option>
          ))}
        </select>
      </label>
      <Button type="submit" className="h-10 px-4" disabled={pending}>
        Güncelle
      </Button>
    </form>
  );
}
