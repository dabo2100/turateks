"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

const addressSchema = z.object({
  name: z.string().trim().min(2, "Ad soyad gerekli"),
  phone: z.string().trim().min(10, "Telefon gerekli"),
  city: z.string().trim().min(2, "İl gerekli"),
  district: z.string().trim().min(2, "İlçe gerekli"),
  address: z.string().trim().min(8, "Adres gerekli"),
  company: z.string().trim().optional(),
  taxId: z.string().trim().optional(),
});

export async function saveAddress(formData: FormData) {
  const user = await getSessionUser();
  if (!user) return { error: "Oturum gerekli" };

  const parsed = addressSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    city: formData.get("city"),
    district: formData.get("district"),
    address: formData.get("address"),
    company: String(formData.get("company") ?? ""),
    taxId: String(formData.get("taxId") ?? ""),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Eksik alan" };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone,
      city: parsed.data.city,
      district: parsed.data.district,
      address: parsed.data.address,
      company: parsed.data.company || null,
      taxId: parsed.data.taxId || null,
    },
  });
  revalidatePath("/hesap");
  revalidatePath("/odeme");
  return { ok: true as const };
}
