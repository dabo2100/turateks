# Change Log — Product PDP

### 2026-08-29 — Description moved into tabs (PD-011)
- Purchase column keeps badge/title/SKU + price/tiers/variants/qty/CTA only — long description removed from above buy controls.
- New `ProductInfoTabs`: Detaylar / Malzeme / Beden & Kesim / Kargo & İade; detail image on the right (desktop); related section titled “Beğenebileceğiniz ürünler” + Tümünü gör.
- **Files:** `src/components/product/product-info-tabs.tsx`, `src/app/urunler/[slug]/page.tsx`

### 2026-08-29 — PDP style refresh + typed qty (PD-009, PD-010)
- Restyled PDP to match modern reference: vertical thumbs + large rounded gallery (zoom), badge/title/price stack, charcoal size pills, color rings, trust row.
- Keep tier table + live unit/line price; when qty unlocks a better tier, show base strikethrough + % indirim.
- Qty supports `+`/`−` and a typed field (`inputMode=numeric`, digits-only filter) so desktop keyboard and mobile number pad both work without letters.
- **Files:** `src/app/urunler/[slug]/page.tsx`, `src/components/product/product-gallery.tsx`, `product-buy-box.tsx`

### 2026-08-22 — PDP UI
- **Author:** AI session
- **Changes:** Gallery, color/size, qty, live tier price, specs, WhatsApp, related; Sepete Ekle toasts until cart (Phase 5)
- **Files:** `src/app/urunler/[slug]/page.tsx`, `src/components/product/*`

### 2026-08-22 — Feature docs created
- **Author:** Planning session
- **Files:** `AI-DOCS/02-FEATURES/product-pdp/`
