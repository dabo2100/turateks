import { ForgotPasswordForm } from "@/components/admin/forgot-password-form";

export default function AdminForgotPasswordPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-3xl bg-card p-8 shadow-sm">
        <h1 className="mb-2 text-center text-2xl font-semibold">Şifre sıfırlama</h1>
        <p className="mb-8 text-center text-sm text-muted-foreground">
          Yönetici e-postanızı yazın. Bağlantı e-posta veya sunucu konsoluna gider.
        </p>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
