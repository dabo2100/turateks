import { ForgotPasswordForm } from "@/components/admin/forgot-password-form";

export default function AdminForgotPasswordPage() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-16">
      <h1 className="mb-2 text-center text-2xl font-semibold">Şifre sıfırlama</h1>
      <p className="mb-8 text-center text-sm text-muted-foreground">
        Yönetici e-postanızı yazın. Bağlantı e-posta veya sunucu konsoluna gider.
      </p>
      <ForgotPasswordForm />
    </div>
  );
}
