import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { adminTableWrapClass, adminTdClass, adminThClass } from "@/lib/admin-ui";
import { requireAdmin } from "@/lib/auth";
import { ensureDefaultPages } from "@/lib/cms";
import { prisma } from "@/lib/db";

export default async function AdminPagesPage() {
  await requireAdmin();
  await ensureDefaultPages();
  const pages = await prisma.page.findMany({ orderBy: { title: "asc" } });

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Sayfalar" description="Yasal ve kurumsal içerik sayfalarını düzenleyin." />
      <div className={adminTableWrapClass}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className={adminThClass}>Sayfa</th>
              <th className={adminThClass}>Slug</th>
              <th className={adminThClass} />
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.id} className="border-b border-border last:border-0">
                <td className={`${adminTdClass} font-medium`}>{page.title}</td>
                <td className={`${adminTdClass} text-muted-foreground`}>/{page.slug}</td>
                <td className={`${adminTdClass} text-right`}>
                  <Link href={`/admin/sayfalar/${page.id}`} className="text-sm font-semibold hover:text-primary">
                    Düzenle
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
