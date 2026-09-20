# Change Log — WordPress seed

### 2026-09-15 — cPanel snapshot restored locally
- **Author:** Codex
- **What:** Installed MySQL 8.4 locally, loaded `turateksyagmurlu_k.sql` into read-only source database `turkey_wp`, extracted the supplied uploads archive, pushed the Prisma schema, and imported 21 published products + 49 images with 0 missing images.
- **Safety:** `wp-upload/`, `.mysql-data/`, and `.mysql-runtime/` are gitignored. The importer now validates that products and uploads exist before writing and no longer clears unrelated app products globally.
- **Commands:** `npm run db:start`, `npm run db:push`, `npm run db:import:wp`.
- **Source fact:** The supplied dump contains 0 `product_variation` posts, so no WooCommerce variation rows are available to import.
- **Files:** `.gitignore`, `package.json`, `scripts/start-local-mysql.mjs`, `prisma/seed-from-wp.ts`.

### 2026-08-26 — WS-001 map documented
- WP tables → Prisma table added to `01-feature-brief.md`. Seed script already implemented the map.

### 2026-08-23 — Redirect table
- WP permalink map implemented in `src/lib/wp-redirects.ts` (301 + 410). Source: WP options `/%postname%/`, Woo product_base `/urun`.

### 2026-08-22 — Seed from WP dump (`app/sql/local.sql`)
- **Author:** AI session
- **Changes:** Imported dump into `turkey_wp`, seeded 21 products + 49 images into `turkey`, copied files to `public/uploads`, catalog/PDP/home read Prisma
- **Files:** `prisma/seed-from-wp.ts`, `src/lib/catalog.ts`

### 2026-08-22 — Local MySQL `turkey` + Prisma
- **Author:** AI session
- **Changes:** Prisma 6 schema (catalog tables), `DATABASE_URL` in gitignored `.env`, `db push` + seed of 8 mock products
- **Files:** `.env` (ignored), `.env.example`, `prisma/schema.prisma`, `prisma/seed.ts`, `src/lib/db.ts`

### 2026-08-22 — Feature docs created
- **Author:** Planning session
