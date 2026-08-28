"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { formatTry } from "@/lib/mock-catalog";
import { resolveUnitPrice } from "@/lib/pricing";

type Step = "form" | "otp";

export type CheckoutDefaults = {
  name: string;
  email: string;
  phone: string;
  city: string;
  district: string;
  address: string;
  company: string;
  taxId: string;
};

export function CheckoutForm({ defaults }: { defaults?: CheckoutDefaults }) {
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");
  const [pending, setPending] = useState(false);
  const [email, setEmail] = useState(defaults?.email ?? "");
  const [code, setCode] = useState("");
  const [payload, setPayload] = useState<Record<string, string> | null>(null);

  const total = items.reduce((sum, line) => sum + resolveUnitPrice(line.tiers, line.qty) * line.qty, 0);

  if (items.length === 0) {
    return (
      <p className="text-muted-foreground">
        Sepet boş.{" "}
        <Link className="text-primary" href="/urunler">
          Ürünlere dön
        </Link>
      </p>
    );
  }

  async function sendCode(customer: Record<string, string>) {
    setPending(true);
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: customer.email, purpose: "checkout" }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(res.status === 429 ? `Biraz bekleyin (${data.wait}s)` : "Kod gönderilemedi");
        return;
      }
      setPayload(customer);
      setEmail(customer.email);
      setStep("otp");
      toast.success(data.hint ? "Kod konsola yazıldı (SMTP yok)" : "Kod e-postanıza gönderildi");
    } finally {
      setPending(false);
    }
  }

  async function onFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await sendCode({
      name: String(form.get("name")),
      email: String(form.get("email")).trim().toLowerCase(),
      phone: String(form.get("phone")),
      city: String(form.get("city")),
      district: String(form.get("district")),
      address: String(form.get("address")),
      company: String(form.get("company") || ""),
      taxId: String(form.get("taxId") || ""),
    });
  }

  async function onVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!payload) return;
    setPending(true);
    try {
      const verified = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code,
          purpose: "checkout",
          name: payload.name,
        }),
      });
      if (!verified.ok) {
        toast.error("Kod hatalı veya süresi doldu");
        return;
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            slug: i.slug,
            qty: i.qty,
            color: i.color,
            size: i.size,
          })),
          customer: payload,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message ?? data.error ?? "Sipariş oluşturulamadı");
        return;
      }
      clear();
      if (data.paytr && data.iframeToken) {
        router.push(`/odeme/${data.merchantOid}?token=${encodeURIComponent(data.iframeToken)}`);
        return;
      }
      toast.success("Sipariş alındı");
      router.push(`/odeme/basarili?oid=${data.merchantOid}`);
    } finally {
      setPending(false);
    }
  }

  if (step === "otp") {
    return (
      <form onSubmit={onVerify} className="mx-auto max-w-md space-y-4">
        <p className="text-sm text-muted-foreground">
          <strong>{email}</strong> adresine 4 haneli kod gönderildi. PayTR öncesi e-postanızı doğrulayın.
        </p>
        <label className="block text-sm">
          Doğrulama kodu
          <input
            inputMode="numeric"
            maxLength={4}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
            className="mt-1 w-full rounded-md border border-border p-3 text-center text-2xl tracking-[0.4em]"
            autoFocus
          />
        </label>
        <Button type="submit" className="h-11 w-full" disabled={pending || code.length !== 4}>
          {pending ? "Kontrol ediliyor…" : "Doğrula ve ödemeye geç"}
        </Button>
        <button
          type="button"
          className="w-full text-sm text-muted-foreground"
          onClick={() => payload && sendCode(payload)}
        >
          Kodu tekrar gönder
        </button>
        <button type="button" className="w-full text-sm text-muted-foreground" onClick={() => setStep("form")}>
          Adresi düzelt
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={onFormSubmit} className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-3">
        {defaults?.email ? (
          <p className="text-sm text-muted-foreground">Kayıtlı adresiniz dolduruldu. İsterseniz düzeltin.</p>
        ) : null}
        <Field name="name" label="Ad Soyad" required defaultValue={defaults?.name} />
        <Field
          name="email"
          label="E-posta"
          type="email"
          required
          defaultValue={defaults?.email}
          readOnly={Boolean(defaults?.email)}
        />
        <Field name="phone" label="Telefon" required defaultValue={defaults?.phone} />
        <Field name="city" label="İl" required defaultValue={defaults?.city} />
        <Field name="district" label="İlçe" required defaultValue={defaults?.district} />
        <label className="block text-sm">
          Adres
          <textarea
            name="address"
            required
            defaultValue={defaults?.address}
            className="mt-1 w-full rounded-md border border-border p-2"
            rows={3}
          />
        </label>
        <Field name="company" label="Firma (opsiyonel)" defaultValue={defaults?.company} />
        <Field name="taxId" label="VKN (opsiyonel)" defaultValue={defaults?.taxId} />
      </div>
      <div className="rounded-xl border border-border p-5">
        <p className="font-semibold">Sipariş özeti</p>
        <ul className="mt-3 space-y-2 text-sm">
          {items.map((line, i) => (
            <li key={i} className="flex justify-between gap-2">
              <span>
                {line.name} × {line.qty}
              </span>
              <span>{formatTry(resolveUnitPrice(line.tiers, line.qty) * line.qty)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-lg font-semibold">Toplam {formatTry(total)}</p>
        <Button type="submit" className="mt-6 h-11 w-full" disabled={pending}>
          {pending ? "Kod gönderiliyor…" : "Kodu e-postama gönder"}
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          Sonraki adım: 4 haneli kod. Kod doğruysa ödeme sayfasına geçilir.
        </p>
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  defaultValue,
  readOnly,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  readOnly?: boolean;
}) {
  return (
    <label className="block text-sm">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        readOnly={readOnly}
        className="mt-1 w-full rounded-md border border-border p-2 read-only:bg-muted"
      />
    </label>
  );
}
