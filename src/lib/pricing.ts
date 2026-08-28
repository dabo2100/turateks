import type { PriceTier } from "@/lib/mock-catalog";

export function resolveUnitPrice(tiers: PriceTier[], qty: number) {
  const sorted = [...tiers].sort((a, b) => a.minQty - b.minQty);
  const match = [...sorted].reverse().find((t) => qty >= t.minQty);
  return match?.unitPrice ?? sorted[0]?.unitPrice ?? 0;
}

export function isTierActive(tier: PriceTier, qty: number) {
  if (qty < tier.minQty) return false;
  if (tier.maxQty == null) return qty >= tier.minQty;
  return qty <= tier.maxQty;
}

export function formatQtyRange(tier: PriceTier) {
  if (tier.maxQty == null) return `${tier.minQty}+ adet`;
  return `${tier.minQty}–${tier.maxQty} adet`;
}
