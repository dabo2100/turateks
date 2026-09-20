"use server";

import { z } from "zod";

import { sendContactEmail } from "@/lib/mail";
import { getSettings } from "@/lib/settings";

const schema = z.object({
  name: z.string().trim().min(2, "Ad soyad gerekli"),
  email: z.string().trim().email("Geçerli bir e-posta girin"),
  phone: z.string().trim().optional(),
  subject: z.string().trim().optional(),
  message: z.string().trim().min(10, "Mesaj en az 10 karakter olmalı"),
  website: z.string().optional(),
});

export async function submitContact(formData: FormData) {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    subject: formData.get("subject"),
    message: formData.get("message"),
    website: formData.get("website"),
  });
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Formu kontrol edin" };
  }
  if (parsed.data.website) {
    return { ok: true as const };
  }

  const settings = await getSettings();
  const to = process.env.CONTACT_TO_EMAIL || settings.email;
  try {
    const { name, email, phone, subject, message } = parsed.data;
    await sendContactEmail({ to, name, email, phone, subject, message });
    return { ok: true as const };
  } catch (error) {
    console.error(error);
    return { ok: false as const, error: "Mesaj gönderilemedi. Lütfen telefon veya WhatsApp deneyin." };
  }
}
