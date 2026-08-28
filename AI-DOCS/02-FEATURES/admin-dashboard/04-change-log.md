# Change Log — Admin dashboard

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
