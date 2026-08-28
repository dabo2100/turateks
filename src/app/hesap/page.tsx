import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";

import { AddressForm } from "@/components/auth/address-form";
import { LoginForm } from "@/components/auth/login-form";
import { LogoutButton } from "@/components/auth/logout-button";
import { prisma } from "@/lib/db";
import { formatTry } from "@/lib/mock-catalog";
import { kurusToTry } from "@/lib/money";
import { ORDER_STATUS_LABEL } from "@/lib/order-labels";
import { noIndexMetadata } from "@/lib/seo";
import { readUserId } from "@/lib/session";

export const metadata: Metadata = noIndexMetadata;

export default async function HesapPage() {
  const jar = await cookies();
  const cookieHeader = jar
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
  const userId = readUserId(cookieHeader);

  if (!userId) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <h1 className="mb-2 text-center text-3xl font-semibold">Giriş</h1>
        <p className="mb-8 text-center text-sm text-muted-foreground">
          Şifre yok. E-postanıza 4 haneli kod gelir.
        </p>
        <LoginForm />
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { orders: { orderBy: { createdAt: "desc" }, take: 20 } },
  });
  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Hesabım</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <LogoutButton />
      </div>
      <div className="grid gap-10 md:grid-cols-2">
        <section>
          <h2 className="mb-3 text-lg font-semibold">Teslimat adresi</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Bu adres ödeme formunu doldurur. Sipariş verdiğinizde de güncellenir.
          </p>
          <AddressForm
            initial={{
              name: user.name ?? "",
              phone: user.phone ?? "",
              city: user.city ?? "",
              district: user.district ?? "",
              address: user.address ?? "",
              company: user.company ?? "",
              taxId: user.taxId ?? "",
            }}
          />
        </section>
        <section>
          <h2 className="text-lg font-semibold">Siparişler</h2>
          {user.orders.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">Henüz sipariş yok.</p>
          ) : (
            <ul className="mt-4 divide-y rounded-xl border border-border">
              {user.orders.map((o) => (
                <li key={o.id} className="flex justify-between px-4 py-3 text-sm">
                  <span>
                    {o.merchantOid}
                    <span className="ml-2 text-muted-foreground">{ORDER_STATUS_LABEL[o.status]}</span>
                  </span>
                  <span>{formatTry(kurusToTry(o.total))}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
      <p className="mt-8 text-sm">
        <Link href="/urunler" className="text-primary">
          Alışverişe devam
        </Link>
      </p>
    </div>
  );
}
