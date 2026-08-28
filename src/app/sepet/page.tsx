import type { Metadata } from "next";

import { CartView } from "@/components/cart/cart-view";
import { noIndexMetadata } from "@/lib/seo";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = noIndexMetadata;

export default async function SepetPage() {
  const settings = await getSettings();
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight">Sepet</h1>
      <CartView taxMode={settings.taxMode} taxPercent={settings.taxPercent} />
    </div>
  );
}
