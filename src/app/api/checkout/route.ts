import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { kurusToTry, tryToKurus } from "@/lib/money";
import { paytrConfigured, paytrIframeToken, paytrTestMode } from "@/lib/paytr";
import { resolveUnitPrice } from "@/lib/pricing";
import { readUserId } from "@/lib/session";
import { applyTax, getSettings } from "@/lib/settings";

type Body = {
  items: { slug: string; qty: number; color?: string; size?: string }[];
  customer: {
    name: string;
    email: string;
    phone: string;
    city: string;
    district: string;
    address: string;
    company?: string;
    taxId?: string;
  };
};

export async function POST(req: Request) {
  const body = (await req.json()) as Body;
  const c = body.customer;
  if (!body.items?.length) {
    return NextResponse.json({ error: "EMPTY_CART" }, { status: 400 });
  }
  if (!c?.name || !c.email || !c.phone || !c.city || !c.district || !c.address) {
    return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
  }

  const userId = readUserId(req.headers.get("cookie"));
  if (!userId) {
    return NextResponse.json({ error: "EMAIL_NOT_VERIFIED" }, { status: 401 });
  }
  const sessionUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!sessionUser || sessionUser.email !== c.email.trim().toLowerCase()) {
    return NextResponse.json({ error: "EMAIL_MISMATCH" }, { status: 401 });
  }

  const slugs = [...new Set(body.items.map((i) => i.slug))];
  const products = await prisma.product.findMany({
    where: { slug: { in: slugs } },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      tiers: { orderBy: { minQty: "asc" } },
    },
  });
  const bySlug = new Map(products.map((p) => [p.slug, p]));

  const lines = [];
  let total = 0;
  for (const item of body.items) {
    const product = bySlug.get(item.slug);
    if (!product) {
      return NextResponse.json({ error: "PRODUCT_NOT_FOUND", slug: item.slug }, { status: 400 });
    }
    const qty = Math.max(1, Math.floor(item.qty));
    const tiers = product.tiers.map((t) => ({
      minQty: t.minQty,
      maxQty: t.maxQty,
      unitPrice: t.unitPrice / 100,
    }));
    const unitTry = resolveUnitPrice(tiers, qty);
    const unitKurus = tryToKurus(unitTry);
    total += unitKurus * qty;
    lines.push({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      sku: product.sku,
      color: item.color ?? null,
      size: item.size ?? null,
      qty,
      unitPrice: unitKurus,
    });
  }

  const settings = await getSettings();
  const priced = applyTax(kurusToTry(total), settings);
  const grandTotal = tryToKurus(priced.total);

  const merchantOid = `TKS${Date.now()}${Math.floor(Math.random() * 900 + 100)}`;

  await prisma.user.update({
    where: { id: userId },
    data: {
      name: c.name,
      phone: c.phone,
      city: c.city,
      district: c.district,
      address: c.address,
      company: c.company || null,
      taxId: c.taxId || null,
    },
  });

  const order = await prisma.order.create({
    data: {
      merchantOid,
      userId,
      email: c.email.trim().toLowerCase(),
      name: c.name,
      phone: c.phone,
      city: c.city,
      district: c.district,
      address: c.address,
      company: c.company || null,
      taxId: c.taxId || null,
      subtotal: total,
      total: grandTotal,
      items: { create: lines },
    },
  });

  if (!paytrConfigured()) {
    return NextResponse.json({
      orderId: order.id,
      merchantOid,
      paytr: false,
    });
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const userIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
  const basket = Buffer.from(
    JSON.stringify(lines.map((l) => [l.name, (l.unitPrice / 100).toFixed(2), l.qty])),
  ).toString("base64");

  const token = paytrIframeToken({
    userIp,
    merchantOid,
    email: c.email,
    paymentAmount: grandTotal,
    userBasket: basket,
    noInstallment: 0,
    maxInstallment: 0,
    currency: "TL",
  });

  const form = new URLSearchParams({
    merchant_id: process.env.PAYTR_MERCHANT_ID!,
    user_ip: userIp,
    merchant_oid: merchantOid,
    email: c.email,
    payment_amount: String(grandTotal),
    paytr_token: token,
    user_basket: basket,
    debug_on: "1",
    no_installment: "0",
    max_installment: "0",
    user_name: c.name,
    user_address: `${c.address} ${c.district}/${c.city}`,
    user_phone: c.phone,
    merchant_ok_url: `${site}/odeme/basarili?oid=${merchantOid}`,
    merchant_fail_url: `${site}/odeme/hata?oid=${merchantOid}`,
    timeout_limit: "30",
    currency: "TL",
    test_mode: paytrTestMode(),
    lang: "tr",
  });

  const paytrRes = await fetch("https://www.paytr.com/odeme/api/get-token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form,
  });
  const payload = (await paytrRes.json()) as { status?: string; token?: string; reason?: string };

  if (payload.status !== "success" || !payload.token) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "failed" },
    });
    return NextResponse.json(
      { error: "PAYTR_TOKEN", message: payload.reason ?? "PayTR token alınamadı" },
      { status: 502 },
    );
  }

  return NextResponse.json({
    orderId: order.id,
    merchantOid,
    paytr: true,
    iframeToken: payload.token,
  });
}
