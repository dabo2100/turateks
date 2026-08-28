import Link from "next/link";

import { catalogHref, type CatalogQuery } from "@/lib/catalog-query";
import { cn } from "@/lib/utils";

export function CatalogPagination({
  query,
  page,
  pages,
}: {
  query: CatalogQuery;
  page: number;
  pages: number;
}) {
  if (pages <= 1) return null;

  return (
    <nav className="mt-10 flex justify-center gap-2" aria-label="Sayfalar">
      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
        <Link
          key={n}
          href={catalogHref({ ...query, sayfa: String(n) })}
          className={cn(
            "inline-flex size-9 items-center justify-center rounded-md text-sm",
            n === page ? "bg-primary text-primary-foreground" : "border border-border hover:bg-muted",
          )}
        >
          {n}
        </Link>
      ))}
    </nav>
  );
}
