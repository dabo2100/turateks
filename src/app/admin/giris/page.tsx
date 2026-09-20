import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { ensureSuperAdmin, getAdminSessionUser } from "@/lib/auth";

export default async function AdminLoginPage() {
  await ensureSuperAdmin();
  const user = await getAdminSessionUser();
  if (user) redirect("/admin");

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-3xl bg-card p-8 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground">
            T
          </div>
          <h1 className="text-2xl font-semibold">Yönetim girişi</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Yönetici paneli e-posta ve şifre ile açılır. Müşteri girişi /hesap sayfasındadır.
          </p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  );
}
