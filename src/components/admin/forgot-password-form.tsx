"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { fieldClass, labelClass } from "@/lib/admin-ui";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        toast.error("İstek gönderilemedi");
        return;
      }
      toast.success("Varsa bu adrese sıfırlama bağlantısı gönderildi. SMTP yoksa sunucu konsoluna yazılır.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className={labelClass}>
        E-posta
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={fieldClass}
        />
      </label>
      <Button type="submit" className="h-11 w-full rounded-2xl" disabled={pending}>
        {pending ? "Gönderiliyor…" : "Sıfırlama bağlantısı gönder"}
      </Button>
      <p className="text-center text-sm">
        <Link href="/admin/giris" className="font-medium text-foreground/70 hover:text-foreground">
          Girişe dön
        </Link>
      </p>
    </form>
  );
}
