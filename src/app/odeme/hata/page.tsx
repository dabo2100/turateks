import type { Metadata } from "next";

import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = noIndexMetadata;

export default function FailPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold">Ödeme tamamlanamadı</h1>
      <p className="mt-3 text-muted-foreground">Kart işlemi başarısız oldu. Sepetten tekrar deneyebilirsiniz.</p>
    </div>
  );
}
