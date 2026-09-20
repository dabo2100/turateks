import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PostForm } from "@/components/admin/post-form";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();
  return (
    <div className="space-y-6">
      <AdminPageHeader title={post.title} description={post.published ? "Yayında" : "Taslak"} />
      <PostForm initial={post} />
    </div>
  );
}
