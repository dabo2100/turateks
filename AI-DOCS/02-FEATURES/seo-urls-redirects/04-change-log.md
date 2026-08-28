# Change Log — SEO

### 2026-08-23 — Phase 7 SEO + redirects
- Unique TR metadata, canonicals, Open Graph on public pages; noindex on sepet/hesap/odeme/admin.
- `sitemap.ts` lists only indexable URLs. `robots.ts` blocks private paths.
- JSON-LD: Organization, Product, BreadcrumbList, Article.
- WP 301 map in `next.config.ts` (`/urun/:slug` → `/urunler/:slug`, leftover `/shop`). 410 for `/hizmetlerimiz` and tag archives via `src/proxy.ts`.

### 2026-08-22 — Feature docs created
- **Author:** Planning session
