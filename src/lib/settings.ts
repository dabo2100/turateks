import { cache } from "react";

import { prisma } from "@/lib/db";
import { SITE } from "@/lib/site";

export type TaxMode = "included" | "extra";

export type SiteSettings = {
  name: string;
  tagline: string;
  phoneDisplay: string;
  phoneHref: string;
  email: string;
  whatsapp: string;
  address: string;
  taxMode: TaxMode;
  taxPercent: number;
  printTerms: boolean;
  googleSiteVerification: string;
};

const DEFAULTS: SiteSettings = {
  name: SITE.name,
  tagline: SITE.tagline,
  phoneDisplay: SITE.phoneDisplay,
  phoneHref: SITE.phoneHref,
  email: SITE.email,
  whatsapp: SITE.whatsapp,
  address: SITE.address,
  taxMode: "included",
  taxPercent: 20,
  printTerms: false,
  googleSiteVerification: "",
};

export function phoneHrefFromDisplay(display: string) {
  const digits = display.replace(/\D/g, "");
  if (!digits) return SITE.phoneHref;
  return `tel:+${digits.startsWith("90") ? digits : `90${digits.replace(/^0/, "")}`}`;
}

function parseSettings(rows: { key: string; value: string }[]): SiteSettings {
  const map = new Map(rows.map((r) => [r.key, r.value]));
  const taxMode = map.get("taxMode") === "extra" ? "extra" : "included";
  const taxPercent = Number(map.get("taxPercent") ?? DEFAULTS.taxPercent);
  return {
    name: map.get("name") || DEFAULTS.name,
    tagline: map.get("tagline") || DEFAULTS.tagline,
    phoneDisplay: map.get("phoneDisplay") || DEFAULTS.phoneDisplay,
    phoneHref: map.get("phoneHref") || phoneHrefFromDisplay(map.get("phoneDisplay") || DEFAULTS.phoneDisplay),
    email: map.get("email") || DEFAULTS.email,
    whatsapp: map.get("whatsapp") || DEFAULTS.whatsapp,
    address: map.get("address") || DEFAULTS.address,
    taxMode,
    taxPercent: Number.isFinite(taxPercent) ? taxPercent : DEFAULTS.taxPercent,
    printTerms: map.get("printTerms") === "true",
    googleSiteVerification: map.get("googleSiteVerification") || DEFAULTS.googleSiteVerification,
  };
}

export const getSettings = cache(async (): Promise<SiteSettings> => {
  const rows = await prisma.setting.findMany();
  if (rows.length === 0) return DEFAULTS;
  return parseSettings(rows);
});

export async function saveSettings(input: Omit<SiteSettings, "phoneHref">) {
  const phoneHref = phoneHrefFromDisplay(input.phoneDisplay);
  const entries: SiteSettings = { ...input, phoneHref };
  await prisma.$transaction(
    (Object.keys(entries) as (keyof SiteSettings)[]).map((key) =>
      prisma.setting.upsert({
        where: { key },
        create: { key, value: String(entries[key]) },
        update: { value: String(entries[key]) },
      }),
    ),
  );
  return entries;
}

export function applyTax(subtotalTry: number, settings: SiteSettings) {
  if (settings.taxMode !== "extra") {
    return { subtotal: subtotalTry, tax: 0, total: subtotalTry };
  }
  const tax = Math.round(subtotalTry * (settings.taxPercent / 100) * 100) / 100;
  return { subtotal: subtotalTry, tax, total: subtotalTry + tax };
}
