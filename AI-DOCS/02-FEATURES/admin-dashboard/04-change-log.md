# Change Log — Admin dashboard

<<<<<<< HEAD
### 2026-09-07 — SaaS admin redesign + categories + image upload
- Mint SaaS visual system scoped under `.admin-app` (storefront orange unchanged).
- New shell: light sidebar groups, top header, rounded cards/tables across all admin screens.
- Product form: two-column SaaS layout, size chips, wholesale/retail toggle, drag-drop image upload to `/uploads/products/`.
- Categories CRUD at `/admin/kategoriler`. Wholesale products get `Toptan` tag and stay on `/toptan`.
- **Files:** `src/app/admin/**`, `src/components/admin/**`, `src/lib/admin-ui.ts`, `src/app/api/admin/upload/route.ts`, `src/app/globals.css`, AI-DOCS admin-dashboard
=======
### 2026-09-15 — Local `/admin` Prisma recovery
- **Author:** Codex
- **Cause:** `.env` targeted MySQL on `127.0.0.1:3306`, but no MySQL server was installed or listening. Storefront fallback hid the outage while admin correctly surfaced the Prisma initialization error.
- **What:** Added a local MySQL start command, pushed the Prisma schema, imported the WordPress snapshot, seeded six CMS pages, and verified the login page, login API, and authenticated `/admin` all return HTTP 200.
- **Current data:** 21 products, 3 categories, 49 product images, 21 price tiers, 6 pages, and the env-backed super admin.
- **Developer start:** `npm run dev` now runs `db:start` automatically through `predev`; `npm run db:start` remains available explicitly. MySQL is bound to `127.0.0.1` only.
- **Files:** `scripts/start-local-mysql.mjs`, `package.json`, `src/components/admin/admin-shell.tsx`.
>>>>>>> 1a60ce13e48154f667815bb05fdaefd62cc77af1

### 2026-08-23 — Admin drawer + min sidebar width
- Desktop nav at least 250px (`max(10%, 250px)`). Mobile: hamburger off-canvas drawer.
- Page headers/tables wrap on small screens; main pane still scrolls internally.

### 2026-08-23 — Admin shell layout
- Desktop: left nav `10%` width, matching `10%` padding on the right.
- Main column `overflow: auto` so the page itself does not scroll.

### 2026-08-23 — Admin email/password + extra admins
- Separate admin session; `/admin/giris` is email+password; `/admin/sifre-sifirla` sends a reset link; `/admin/kullanicilar` adds admins.
- Storefront OTP no longer grants admin.

### 2026-08-23 — Phase 8 owner panel
- **Author:** Implementation
- **What:** `/admin` gate (OTP + `ADMIN_EMAIL` / `User.role`), product CRUD with colors/sizes/tiers, order status, CMS/blog editors, NAP/tax settings.
- **Files:** `src/app/admin/**`, `src/lib/auth.ts`, `src/lib/cms.ts`, `src/lib/settings.ts`, `prisma/schema.prisma`

### 2026-08-22 — Feature docs created
- **Author:** Planning session
- **Note:** Implementation deferred to Phase 8
