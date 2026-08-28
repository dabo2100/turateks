import { notFound } from "next/navigation";

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
      <h1 className="text-2xl font-semibold">{post.title}</h1>
      <PostForm initial={post} />
    </div>
  );
}
