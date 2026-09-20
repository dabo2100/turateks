import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PostForm } from "@/components/admin/post-form";
import { requireAdmin } from "@/lib/auth";

export default async function NewPostPage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      <AdminPageHeader title="Yeni yazı" />
      <PostForm />
    </div>
  );
}
