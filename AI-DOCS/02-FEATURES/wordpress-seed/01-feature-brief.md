# Feature Brief — WordPress seed

## Summary

One-way import: products, images, useful slugs, categories from Local WP (`../app/public` + MySQL `local`). Not a live WP connection.

## In scope

- Script `prisma/seed` or `scripts/seed-from-wp.ts`
- Copy images to `public/uploads`
- Curated tags only
- Print a 301 candidate list

## Out of scope

- Sync both ways
- Import orders, spam comments, pest-control demo pages
- BeTheme builder JSON as pages

## WP → Prisma map (WS-001)

Implemented in `prisma/seed-from-wp.ts`. Source DB: `turkey_wp`. App DB: `turkey`.

| WordPress | Prisma |
|-----------|--------|
| `wp_posts` (`product`, `publish`) | `Product` (slug = `post_name`) |
| `wp_postmeta` `_sku`, `_price` / `_regular_price` | `Product.sku`, `PriceTier.unitPrice` (kuruş) |
| `wp_postmeta` `_thumbnail_id`, `_product_image_gallery` | `ProductImage` |
| `wp_postmeta` `_wp_attached_file` + `wp-content/uploads` | copy → `public/uploads`, URL `/uploads/…` |
| `wp_terms` + `wp_term_taxonomy` `product_cat` | `Category` (skip `uncategorized`) |
| `wp_term_relationships` | `Product.categoryId` (first non-uncategorized) |
| Toptan category / “N adet” in title | `Product.wholesale` + tier `minQty` 10 |
| Orders, reviews, BeTheme pages | skipped |
