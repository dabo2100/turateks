import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-24">
      <p className="text-sm font-semibold text-primary">404</p>
      <h1 className="text-3xl font-semibold tracking-tight">Sayfa bulunamadı</h1>
      <p className="max-w-md text-muted-foreground">
        Aradığınız sayfa taşınmış veya hiç var olmamış olabilir. Kataloğa dönebilirsiniz.
      </p>
      <Link href="/urunler" className={cn(buttonVariants(), "h-10 px-4")}>
        Ürünlere git
      </Link>
    </div>
  );
}
