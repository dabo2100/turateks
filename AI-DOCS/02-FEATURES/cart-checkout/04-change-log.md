# Change Log — Cart & checkout

### 2026-09-03 — Cart UI reference layout
- **Author:** AI session
- **Changes:** Redesigned `/sepet` to match cart reference: centered title, free-shipping progress bar with truck marker, product table (Ürün / Adet / Fiyat / Ara toplam), coupon input, bordered cart summary with free/express shipping radios and full-width checkout CTA. Kept tier pricing, qty/remove, taxMode/taxPercent, and `/odeme` handoff. Shipping fee and coupon are cart-page UI only for now.
- **Files:** `src/components/cart/cart-view.tsx`, `src/app/sepet/page.tsx`, `AI-DOCS/02-FEATURES/cart-checkout/*`

### 2026-08-22 — Cart + checkout
- **Author:** AI session
- **Changes:** Zustand persist cart, `/sepet`, `/odeme`, `POST /api/checkout` creates Order with server-side prices
- **Files:** `src/lib/cart-store.ts`, `src/components/cart/*`, `src/app/api/checkout/route.ts`

### 2026-08-22 — Feature docs created
- **Author:** Planning session
