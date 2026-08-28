# Change Log — WordPress seed

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
