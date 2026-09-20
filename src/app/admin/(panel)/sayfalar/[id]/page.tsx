import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PageForm } from "@/components/admin/page-form";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function AdminPageEditPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const page = await prisma.page.findUnique({ where: { id } });
  if (!page) notFound();

  return (
    <div className="space-y-6">
      <AdminPageHeader title={page.title} description={`/${page.slug}`} />
      <PageForm
        id={page.id}
        title={page.title}
        body={page.body}
        seoTitle={page.seoTitle}
        seoDesc={page.seoDesc}
      />
    </div>
  );
}
