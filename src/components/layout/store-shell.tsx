"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { ScrollToTop } from "@/components/layout/scroll-to-top";
import { SiteHeader } from "@/components/layout/site-header";

export function StoreShell({
  children,
  footer,
  fab,
}: {
  children: ReactNode;
  footer: ReactNode;
  fab: ReactNode;
}) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) {
    return <div className="flex h-dvh flex-col overflow-hidden">{children}</div>;
  }
  return (
    <>
      <SiteHeader />
      <div className="h-16 shrink-0" aria-hidden="true" />
      <main className="flex-1 ">{children}</main>
      {footer}
      <ScrollToTop />
      {fab}
    </>
  );
}
