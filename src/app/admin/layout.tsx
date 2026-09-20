import type { Metadata } from "next";

import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = noIndexMetadata;

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-app flex min-h-0 flex-1 flex-col bg-[var(--admin-canvas,#f3f4f6)] text-foreground">{children}</div>;
}
