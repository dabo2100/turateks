import type { Metadata } from "next";

import { CheckoutForm } from "@/components/cart/checkout-form";
import { getSessionUser } from "@/lib/auth";
import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = noIndexMetadata;

export default async function OdemePage() {
  const user = await getSessionUser();
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight">Ödeme</h1>
      <CheckoutForm
        defaults={
          user
            ? {
                name: user.name ?? "",
                email: user.email,
                phone: user.phone ?? "",
                city: user.city ?? "",
                district: user.district ?? "",
                address: user.address ?? "",
                company: user.company ?? "",
                taxId: user.taxId ?? "",
              }
            : undefined
        }
      />
    </div>
  );
}
