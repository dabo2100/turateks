"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import { saveSettings, type TaxMode } from "@/lib/settings";

export async function saveSiteSettings(formData: FormData) {
  await requireAdmin();
  await saveSettings({
    name: String(formData.get("name") ?? ""),
    tagline: String(formData.get("tagline") ?? ""),
    phoneDisplay: String(formData.get("phoneDisplay") ?? ""),
    email: String(formData.get("email") ?? ""),
    whatsapp: String(formData.get("whatsapp") ?? "").replace(/\D/g, ""),
    address: String(formData.get("address") ?? ""),
    taxMode: formData.get("taxMode") === "extra" ? "extra" : "included",
    taxPercent: Number(formData.get("taxPercent") ?? 20),
    printTerms: formData.get("printTerms") === "on",
    googleSiteVerification: String(formData.get("googleSiteVerification") ?? "").trim(),
  } satisfies {
    name: string;
    tagline: string;
    phoneDisplay: string;
    email: string;
    whatsapp: string;
    address: string;
    taxMode: TaxMode;
    taxPercent: number;
    printTerms: boolean;
    googleSiteVerification: string;
  });
  revalidatePath("/", "layout");
  revalidatePath("/iletisim");
  revalidatePath("/sepet");
  revalidatePath("/admin/ayarlar");
}
