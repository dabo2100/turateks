"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { fieldClass, labelClass } from "@/lib/admin-ui";

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Şifre en az 8 karakter olmalı");
      return;
    }
    if (password !== confirm) {
      toast.error("Şifreler eşleşmiyor");
      return;
    }
    setPending(true);
    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      if (!res.ok) {
        toast.error("Bağlantı geçersiz veya süresi dolmuş");
        return;
      }
      toast.success("Şifre güncellendi");
      router.push("/admin/giris");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className={labelClass}>
        Yeni şifre
        <input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={fieldClass}
        />
      </label>
      <label className={labelClass}>
        Yeni şifre (tekrar)
        <input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className={fieldClass}
        />
      </label>
      <Button type="submit" className="h-11 w-full rounded-2xl" disabled={pending}>
        {pending ? "Kaydediliyor…" : "Şifreyi kaydet"}
      </Button>
    </form>
  );
}
