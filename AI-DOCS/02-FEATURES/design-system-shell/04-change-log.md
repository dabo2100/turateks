# Change Log — Design system & shell

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
