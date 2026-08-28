import type { Metadata } from "next";

import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = noIndexMetadata;

type Props = {
  searchParams: Promise<{ oid?: string }>;
};

export default async function SuccessPage({ searchParams }: Props) {
  const { oid } = await searchParams;
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold">Teşekkürler</h1>
      <p className="mt-3 text-muted-foreground">
        Siparişiniz alındı{oid ? ` · ${oid}` : ""}.
      </p>
    </div>
  );
}
