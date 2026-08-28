# SEO Rules

- `lang="tr"` on `<html>`.
- Unique `title` + `description` per indexable URL (admin fields later; sensible defaults now).
- Canonical per page.
- `sitemap.ts` + `robots.ts`.
- Product URL pattern: `/urunler/[slug]` (Figma). Map old WP `/urun/` via 301 table.
- Do not index: cart, checkout, account, admin, thank-you, search if thin.
- JSON-LD: Organization, Product, BreadcrumbList, Article on posts.
- One NAP from settings (Home, footer, contact, schema).
- Do not recreate thousands of tag archives. Curated tags only.
