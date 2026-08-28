"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function LoginForm({ redirectTo = "/hesap" }: { redirectTo?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [pending, setPending] = useState(false);

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose: "login" }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(res.status === 429 ? `Bekleyin (${data.wait}s)` : "Kod gönderilemedi");
        return;
      }
      setStep("code");
      toast.success(data.hint ? "SMTP yok — kod konsolda" : "Kod e-postanıza geldi");
    } finally {
      setPending(false);
    }
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, purpose: "login" }),
      });
      if (!res.ok) {
        toast.error("Kod hatalı");
        return;
      }
      toast.success("Giriş yapıldı");
      router.push(redirectTo);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  if (step === "code") {
    return (
      <form onSubmit={verify} className="mx-auto max-w-sm space-y-4">
        <p className="text-sm text-muted-foreground">
          <strong>{email}</strong> adresine 4 haneli kod gönderildi.
        </p>
        <input
          inputMode="numeric"
          maxLength={4}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
          className="w-full rounded-md border border-border p-3 text-center text-2xl tracking-[0.4em]"
        />
        <Button type="submit" className="h-11 w-full" disabled={pending || code.length !== 4}>
          Giriş yap
        </Button>
        <button type="button" className="w-full text-sm text-muted-foreground" onClick={() => setStep("email")}>
          E-postayı değiştir
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={sendCode} className="mx-auto max-w-sm space-y-4">
      <label className="block text-sm">
        E-posta
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-md border border-border p-2"
        />
      </label>
      <Button type="submit" className="h-11 w-full" disabled={pending}>
        {pending ? "Gönderiliyor…" : "Kod gönder"}
      </Button>
    </form>
  );
}
