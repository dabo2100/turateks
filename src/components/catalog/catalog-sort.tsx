"use client";

import { useRouter } from "next/navigation";

import { catalogHref, type CatalogQuery } from "@/lib/catalog-query";

export function CatalogSort({ query }: { query: CatalogQuery }) {
  const router = useRouter();

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">Sırala</span>
      <select
        className="h-9 rounded-md border border-border bg-background px-2"
        value={query.sira ?? "varsayilan"}
        onChange={(e) => {
          router.push(
            catalogHref({
              ...query,
              sira: e.target.value,
              sayfa: undefined,
            }),
          );
        }}
      >
        <option value="varsayilan">Varsayılan</option>
        <option value="fiyat-artan">Fiyat (artan)</option>
        <option value="fiyat-azalan">Fiyat (azalan)</option>
        <option value="isim">İsim (A–Z)</option>
      </select>
    </label>
  );
}
