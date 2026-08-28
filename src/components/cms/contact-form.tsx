"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { submitContact } from "@/app/iletisim/actions";
import { Button } from "@/components/ui/button";
import { fieldClass } from "@/lib/admin-ui";

export function ContactForm() {
  const [pending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);

  return (
    <form
      className="mt-8 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(async () => {
          const result = await submitContact(data);
          if (!result.ok) {
            toast.error(result.error);
            return;
          }
          setSent(true);
          toast.success("Mesajınız alındı. En kısa sürede dönüş yapacağız.");
          e.currentTarget.reset();
        });
      }}
    >
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />
      <label className="block text-sm">
        Ad soyad
        <input name="name" required className={fieldClass} />
      </label>
      <label className="block text-sm">
        E-posta
        <input name="email" type="email" required className={fieldClass} />
      </label>
      <label className="block text-sm">
        Telefon
        <input name="phone" required className={fieldClass} />
      </label>
      <label className="block text-sm">
        Mesaj
        <textarea name="message" required minLength={10} className={`${fieldClass} min-h-32`} />
      </label>
      <Button type="submit" className="h-10 px-4" disabled={pending || sent}>
        {pending ? "Gönderiliyor…" : sent ? "Gönderildi" : "Gönder"}
      </Button>
    </form>
  );
}
