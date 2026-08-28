import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { ensureSuperAdmin, getAdminSessionUser } from "@/lib/auth";

export default async function AdminLoginPage() {
  await ensureSuperAdmin();
  const user = await getAdminSessionUser();
  if (user) redirect("/admin");

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-16">
      <h1 className="mb-2 text-center text-2xl font-semibold">Yönetim girişi</h1>
      <p className="mb-8 text-center text-sm text-muted-foreground">
        Yönetici paneli e-posta ve şifre ile açılır. Müşteri girişi /hesap sayfasındadır.
      </p>
      <AdminLoginForm />
    </div>
  );
}
