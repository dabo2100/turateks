# AI-DOCS — Turateks Yağmurluk

Source of truth for every agent and developer. Chat is not the spec.

```
AI-DOCS/
  00-PROJECT/     facts, stack, scope, plan, global decisions
  01-FOUNDATION/  how we build
  02-FEATURES/    one folder per module
```

## Pick a feature

| Task | Folder |
|------|--------|
| Tokens, header, footer | `02-FEATURES/design-system-shell/` |
| Listing / filters / tags | `02-FEATURES/catalog-listing/` |
| Product page | `02-FEATURES/product-pdp/` |
| Cart / checkout | `02-FEATURES/cart-checkout/` |
| PayTR | `02-FEATURES/paytr-gateway/` |
| Login / account | `02-FEATURES/customer-auth-account/` |
| Quantity tiers / toptan | `02-FEATURES/wholesale-pricing/` |
| Legal + contact | `02-FEATURES/cms-legal-pages/` |
| Blog | `02-FEATURES/blog/` |
| Owner dashboard | `02-FEATURES/admin-dashboard/` |
| Sitemap / 301 | `02-FEATURES/seo-urls-redirects/` |
| Import from WP | `02-FEATURES/wordpress-seed/` |
| Tax / NAP | `02-FEATURES/site-settings/` |

Full table: `02-FEATURES/_index.md`.

## After every session

Update that feature `03-backlog.md` and `04-change-log.md`. Give the programmer the tests from `02-acceptance-criteria.md`.
