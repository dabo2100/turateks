# Project change log

### 2026-08-26 — Remaining phases 6 leftover + 8/9 close
- AU-005: `/hesap` teslimat adresi; `/odeme` prefill from session.
- WS-001 mapping documented. WP-001 / WP-004 marked done (already in schema + admin).
- Phase 9: PM2, Nginx sample, `/api/health`, security headers, Search Console field, owner checklist.
- Feature index: all MVP folders done.

### 2026-08-26 — Remaining phases closed
- AU-005: `/hesap` teslimat adresi; `/odeme` prefill.
- WS-001 mapping documented. WP-001 / WP-004 marked done.
- Phase 9: PM2, Nginx sample, `/api/health`, security headers, Search Console field, owner checklist.

### 2026-08-23 — Phase 7 content + SEO
- Sitemap, robots, unique TR metadata, JSON-LD, WP 301/410 map.
- Contact form on `/iletisim`. Legal/blog routes already existed; SEO wired through.

### 2026-08-23 — Admin password login
- `/admin` is email/password. Super admin seeded from env. Extra admins can be added in the panel. Password reset is a dedicated page + email link.

### 2026-08-23 — Phase 8 admin dashboard
- Owner panel at `/admin` (OTP + `ADMIN_EMAIL`). Products, orders, legal pages, blog, NAP/tax settings.
- Storefront legal/blog routes now read `Page` / `Post`.

### 2026-08-23 — Email OTP (checkout + login)
- 4-digit code via SMTP (or console if SMTP empty)
- Checkout cannot reach PayTR until email is verified

### 2026-08-22 — Phase 5 cart + PayTR
- Cart, checkout, Order tables, PayTR iframe/callback. Keys only in `.env`.
- **Next:** Phase 6 auth/account

### 2026-08-22 — MySQL `turkey` + Prisma
- App DB is `turkey` on `127.0.0.1:3306`, user `root`, password empty (`.env` only)
- Catalog tables created and mock-seeded. Storefront UI still reads mock until wired.

### 2026-08-22 — Phase 3 catalog + PDP
- Listing filters/sort/pagination; PDP variants + tiers; `/toptan`; mock 8 products
- **Next:** Phase 4 Prisma + WordPress seed

### 2026-08-22 — Phase 2 storefront chrome
- Mobile nav, Figma-like home skeleton, 404, WhatsApp FAB
- **Next:** Phase 3 catalog + PDP (`catalog-listing`, `product-pdp`)

### 2026-08-22 — Phase 1 app foundation
- Next.js 16 scaffold inside `turateks-next/` (AI-DOCS kept)
- shadcn + Sonner, brand tokens, logo, placeholder chrome
- **Next:** Phase 2 — DS-005 mobile nav, DS-006 home skeleton, DS-007 404

### 2026-08-22 — Phase 0 AI-DOCS
- Created `turateks-next/` beside WordPress
- Added `AI-DOCS` (project, foundation, 13 features)
- Added `AGENTS.md` (workspace + app) and Cursor rule `turateks-ai-docs.mdc`
- **Next:** Phase 1 scaffold — backlog `DS-001`
