import Link from "next/link";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function AdminBlogPage() {
  await requireAdmin();
  const posts = await prisma.post.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Blog</h1>
        <Link href="/admin/blog/yeni" className="inline-flex h-10 w-fit items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground">
          Yeni yazı
        </Link>
      </div>
      <ul className="divide-y rounded-xl border border-border bg-background">
        {posts.length === 0 ? (
          <li className="px-4 py-6 text-sm text-muted-foreground">Henüz yazı yok.</li>
        ) : (
          posts.map((post) => (
            <li key={post.id} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{post.title}</p>
                <p className="text-xs text-muted-foreground">{post.published ? "Yayında" : "Taslak"}</p>
              </div>
              <Link href={`/admin/blog/${post.id}`} className="text-sm text-primary">
                Düzenle
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
