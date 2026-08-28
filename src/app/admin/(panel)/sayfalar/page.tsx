import Link from "next/link";

import { requireAdmin } from "@/lib/auth";
import { ensureDefaultPages } from "@/lib/cms";
import { prisma } from "@/lib/db";

export default async function AdminPagesPage() {
  await requireAdmin();
  await ensureDefaultPages();
  const pages = await prisma.page.findMany({ orderBy: { title: "asc" } });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Sayfalar</h1>
      <ul className="divide-y rounded-xl border border-border bg-background">
        {pages.map((page) => (
          <li key={page.id} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">{page.title}</p>
              <p className="text-xs text-muted-foreground">/{page.slug}</p>
            </div>
            <Link href={`/admin/sayfalar/${page.id}`} className="text-sm text-primary">
              Düzenle
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
