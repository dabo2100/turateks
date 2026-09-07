# Change Log — Design system & shell

### 2026-08-29 — Self-host Outfit (and Geist Mono)
- Fixed `next/font` Google download failure by switching to `next/font/local` with files under `src/fonts/`.
- **Files:** `src/app/layout.tsx`, `src/fonts/outfit/Outfit-Variable.ttf`, `src/fonts/geist-mono/GeistMono-Variable.woff2`

### 2026-08-29 — Category showcase + Outfit typeface (DS-012)
- Added “Popüler Kategoriler” image grid (2×3) under the trust bar; cards link to catalog filters with product photos from `/public/uploads`.
- Replaced Geist Sans with **Outfit** sitewide for a cleaner geometric look (latin-ext for Turkish).
- **Files:** `src/components/home/category-showcase.tsx`, `home-landing.tsx`, `src/app/layout.tsx`, `src/app/globals.css`

### 2026-08-29 — Home trust bar under hero (DS-011)
- Replaced category quick-links under hero with a 4-column trust strip (icon + title + subtitle): toptan fiyatlar, PayTR güvenli ödeme, 24 saat hizmet, kolay iade.
- **Files:** `src/components/home/home-landing.tsx`

### 2026-08-29 — Hero slide interval 10s
- Hero background auto-advance set to 10 seconds.
- **Files:** `src/components/home/hero-section.tsx`

### 2026-08-29 — Hero videos replace stills (DS-010)
- Full-bleed hero slider now uses 2 muted autoplay looping videos; inactive slide pauses; `prefers-reduced-motion` pauses playback.
- **Assets:** `public/brand/hero/hero-1.mp4`, `hero-2.mp4` (moved from `turateks-next/` root)
- **Files:** `src/components/home/hero-section.tsx`

### 2026-08-28 — Hero AI slider + overlay (DS-009)
- Full-bleed hero with 2 AI-generated slides, gradient overlay for readable copy, glass stat cards, dot controls, auto-advance (7s), reduced-motion safe.
- **Assets:** `public/brand/hero/hero-factory.png`, `hero-harbor.png`
- **Files:** `src/components/home/hero-section.tsx`, `home-landing.tsx`

### 2026-08-28 — Home landing motion (DS-008)
- Motion.dev scroll reveals on all home sections; animated stat counters (37+, 200+, 50+); hero stagger; `prefers-reduced-motion` respected; mobile-friendly offsets.
- **Files:** `src/components/home/*`, `src/app/page.tsx`, `package.json` (`motion`)

### 2026-08-22 — Phase 2 chrome + home skeleton
- **Author:** AI session
- **Changes:** Sticky header with mobile menu, search/account/cart icons; richer footer + NAP; WhatsApp FAB; home sections (hero+stats, categories, catalog cards, reasons, wholesale, blog teasers); branded `not-found.tsx`
- **Reason:** Phase 2 exit
- **Files:** `src/components/layout/*`, `src/app/page.tsx`, `src/app/not-found.tsx`, `src/components/catalog/product-card.tsx`, `src/lib/*`

### 2026-08-22 — Phase 1 app foundation
- **Author:** AI session
- **Changes:** Next.js 16 + TS + Tailwind 4; shadcn/ui + Sonner; brand tokens (`#F58220`, `#333333`, copper, silver); official logo at `public/brand/logo.png`; placeholder header/footer; `lang=tr`; `.env.example`
- **Reason:** Phase 1 exit — branded shell
- **Files:** `package.json`, `src/app/*`, `src/components/layout/*`, `src/components/ui/*`, `src/app/globals.css`, `public/brand/logo.png`

### 2026-08-22 — Feature docs created
- **Author:** Planning session
- **Changes:** Brief, AC, backlog, decisions, session template
- **Reason:** Phase 0 AI-DOCS
- **Files:** `AI-DOCS/02-FEATURES/design-system-shell/`
