# MVP Production Plan

Execute **in order**. Do not start a later phase while the previous exit criteria are red.

## Phase 0 — AI-DOCS ✅ (this session)

- [x] `turateks-next/` folder beside WordPress
- [x] `AI-DOCS` OS (project, foundation, features)
- [x] `AGENTS.md` + Cursor rule

**Exit:** Any new agent can find the active feature without chat history.

## Phase 1 — App foundation ✅

**Docs:** `design-system-shell`

1. Next.js + TypeScript + Tailwind + ESLint ✅
2. shadcn/ui + Sonner ✅
3. Folder layout `src/app`, `src/components`, `src/lib` ✅
4. CSS tokens from logo (`#F58220`, `#333333`, …) ✅
5. `.env.example` (no real secrets) ✅

**Exit:** `npm run dev` shows a branded empty shell (header/footer placeholders). ✅

**Human test:** open `/`, see header + orange token, no WP.

## Phase 2 — Design system + chrome ✅

**Docs:** `design-system-shell`

Header, footer, nav (`Ürünler`, `Toptan`, `Hakkımızda`, `Blog`, `İletişim`), WhatsApp FAB, real logo file. ✅

**Exit:** Home skeleton matches Figma structure (dark hero, catalog strip) with placeholder products. ✅

## Phase 3 — Catalog + PDP (static or seeded mock) ✅

**Docs:** `catalog-listing`, `product-pdp`, `wholesale-pricing`

Filters, tags, sort, product card + hover angles, PDP gallery, size/color, qty stepper, tier table. ✅

**Exit:** Browse `/urunler` → PDP → variant required before add-to-cart (UI). ✅

## Phase 4 — Prisma + seed from WordPress ✅

**Docs:** `wordpress-seed`, `site-settings`

MySQL, Prisma schema, seed products/images/slugs. No spam orders. ✅

**Exit:** Catalog reads DB, not hardcoded demo SKUs. ✅

## Phase 5 — Cart + checkout + PayTR ✅

**Docs:** `cart-checkout`, `paytr-gateway`

Cart persist, checkout, pending order, PayTR iframe if keys in `.env`. ✅

**Exit:** Test PayTR payment on staging keys; order stored.

## Phase 6 — Auth + account ✅

**Docs:** `customer-auth-account`

Passwordless email OTP (4 digits). Checkout verifies email before PayTR. `/hesap` order list. ✅

**Exit:** Login with email+code; checkout requires code. SMTP via `.env`.

## Phase 7 — Content + blog + legal + SEO ✅

**Docs:** `cms-legal-pages`, `blog`, `seo-urls-redirects`

**Exit:** Sitemap, legal routes, 301 table for old WP URLs.

## Phase 8 — Admin dashboard ✅

**Docs:** `admin-dashboard`

Owner CRUD: products, variants, tiers, tags, pages, blog, settings, orders. ✅

**Exit:** Owner can change a price and a legal page without a developer. ✅

## Phase 9 — Launch hardening ✅

**Docs:** `launch-hardening`

- [x] VPS notes + owner checklist (`00-PROJECT/launch-checklist.md`)
- [x] PM2 `ecosystem.config.cjs`
- [x] Nginx sample `deploy/nginx.conf.example`
- [x] Search Console verification in `/admin/ayarlar` + metadata
- [x] Health check `GET /api/health`
- [x] Security headers in `next.config.ts`
- Production PayTR keys: owner sets `PAYTR_TEST_MODE=0` on the VPS (not committed)

**Exit:** Owner can follow the checklist without an agent SSH.
