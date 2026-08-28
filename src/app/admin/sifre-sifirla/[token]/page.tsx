import { ResetPasswordForm } from "@/components/admin/reset-password-form";

export default async function AdminResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-16">
      <h1 className="mb-2 text-center text-2xl font-semibold">Yeni şifre</h1>
      <p className="mb-8 text-center text-sm text-muted-foreground">En az 8 karakter girin.</p>
      <ResetPasswordForm token={token} />
    </div>
  );
}
