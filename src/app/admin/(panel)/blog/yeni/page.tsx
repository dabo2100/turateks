import { PostForm } from "@/components/admin/post-form";
import { requireAdmin } from "@/lib/auth";

export default async function NewPostPage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Yeni yazı</h1>
      <PostForm />
    </div>
  );
}
