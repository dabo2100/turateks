import Link from "next/link";

import { catalogHref, type CatalogQuery } from "@/lib/catalog-query";
import { cn } from "@/lib/utils";

export function CatalogFilters({
  query,
  categories,
  tags,
}: {
  query: CatalogQuery;
  categories: { slug: string; name: string }[];
  tags: string[];
}) {

  return (
    <aside className="space-y-8">
      <div>
        <h2 className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Kategori
        </h2>
        <ul className="space-y-1 text-sm">
          <li>
            <Link
              href={catalogHref({ ...query, kategori: undefined, sayfa: undefined })}
              className={cn(
                "block rounded-md px-2 py-1.5",
                !query.kategori ? "bg-primary/10 font-medium text-primary" : "hover:bg-muted",
              )}
            >
              Tümü
            </Link>
          </li>
          {categories.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={catalogHref({ ...query, kategori: cat.slug, sayfa: undefined })}
                className={cn(
                  "block rounded-md px-2 py-1.5",
                  query.kategori === cat.slug
                    ? "bg-primary/10 font-medium text-primary"
                    : "hover:bg-muted",
                )}
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {tags.length > 0 ? (
        <div>
          <h2 className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Özellikler
          </h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const active = query.etiket === tag;
              return (
                <Link
                  key={tag}
                  href={catalogHref({
                    ...query,
                    etiket: active ? undefined : tag,
                    sayfa: undefined,
                  })}
                  className={cn(
                    "rounded-md border px-2 py-1 text-xs",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-primary",
                  )}
                >
                  {tag}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </aside>
  );
}
