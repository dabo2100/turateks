import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { adminPrimaryBtnClass, adminTableWrapClass, adminTdClass, adminThClass } from "@/lib/admin-ui";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function AdminBlogPage() {
  await requireAdmin();
  const posts = await prisma.post.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Blog"
        description="Duyuru ve içerik yazılarını yönetin."
        actions={
          <Link href="/admin/blog/yeni" className={adminPrimaryBtnClass}>
            Yeni yazı
          </Link>
        }
      />
      <div className={adminTableWrapClass}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className={adminThClass}>Başlık</th>
              <th className={adminThClass}>Durum</th>
              <th className={adminThClass} />
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td className={`${adminTdClass} text-muted-foreground`} colSpan={3}>
                  Henüz yazı yok.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="border-b border-border last:border-0">
                  <td className={`${adminTdClass} font-medium`}>{post.title}</td>
                  <td className={adminTdClass}>
                    <span
                      className={
                        post.published
                          ? "inline-flex rounded-full bg-[var(--admin-mint-soft,#e6f7ef)] px-2.5 py-1 text-xs font-semibold"
                          : "inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground"
                      }
                    >
                      {post.published ? "Yayında" : "Taslak"}
                    </span>
                  </td>
                  <td className={`${adminTdClass} text-right`}>
                    <Link href={`/admin/blog/${post.id}`} className="text-sm font-semibold hover:text-primary">
                      Düzenle
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
