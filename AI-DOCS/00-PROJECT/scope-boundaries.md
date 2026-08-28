# Scope Boundaries

## In scope (MVP product)

- Turkish storefront matching Figma system (not pixel-copy of dummy copy)
- Catalog, category, tags (curated, not 2000 WP tags)
- PDP: gallery angles, variants, quantity tiers, WhatsApp quote
- Cart, checkout (TR address), PayTR iframe/hosted as on WP
- Customer account (orders, addresses, profile)
- Wholesale page + tier table on PDP
- CMS: Hakkımızda, İletişim, KVKK, Mesafeli Satış, İade, Ön Bilgilendirme
- Blog index + post
- SEO: metadata, sitemap, robots, 301 map, canonicals
- Site settings: tax mode, NAP, invoice-print-terms flag
- Seed products/images/slugs from WordPress
- Simple admin (after storefront is usable)

## Explicitly out of scope (until a decision says otherwise)

| Area | Status |
|------|--------|
| WordPress as runtime | ❌ Replaced |
| BeTheme / Slider Revolution / page builder | ❌ |
| Yoast News / Video modules | ❌ Unused |
| Migrating 2000 product tags as archives | ❌ Curate instead |
| Migrating spam reviews / failed test orders | ❌ Fresh commerce data |
| Second language / hreflang | ❌ |
| Marketplaces (Trendyol, Amazon) | ❌ |
| Native apps | ❌ |
| e-Fatura / e-Arşiv | ❌ Regular receipt only |
| Kapıda ödeme | ❌ Unless PayTR already had it **and** a decision approves |
| Inventory ERP / barcode hardware | ❌ |
| Chatbots other than WhatsApp link | ❌ |

## Change control

To add an out-of-scope item:

1. User approval
2. Row in `decisions-log.md`
3. Backlog + acceptance on the feature
