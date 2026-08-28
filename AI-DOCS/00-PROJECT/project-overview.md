# Project Overview

## Product

**Turateks Yağmurluk** — manufacturer store for professional rainwear (balıkçı, kurye, inşaat, denizci) sold in **Turkey only**, Turkish UI, TRY.

Legacy site: WordPress + WooCommerce + BeTheme + Yoast + PayTR (Local: `../app/public/`).  
New site: Next.js full-stack in this folder. Visual language: Figma Make prototype (`most-stem-36137440.figma.site`).

## Goals

1. Real online checkout (PayTR, same merchant as WordPress).
2. One product + quantity price tiers + open variants (size/color/price).
3. Simple owner dashboard (later phase) — not a WordPress clone.
4. SEO-first: keep useful URLs, kill tag spam, `html lang=tr`.
5. Owner-editable legal pages, NAP, tax “included vs extra %”.

## Users

| Role | Access |
|------|--------|
| Guest | Catalog, PDP, cart, guest checkout |
| Customer | Account, orders, addresses |
| Owner / Admin | Dashboard CRUD, settings, orders, content, SEO |

No multi-language, no multi-currency in phase one.

## Source of truth

| Topic | Where |
|-------|--------|
| What to build | `AI-DOCS/` |
| Visual | Figma Make + tokens in `design-system-shell` |
| Legacy catalog | WordPress DB / `../app/public/` (seed feature) |
| Live brand facts | `turateksyagmurluk.com` (NAP to be unified in settings) |

## Deployment (owner)

VPS, PM2, Nginx, domain. Agents do not configure production unless asked. See `01-FOUNDATION/deployment-rules.md`.
