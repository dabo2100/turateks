import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { paytrCallbackValid } from "@/lib/paytr";

export async function POST(req: Request) {
  const form = await req.formData();
  const merchantOid = String(form.get("merchant_oid") ?? "");
  const status = String(form.get("status") ?? "");
  const totalAmount = String(form.get("total_amount") ?? "");
  const hash = String(form.get("hash") ?? "");

  if (!paytrCallbackValid({ merchantOid, status, totalAmount, hash })) {
    return new NextResponse("PAYTR notification failed: bad hash", { status: 400 });
  }

  const order = await prisma.order.findUnique({ where: { merchantOid } });
  if (!order) {
    return new NextResponse("PAYTR notification failed: order", { status: 404 });
  }

  if (status === "success") {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "paid" },
    });
  } else {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "failed" },
    });
  }

  return new NextResponse("OK");
}
