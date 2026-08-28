"use server";

import type { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ADMIN_ORDER_STATUSES } from "@/lib/order-labels";

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  await requireAdmin();
  if (!ADMIN_ORDER_STATUSES.includes(status)) {
    return { error: "Geçersiz durum" };
  }
  await prisma.order.update({ where: { id: orderId }, data: { status } });
  revalidatePath("/admin/siparisler");
  revalidatePath(`/admin/siparisler/${orderId}`);
  revalidatePath("/hesap");
}
