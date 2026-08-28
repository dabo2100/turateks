import type { Metadata } from "next";

import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = noIndexMetadata;

type Props = {
  searchParams: Promise<{ token?: string }>;
};

export default async function PaytrIframePage({ searchParams }: Props) {
  const { token } = await searchParams;
  if (!token) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-semibold">Ödeme oturumu yok</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-semibold">Kart ile öde (PayTR)</h1>
      <iframe
        title="PayTR"
        src={`https://www.paytr.com/odeme/guvenli/${token}`}
        className="min-h-[720px] w-full rounded-xl border border-border"
      />
    </div>
  );
}
